
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;

  let navLinks = [];
  
  if (!user) {
    navLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
  } else if (user.userType === "student") {
    navLinks = [
      { name: "Home", href: "/student" },
      { name: "Apply to Internships", href: "/internships" },
      { name: "Applied Positions", href: "/applied" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
  } else if (user.userType === "startup") {
    navLinks = [
      { name: "Home", href: "/startup" },
      { name: "List a New Position", href: "/create-internship" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-card shadow-sm dark:shadow-md border-b border-border">
      <div className="nexus-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-nexus-300">Nexus</span>
                <span className="ml-1 text-sm text-muted-foreground">BITS Connect</span>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive(link.href) 
                    ? "bg-nexus-300 text-white" 
                    : "text-foreground hover:bg-nexus-100 hover:text-nexus-500 dark:hover:text-nexus-300"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-nexus-300 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="bg-nexus-300 hover:bg-nexus-400">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-3 pt-2 bg-card animate-fade-in">
          <div className="space-y-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium
                  ${isActive(link.href) 
                    ? "bg-nexus-300 text-white" 
                    : "text-foreground hover:bg-nexus-100 hover:text-nexus-500 dark:hover:text-nexus-300"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-nexus-100 hover:text-nexus-500 dark:hover:text-nexus-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-base font-medium text-foreground"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
