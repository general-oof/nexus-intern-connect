
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { mockInternships } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InternshipsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<string>("all");
  const [domain, setDomain] = useState<string>("all");
  const [filteredInternships, setFilteredInternships] = useState(mockInternships);
  const [activeFilters, setActiveFilters] = useState<{mode?: string, domain?: string}>({});

  // Extract unique domains from internships
  const uniqueDomains = Array.from(
    new Set(mockInternships.map((internship) => {
      // This is a simplification; in a real app, you'd have proper domain data
      return internship.startupId.charAt(0) === 's' ? 'Technology' : 'Business';
    }))
  );

  // Extract unique modes
  const uniqueModes = Array.from(
    new Set(mockInternships.map((internship) => internship.mode))
  );

  // Filter logic
  useEffect(() => {
    let filtered = mockInternships;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (mode !== "all") {
      filtered = filtered.filter(internship => internship.mode === mode);
    }

    // This is a simplification; in a real app, you'd filter by actual domains
    if (domain !== "all") {
      filtered = filtered.filter(internship => {
        if (domain === "Technology") {
          return internship.startupId.charAt(0) === 's';
        } else {
          return internship.startupId.charAt(0) !== 's';
        }
      });
    }

    setFilteredInternships(filtered);
    
    // Update active filters
    const newActiveFilters: {mode?: string, domain?: string} = {};
    if (mode !== "all") newActiveFilters.mode = mode;
    if (domain !== "all") newActiveFilters.domain = domain;
    setActiveFilters(newActiveFilters);
    
  }, [searchTerm, mode, domain]);

  const clearFilters = () => {
    setMode("all");
    setDomain("all");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Internships</h1>
          <p className="text-gray-600">
            Explore and apply to internship opportunities at innovative startups
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Search and Filter</CardTitle>
            <CardDescription>
              Find the perfect internship opportunity that matches your interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by mode" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Mode</SelectLabel>
                    <SelectItem value="all">All Modes</SelectItem>
                    {uniqueModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by domain" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Domain</SelectLabel>
                    <SelectItem value="all">All Domains</SelectItem>
                    {uniqueDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {(Object.keys(activeFilters).length > 0 || searchTerm) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {searchTerm}
                    </Badge>
                  )}
                  {activeFilters.mode && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Mode: {activeFilters.mode}
                    </Badge>
                  )}
                  {activeFilters.domain && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Domain: {activeFilters.domain}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">No matching internships found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 font-medium">
              Found {filteredInternships.length} internship{filteredInternships.length !== 1 && 's'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          </>
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

export default InternshipsList;
