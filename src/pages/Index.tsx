
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      if (!user.profileCompleted) {
        if (user.userType === "student") {
          navigate("/student-profile");
        } else if (user.userType === "startup") {
          navigate("/startup-profile");
        }
      } else {
        if (user.userType === "student") {
          navigate("/student");
        } else if (user.userType === "startup") {
          navigate("/startup");
        }
      }
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-nexus-100 dark:from-gray-900 dark:to-gray-800">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="nexus-container flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-nexus-300">Nexus</span>
            <span className="ml-1 text-sm text-gray-500">BITS Connect</span>
          </div>
          <Button onClick={() => navigate("/login")} className="bg-nexus-300 hover:bg-nexus-400">
            Sign In
          </Button>
        </div>
      </header>
      
      <section className="py-16 sm:py-24">
        <div className="nexus-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Connecting <span className="text-nexus-300">BITS</span> talent with innovative startups
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Nexus is the platform that bridges the gap between BITS Pilani students and startup opportunities, creating meaningful internship connections.
            </p>
            <Button onClick={() => navigate("/login")} size="lg" className="bg-nexus-300 hover:bg-nexus-400 text-lg">
              Get Started <ChevronRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="nexus-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-nexus-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-nexus-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up and create your student or startup profile with all relevant details.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-nexus-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-nexus-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Students can browse through internships while startups can list new positions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-nexus-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-nexus-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Grow</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Apply to positions, get shortlisted, and start your journey with innovative startups.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="nexus-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold text-nexus-300">Nexus</span>
                <span className="ml-1 text-xs text-gray-400">BITS Connect</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                © {new Date().getFullYear()} Nexus. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-8">
              <a href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <a href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
