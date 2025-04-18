
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.full_name || "",
            userType: null,
            profileCompleted: false
          };
          setUser(userData);
          localStorage.setItem("nexusUser", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("nexusUser");
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.full_name || "",
          userType: null,
          profileCompleted: false
        };
        setUser(userData);
        localStorage.setItem("nexusUser", JSON.stringify(userData));
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/student-profile'
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
