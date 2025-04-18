
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import StudentProfile from "./pages/StudentProfile";
import StartupProfile from "./pages/StartupProfile";
import StudentHome from "./pages/StudentHome";
import StartupHome from "./pages/StartupHome";
import InternshipsList from "./pages/InternshipsList";
import AppliedPositions from "./pages/AppliedPositions";
import CreateInternship from "./pages/CreateInternship";
import StartupDashboard from "./pages/StartupDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/startup-profile" element={<ProtectedRoute><StartupProfile /></ProtectedRoute>} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute userType="student"><StudentHome /></ProtectedRoute>} />
          <Route path="/internships" element={<ProtectedRoute userType="student"><InternshipsList /></ProtectedRoute>} />
          <Route path="/applied" element={<ProtectedRoute userType="student"><AppliedPositions /></ProtectedRoute>} />
          
          {/* Startup Routes */}
          <Route path="/startup" element={<ProtectedRoute userType="startup"><StartupHome /></ProtectedRoute>} />
          <Route path="/create-internship" element={<ProtectedRoute userType="startup"><CreateInternship /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute userType="startup"><StartupDashboard /></ProtectedRoute>} />
          
          {/* Common Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
