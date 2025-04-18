
import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserType = "student" | "startup" | null;

interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  profileCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserType: (type: UserType) => void;
  setProfileCompleted: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfileError) throw userProfileError;

      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const userProfile = await fetchUserProfile(session.user.id);
          
          // Convert string to proper UserType
          let userType: UserType = null;
          if (userProfile?.user_type === 'student' || userProfile?.user_type === 'startup') {
            userType = userProfile.user_type as UserType;
          }
          
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || "",
            userType: userType,
            profileCompleted: userProfile?.profile_completed || false
          };
          
          setUser(userData);
          
          // Redirect logic for profile completion
          const currentPath = window.location.pathname;
          if (!userProfile) {
            // New user, needs to choose profile type
            if (!['/student-profile', '/startup-profile', '/login'].includes(currentPath)) {
              navigate('/student-profile');
            }
          } else if (!userProfile.profile_completed) {
            // Profile type selected but not completed
            if (!['/student-profile', '/startup-profile', '/login'].includes(currentPath)) {
              navigate(userProfile.user_type === 'student' ? '/student-profile' : '/startup-profile');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const userProfile = await fetchUserProfile(session.user.id);
        
        // Convert string to proper UserType
        let userType: UserType = null;
        if (userProfile?.user_type === 'student' || userProfile?.user_type === 'startup') {
          userType = userProfile.user_type as UserType;
        }
        
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || "",
          userType: userType,
          profileCompleted: userProfile?.profile_completed || false
        };
        
        setUser(userData);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const setUserType = async (type: UserType) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            user_type: type,
            profile_completed: false
          });

        if (error) throw error;

        setUser({ ...user, userType: type, profileCompleted: false });
      } catch (error) {
        console.error("Error setting user type:", error);
        toast({
          title: "Error",
          description: "Failed to set user type. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const setProfileCompleted = async (completed: boolean) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({ profile_completed: completed })
          .eq('id', user.id);

        if (error) throw error;

        setUser({ ...user, profileCompleted: completed });

        if (completed) {
          // Redirect based on user type
          navigate(user.userType === 'student' ? '/student' : '/startup');
        }
      } catch (error) {
        console.error("Error updating profile completion:", error);
        toast({
          title: "Error",
          description: "Failed to update profile status. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: "Welcome to Nexus!",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description: "Something went wrong while signing in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out of your account.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "Something went wrong while signing out.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        setUserType,
        setProfileCompleted
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
