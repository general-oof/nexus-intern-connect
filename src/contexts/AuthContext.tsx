
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

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("nexusUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("nexusUser");
      }
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (session) {
          // Get stored user data if available to preserve userType and profileCompleted
          let storedUserData = null;
          try {
            const storedUser = localStorage.getItem("nexusUser");
            if (storedUser) {
              storedUserData = JSON.parse(storedUser);
            }
          } catch (e) {
            console.error("Error parsing stored user data", e);
          }

          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || "",
            // Preserve user type and profile completion status if available
            userType: storedUserData?.userType || null,
            profileCompleted: storedUserData?.profileCompleted || false
          };
          setUser(userData);
          localStorage.setItem("nexusUser", JSON.stringify(userData));
          
          // Don't redirect if already on profile completion pages
          const currentPath = window.location.pathname;
          if (!userData.userType && !['/student-profile', '/startup-profile', '/login'].includes(currentPath)) {
            navigate('/student-profile');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem("nexusUser");
          navigate('/');
        }
      }
    );

    // Check initial session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get stored user data if available
          let storedUserData = null;
          try {
            const storedUser = localStorage.getItem("nexusUser");
            if (storedUser) {
              storedUserData = JSON.parse(storedUser);
            }
          } catch (e) {
            console.error("Error parsing stored user data", e);
          }

          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || "",
            // Preserve user type and profile completion status if available
            userType: storedUserData?.userType || null,
            profileCompleted: storedUserData?.profileCompleted || false
          };
          setUser(userData);
          localStorage.setItem("nexusUser", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      localStorage.removeItem("nexusUser");
      
      toast({
        title: "Signed out",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "Something went wrong while signing out.",
        variant: "destructive",
      });
    }
  };

  const setUserType = (type: UserType) => {
    if (user) {
      const updatedUser = { ...user, userType: type };
      setUser(updatedUser);
      localStorage.setItem("nexusUser", JSON.stringify(updatedUser));
    }
  };

  const setProfileCompleted = (completed: boolean) => {
    if (user) {
      const updatedUser = { ...user, profileCompleted: completed };
      setUser(updatedUser);
      localStorage.setItem("nexusUser", JSON.stringify(updatedUser));
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
