import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js'; // Import Supabase User type

// Keep UserType definition
type UserType = "student" | "startup" | null;

// Keep User interface definition
interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  profileCompleted: boolean;
}

// Keep AuthContextType definition
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserType: (type: UserType) => void; // Keep this if used elsewhere
  setProfileCompleted: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation(); // Get location

  // --- Helper function to create initial profile ---
  const createInitialUserProfile = async (supabaseUser: SupabaseUser, intendedType: UserType): Promise<User | null> => {
    if (!intendedType) {
      console.error("Cannot create profile: Intended user type is missing.");
      toast({
        title: "Account Creation Error",
        description: "Could not determine account type. Please try logging in again.",
        variant: "destructive",
      });
      await supabase.auth.signOut(); // Sign out the user if type is missing
      return null;
    }

    try {
      const { data: newUserProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: supabaseUser.id,
          user_type: intendedType,
          profile_completed: false,
          // email: supabaseUser.email // You might want to store email here too if needed
          // created_at, updated_at will be handled by DB defaults usually
        })
        .select()
        .single();

      if (insertError) {
        // Handle potential race condition or unique constraint violation if profile was created somehow between checks
        if (insertError.code === '23505') { // Unique violation
             console.warn("Profile already exists, fetching existing profile.");
             return fetchAndSetUser(supabaseUser); // Try fetching again
        } else {
             throw insertError;
        }
      }

      if (!newUserProfile) {
          throw new Error("Failed to create or retrieve user profile after insert.");
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || supabaseUser.email || "User", // Fallback name
        userType: newUserProfile.user_type as UserType,
        profileCompleted: newUserProfile.profile_completed || false,
      };
      return userData;

    } catch (error) {
      console.error("Error creating initial user profile:", error);
      toast({
        title: "Account Setup Failed",
        description: "Could not set up your profile. Please contact support.",
        variant: "destructive",
      });
      await supabase.auth.signOut(); // Sign out on error
      return null;
    }
  };

  // --- Helper function to fetch existing profile and set user state ---
   const fetchAndSetUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
        try {
            const { data: existingProfile, error: fetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'not found' error here, handled elsewhere
                 throw fetchError;
            }

            if (!existingProfile) return null; // Return null if not found

            let userType: UserType = null;
            if (existingProfile.user_type === 'student' || existingProfile.user_type === 'startup') {
                userType = existingProfile.user_type as UserType;
            }

            const userData: User = {
                id: supabaseUser.id,
                email: supabaseUser.email || "",
                name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || supabaseUser.email || "User",
                userType: userType,
                profileCompleted: existingProfile.profile_completed || false,
            };
            return userData;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast({
                title: "Error Loading Profile",
                description: "Could not load your profile data.",
                variant: "destructive",
            });
            await supabase.auth.signOut(); // Sign out on error
            return null;
        }
    };


  // --- Main useEffect for Auth State Changes ---
  useEffect(() => {
    setLoading(true); // Ensure loading is true at the start

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, "Session:", !!session);

        if (event === 'SIGNED_IN' && session) {
          setLoading(true); // Set loading while processing sign in

          // Read and immediately remove the intended user type
          const intendedType = localStorage.getItem('intendedUserType') as UserType | null;
          if (intendedType) {
            localStorage.removeItem('intendedUserType');
            console.log("Intended user type from localStorage:", intendedType);
          } else {
            console.log("No intended user type found in localStorage.");
             // This case might happen on refresh during OAuth flow or if login page wasn't used correctly
             // We'll rely on fetching the existing profile or handling the error in createInitialUserProfile
          }


          let fetchedUser = await fetchAndSetUser(session.user);

          if (!fetchedUser) {
            // User exists in Supabase Auth but not in our profiles table - likely a new user
            console.log("No existing profile found, creating new one...");
            fetchedUser = await createInitialUserProfile(session.user, intendedType);
          }

          if (fetchedUser) {
             setUser(fetchedUser);
             console.log("User set:", fetchedUser);

            // Redirect logic
            const currentPath = location.pathname;
            console.log("Current path:", currentPath);

            if (!fetchedUser.profileCompleted) {
              const targetProfilePath = fetchedUser.userType === 'student' ? '/student-profile' : '/startup-profile';
              if (currentPath !== targetProfilePath && currentPath !== '/login') {
                console.log(`Redirecting to profile setup: ${targetProfilePath}`);
                navigate(targetProfilePath, { replace: true });
              } else {
                 console.log("Already on correct profile setup page or login page.");
              }
            } else {
              // User profile is complete, redirect to appropriate dashboard
              const targetDashboardPath = fetchedUser.userType === 'student' ? '/student' : '/startup';
               if (![targetDashboardPath, '/student-profile', '/startup-profile'].includes(currentPath) ) { // Avoid redirect loop if already there
                 console.log(`Redirecting to dashboard: ${targetDashboardPath}`);
                 navigate(targetDashboardPath, { replace: true });
               } else {
                 console.log("Already on correct dashboard or profile page.");
               }
            }
          } else {
            // Handle case where user fetch/creation failed
            setUser(null);
             if (location.pathname !== '/login') {
                navigate('/login', { replace: true });
            }
          }
          setLoading(false); // Loading finished after processing

        } else if (event === 'SIGNED_OUT') {
          console.log("Sign out event detected.");
          setUser(null);
          localStorage.removeItem('intendedUserType'); // Clean up just in case
           if (location.pathname !== '/login') { // Only navigate if not already on login
              navigate('/login', { replace: true });
           }
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
            // Handle initial session load (similar logic to SIGNED_IN but might not have intendedType)
             if (session) {
                setLoading(true);
                let fetchedUser = await fetchAndSetUser(session.user);
                if (fetchedUser) {
                    setUser(fetchedUser);
                    console.log("Initial session user set:", fetchedUser);
                    // Add redirection logic here as well if needed on initial load
                    const currentPath = location.pathname;
                     if (!fetchedUser.profileCompleted) {
                         const targetProfilePath = fetchedUser.userType === 'student' ? '/student-profile' : '/startup-profile';
                         if (!['/student-profile', '/startup-profile', '/login'].includes(currentPath)) {
                            navigate(targetProfilePath, { replace: true });
                         }
                     } else {
                         // Optionally redirect to dashboard if they land on '/' for example
                         if (currentPath === '/') {
                              const targetDashboardPath = fetchedUser.userType === 'student' ? '/student' : '/startup';
                              navigate(targetDashboardPath, { replace: true });
                         }
                     }

                } else {
                    // User in Supabase Auth but not in profiles, and no 'SIGNED_IN' event to trigger creation?
                    // This is less likely but could happen. Maybe sign them out?
                    console.warn("Initial session found, but no user profile. Signing out.");
                    await supabase.auth.signOut();
                    setUser(null);
                     if (location.pathname !== '/login') {
                        navigate('/login', { replace: true });
                    }
                }
                 setLoading(false);
            } else {
                 // No initial session
                 setUser(null);
                 setLoading(false);
            }
        } else if (event === 'USER_UPDATED' && session) {
             // Handle user updates if necessary, e.g., email change confirmation
             console.log("User updated event");
             let fetchedUser = await fetchAndSetUser(session.user);
              if (fetchedUser) {
                 setUser(fetchedUser);
              }
             // Usually no redirect needed here unless profile completion status changes
        } else if (event === 'PASSWORD_RECOVERY') {
             // Handle password recovery flow if using email/password
             console.log("Password recovery event");
             setLoading(false); // Ensure loading is false
        } else if (event === 'TOKEN_REFRESHED') {
            console.log("Token refreshed event");
             // No state change needed usually
             // setLoading(false); // Might not be needed unless initial state was loading
        } else {
             // Other events or no session
             // Only set loading to false if it's not SIGNED_IN/INITIAL_SESSION which handle their own loading state
             if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') {
                setLoading(false);
             }
        }
      }
    );

    // No need for the explicit getSession() call anymore, onAuthStateChange handles INITIAL_SESSION

    return () => {
      console.log("Unsubscribing from AuthStateChange");
      subscription.unsubscribe();
    };
  // location dependency added for redirect logic
  }, [navigate, location]);

  // setUserType function: Primarily for profile setup page, not initial login type setting.
  // This function should ONLY update an existing profile, not create one.
  const setUserType = async (type: UserType) => {
    if (user && type) {
      setLoading(true);
      try {
        // Use update here, assuming the profile exists
        const { error } = await supabase
          .from('user_profiles')
          .update({ user_type: type })
          .eq('id', user.id);

        if (error) throw error;

        // Update local state *after* successful DB update
        setUser((currentUser) => currentUser ? { ...currentUser, userType: type } : null);

        // Navigate after setting type during profile creation
        const profilePath = type === 'student' ? '/student-profile' : '/startup-profile';
        navigate(profilePath);

      } catch (error) {
        console.error("Error setting user type:", error);
        toast({
          title: "Error",
          description: "Failed to set user type. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Cannot set user type: No user logged in or type is null.");
      toast({ title: "Error", description: "You must be logged in to set a user type.", variant: "destructive" });
    }
  };


  const setProfileCompleted = async (completed: boolean) => {
    if (user) {
      setLoading(true); // Indicate loading
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ profile_completed: completed })
          .eq('id', user.id);

        if (error) throw error;

        const updatedUser = { ...user, profileCompleted: completed };
        setUser(updatedUser); // Update state immediately

        if (completed) {
          // Redirect based on user type AFTER state is updated
          const targetPath = updatedUser.userType === 'student' ? '/student' : '/startup';
          console.log(`Profile completed, navigating to: ${targetPath}`);
          navigate(targetPath, { replace: true });
        } else {
           // If setting to incomplete, redirect back to profile page?
           const profilePath = user.userType === 'student' ? '/student-profile' : '/startup-profile';
            console.log(`Profile marked incomplete, navigating to: ${profilePath}`);
            navigate(profilePath, { replace: true });
        }

      } catch (error) {
        console.error("Error updating profile completion:", error);
        toast({
          title: "Error",
          description: "Failed to update profile status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }
  };

  // signInWithGoogle function remains the same - it just starts the flow
  const signInWithGoogle = async () => {
    try {
      // setIsLoading(true); // Loading is handled by the calling component now
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Redirect back to the app root
        }
      });

      if (error) throw error;

      // Toast for successful sign-in initiation might be misleading as the user leaves the page.
      // Better to show welcome toast *after* successful sign-in is processed by onAuthStateChange.
      // toast({
      //   title: "Redirecting to Google...",
      // });

    } catch (error) {
      console.error("Error initiating Google sign in:", error);
      localStorage.removeItem('intendedUserType'); // Clean up storage
      toast({
        title: "Sign in failed",
        description: "Could not redirect to Google. Please try again.",
        variant: "destructive",
      });
      // setIsLoading(false); // Reset loading if error happens *before* redirect
      throw error; // Re-throw for the calling component to handle
    }
    // No finally needed here as redirect happens on success
  };

  // signOut function remains largely the same
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // setUser(null); // State is updated via onAuthStateChange SIGNED_OUT event
      localStorage.removeItem('intendedUserType'); // Clean up storage on sign out

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      // navigate("/login"); // Navigation is handled by onAuthStateChange now
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
       setLoading(false); // Ensure loading is false on error
    }
     // No finally needed as SIGNED_OUT event handles loading state
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        setUserType, // Expose if needed for profile creation page
        setProfileCompleted
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook remains the same
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};