
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Mock student profile data
const studentProfileData = {
  fullName: "Rahul Sharma",
  birthYear: 2003,
  campus: "Pilani",
  bitsId: "2022ABCD1234",
  branch: "Computer Science",
  dualDegreeBranch: "Economics",
  minorDegree: "",
  domainsOfInterest: ["Web Development", "Machine Learning", "Blockchain"],
  email: "rahul@example.com",
  whatsappNumber: "+919876543210",
  linkedinProfile: "https://linkedin.com/in/rahulsharma",
  website: "https://rahulsharma.example.com",
  resumeUrl: "https://example.com/resume.pdf"
};

// Mock startup profile data
const startupProfileData = {
  officialName: "TechNova",
  websiteUrl: "https://technova.example.com",
  yearOfIncorporation: 2019,
  location: "Bangalore, India",
  logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop",
  summary: "TechNova is leveraging artificial intelligence to revolutionize healthcare diagnostics, making medical diagnoses more accessible and accurate for everyone.",
  domainOfOperation: "AI & ML",
  founderName: "Vikram Mehta",
  founderAge: 28,
  founderEmail: "vikram@technova.example.com",
  founderWhatsapp: "+919876543211",
  founderLinkedin: "https://linkedin.com/in/vikrammehta"
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from database based on user ID
    if (user?.userType === "student") {
      setProfileData(studentProfileData);
    } else if (user?.userType === "startup") {
      setProfileData(startupProfileData);
    }
  }, [user]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // In a real app, this would save to database
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form data to original
    if (user?.userType === "student") {
      setProfileData(studentProfileData);
    } else if (user?.userType === "startup") {
      setProfileData(startupProfileData);
    }
    setIsEditing(false);
  };

  if (!user || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexus-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Profile</h1>
              <p className="text-gray-600">
                Manage your account information and preferences
              </p>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button className="bg-nexus-300 hover:bg-nexus-400" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </div>
          
          {user.userType === "student" ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" alt={profileData.fullName} />
                      <AvatarFallback className="bg-nexus-300 text-white text-xl">
                        {profileData.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{profileData.fullName}</CardTitle>
                      <CardDescription>
                        <Badge className="mt-1">{user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                  
                  {profileData.resumeUrl && (
                    <Button variant="outline" className="w-full md:w-auto" asChild>
                      <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="personal" className="mt-4">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Full Name</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.fullName}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label>Birth Year</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={profileData.birthYear}
                            onChange={(e) => setProfileData({ ...profileData, birthYear: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.birthYear}</div>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label>Domains of Interest</Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {profileData.domainsOfInterest.map((domain: string) => (
                            <Badge key={domain} variant="secondary">
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="academic">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Campus</Label>
                        <div className="text-gray-700 mt-1">{profileData.campus}</div>
                      </div>
                      
                      <div>
                        <Label>BITS ID</Label>
                        <div className="text-gray-700 mt-1">{profileData.bitsId}</div>
                      </div>
                      
                      <div>
                        <Label>Branch</Label>
                        <div className="text-gray-700 mt-1">{profileData.branch}</div>
                      </div>
                      
                      <div>
                        <Label>Dual Degree Branch</Label>
                        <div className="text-gray-700 mt-1">
                          {profileData.dualDegreeBranch || "None"}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Minor Degree</Label>
                        <div className="text-gray-700 mt-1">
                          {profileData.minorDegree || "None"}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Email</Label>
                        <div className="text-gray-700 mt-1">{profileData.email}</div>
                      </div>
                      
                      <div>
                        <Label>WhatsApp</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.whatsappNumber}
                            onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.whatsappNumber}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label>LinkedIn Profile</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.linkedinProfile}
                            onChange={(e) => setProfileData({ ...profileData, linkedinProfile: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">
                            <a href={profileData.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-nexus-300 hover:underline">
                              {profileData.linkedinProfile}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Label>Personal Website</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">
                            {profileData.website ? (
                              <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-nexus-300 hover:underline">
                                {profileData.website}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileData.logoUrl} alt={profileData.officialName} />
                      <AvatarFallback className="bg-nexus-300 text-white text-xl">
                        {profileData.officialName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{profileData.officialName}</CardTitle>
                      <CardDescription>
                        <Badge className="mt-1">{user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}</Badge>
                        <span className="ml-2">{profileData.domainOfOperation}</span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full md:w-auto" asChild>
                    <a href={profileData.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="company" className="mt-4">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="company">Company Info</TabsTrigger>
                    <TabsTrigger value="founder">Founder Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="company">
                    <div className="space-y-6">
                      <div>
                        <Label>About the Company</Label>
                        {isEditing ? (
                          <textarea
                            value={profileData.summary}
                            onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                            className="w-full mt-1 border rounded-md p-2 text-gray-700"
                            rows={4}
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.summary}</div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Year Founded</Label>
                          <div className="text-gray-700 mt-1">{profileData.yearOfIncorporation}</div>
                        </div>
                        
                        <div>
                          <Label>Location</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.location}
                              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <div className="text-gray-700 mt-1">{profileData.location}</div>
                          )}
                        </div>
                        
                        <div>
                          <Label>Domain of Operation</Label>
                          <div className="text-gray-700 mt-1">{profileData.domainOfOperation}</div>
                        </div>
                        
                        <div>
                          <Label>Logo URL</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.logoUrl}
                              onChange={(e) => setProfileData({ ...profileData, logoUrl: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <div className="text-gray-700 mt-1 truncate">
                              {profileData.logoUrl}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="founder">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Founder Name</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.founderName}
                            onChange={(e) => setProfileData({ ...profileData, founderName: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.founderName}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label>Age</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={profileData.founderAge}
                            onChange={(e) => setProfileData({ ...profileData, founderAge: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.founderAge}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label>Email</Label>
                        <div className="text-gray-700 mt-1">{profileData.founderEmail}</div>
                      </div>
                      
                      <div>
                        <Label>WhatsApp</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.founderWhatsapp}
                            onChange={(e) => setProfileData({ ...profileData, founderWhatsapp: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">{profileData.founderWhatsapp}</div>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label>LinkedIn Profile</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.founderLinkedin}
                            onChange={(e) => setProfileData({ ...profileData, founderLinkedin: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="text-gray-700 mt-1">
                            <a href={profileData.founderLinkedin} target="_blank" rel="noopener noreferrer" className="text-nexus-300 hover:underline">
                              {profileData.founderLinkedin}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <footer className="bg-white shadow-md py-4 mt-12">
        <div className="nexus-container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nexus BITS Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
