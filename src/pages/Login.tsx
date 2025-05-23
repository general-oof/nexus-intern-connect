import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

type UserType = "student" | "startup";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState<UserType | null>(null); // Track loading state per type
  const { theme } = useTheme();
  const { toast } = useToast(); // Initialize toast

  const handleSignIn = async (userType: UserType) => {
    setIsLoading(userType); // Set loading state for the specific button
    try {
      // Store the intended user type before initiating OAuth
      localStorage.setItem('intendedUserType', userType);
      await signInWithGoogle();
      // No need to reset isLoading here, page will redirect or state will change
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem('intendedUserType'); // Clean up on error
      toast({ // Show error toast
        title: "Sign in failed",
        description: "Something went wrong during sign-in. Please try again.",
        variant: "destructive",
      });
      setIsLoading(null); // Reset loading state on error
    }
    // No finally block needed as successful sign-in navigates away
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path fill="none" d="M1 1h22v22H1z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-nexus-300 mb-2">Nexus</h1>
        <p className="text-lg text-foreground">Connecting BITS students with startup opportunities</p>
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-xl border-nexus-100 dark:border-nexus-600 bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">Join Nexus</CardTitle>
            <CardDescription className="text-muted-foreground">
              Are you a student looking for internships or a startup seeking talent?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                onClick={() => handleSignIn("student")}
                disabled={isLoading !== null} // Disable both if one is loading
              >
                <GoogleIcon />
                <span>
                  {isLoading === "student" ? "Processing..." : "Continue as Student"}
                </span>
              </Button>

              <Button
                className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                onClick={() => handleSignIn("startup")}
                disabled={isLoading !== null} // Disable both if one is loading
              >
                <GoogleIcon />
                <span>
                  {isLoading === "startup" ? "Processing..." : "Continue as Startup"}
                </span>
              </Button>

              <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-muted-foreground bg-card">
                    Sign in with Google
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-2">
                <p>First time here? Choose your role above to sign up and create your profile.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;