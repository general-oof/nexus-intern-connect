
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("nexusUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      // This is a mock implementation; replace with Supabase auth
      setLoading(true);
      
      // Simulate a successful login
      const mockUser = {
        id: "mock-id-" + Math.random().toString(36).substr(2, 9),
        email: "user@example.com",
        name: "John Doe",
        userType: null as UserType,
        profileCompleted: false
      };
      
      setUser(mockUser);
      localStorage.setItem("nexusUser", JSON.stringify(mockUser));
      
      toast({
        title: "Signed in successfully",
        description: "Welcome to Nexus!",
      });
      
      navigate("/student-profile");
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
      // This is a mock implementation; replace with Supabase auth
      localStorage.removeItem("nexusUser");
      setUser(null);
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
