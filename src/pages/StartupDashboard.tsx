
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import InternshipCard from "@/components/InternshipCard";
import { mockInternships, mockApplications, Internship, Application } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const StartupDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("listings");
  
  // Assuming the first startup in the mock data is the current user's startup
  const startupId = "s1";
  const myInternships = mockInternships.filter(
    (internship) => internship.startupId === startupId
  );
  
  // Mock applications (would come from database in real app)
  const myApplications = [
    {
      id: "a1",
      internshipId: "i1",
      studentId: "st1",
      studentName: "Amit Kumar",
      studentEmail: "amit@example.com",
      studentWhatsapp: "+919876543210",
      resume: "https://example.com/resume.pdf",
      linkedin: "https://linkedin.com/in/amitkumar",
      pitch: "I am passionate about machine learning and have completed several projects in this domain. I am looking forward to applying my skills to real-world problems.",
      answers: [
        {
          question: "What projects have you worked on that involved machine learning?",
          answer: "I have worked on image classification using CNNs, sentiment analysis using LSTM, and a recommendation system using collaborative filtering."
        },
        {
          question: "Are you familiar with medical imaging datasets?",
          answer: "Yes, I have worked with the MNIST dataset for digit recognition and have some experience with X-ray image classification for pneumonia detection."
        }
      ],
      status: "Pending",
      appliedDate: "2025-04-12"
    } as Application,
    {
      id: "a2",
      internshipId: "i1",
      studentId: "st2",
      studentName: "Priya Singh",
      studentEmail: "priya@example.com",
      studentWhatsapp: "+919876543211",
      resume: "https://example.com/resume2.pdf",
      linkedin: "https://linkedin.com/in/priyasingh",
      pitch: "I am a computer science student with a strong foundation in Python and TensorFlow. I am eager to contribute to your AI team.",
      answers: [
        {
          question: "What projects have you worked on that involved machine learning?",
          answer: "I've implemented a fraud detection system using anomaly detection algorithms and developed a chatbot using NLP techniques."
        },
        {
          question: "Are you familiar with medical imaging datasets?",
          answer: "I have not worked with medical imaging specifically, but I am familiar with image processing techniques and eager to learn."
        }
      ],
      status: "Shortlisted",
      appliedDate: "2025-04-13"
    } as Application
  ];
  
  const handleUpdateStatus = (applicationId: string, newStatus: "Pending" | "Shortlisted" | "Rejected") => {
    // In a real app, this would update the database
    toast({
      title: "Status updated",
      description: `Application status changed to ${newStatus}.`,
    });
  };
  
  const handleEmailApplicant = (email: string) => {
    // In a real app, this might open an email client or a modal
    window.open(`mailto:${email}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Startup Dashboard</h1>
            <p className="text-gray-600">
              Manage your internship listings and applications
            </p>
          </div>
          <Button
            className="bg-nexus-300 hover:bg-nexus-400 flex items-center gap-2"
            onClick={() => navigate("/create-internship")}
          >
            <PlusCircle size={18} />
            List a New Position
          </Button>
        </div>
        
        <Tabs defaultValue="listings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">Your Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings" className="pt-6">
            {myInternships.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <h3 className="text-lg font-medium mb-2">No internships listed yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first internship listing to start receiving applications
                  </p>
                  <Button
                    className="bg-nexus-300 hover:bg-nexus-400"
                    onClick={() => navigate("/create-internship")}
                  >
                    Create Internship
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    showApplyButton={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="pt-6">
            {myApplications.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <h3 className="text-lg font-medium mb-2">No applications received yet</h3>
                  <p className="text-gray-500">
                    Applications will appear here once students apply to your internships
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Received Applications</CardTitle>
                  <CardDescription>
                    Review and manage applications to your internship positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myApplications.map((application) => {
                        const internship = mockInternships.find(
                          (i) => i.id === application.internshipId
                        );
                        
                        return (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="font-medium">{application.studentName}</div>
                              <div className="text-sm text-gray-500">{application.studentEmail}</div>
                            </TableCell>
                            <TableCell>{internship?.title || "Unknown Position"}</TableCell>
                            <TableCell>
                              {new Date(application.appliedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  application.status === "Shortlisted"
                                    ? "default"
                                    : application.status === "Rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEmailApplicant(application.studentEmail)}>
                                  Contact
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Status
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(application.id, "Pending")}>
                                      Mark as Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(application.id, "Shortlisted")}>
                                      Shortlist Candidate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(application.id, "Rejected")}>
                                      Reject Application
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-white shadow-md py-4 mt-12">
        <div className="nexus-container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nexus BITS Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StartupDashboard;
