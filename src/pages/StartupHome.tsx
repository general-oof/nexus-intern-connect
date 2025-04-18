
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StartupCard from "@/components/StartupCard";
import StatsCard from "@/components/StatsCard";
import { mockStartups, mockInternships, mockApplications } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";

const StartupHome = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStartups, setFilteredStartups] = useState(mockStartups);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStartups(mockStartups);
      return;
    }
    
    const filtered = mockStartups.filter(
      (startup) =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredStartups(filtered);
  }, [searchTerm]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Nexus</h1>
          <p className="text-gray-600">List internship positions and find talented BITS students</p>
        </div>
        
        <div className="mb-8">
          <StatsCard
            startupCount={mockStartups.length}
            studentCount={25} // Mock value
            internshipCount={mockInternships.length}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Ready to hire BITS talent?</h2>
              <p className="text-gray-600">Create a new internship listing to reach qualified students</p>
            </div>
            <Button
              className="bg-nexus-300 hover:bg-nexus-400 flex items-center gap-2"
              onClick={() => navigate("/create-internship")}
            >
              <PlusCircle size={18} />
              List a New Position
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search startups by name, domain, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            View Your Dashboard
          </Button>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Other Registered Startups</h2>
        
        {filteredStartups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No startups match your search criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        )}
      </div>
      
      <footer className="bg-white shadow-md py-4 mt-12">
        <div className="nexus-container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nexus BITS Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StartupHome;
