
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { mockInternships } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Calendar, Clock, MapPin, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock applied internships data (would come from database in real app)
const mockAppliedInternships = [
  {
    id: "a1",
    internshipId: "i1",
    status: "Pending",
    appliedDate: "2025-04-12"
  },
  {
    id: "a2",
    internshipId: "i2",
    status: "Shortlisted",
    appliedDate: "2025-04-10"
  },
  {
    id: "a3",
    internshipId: "i5",
    status: "Rejected",
    appliedDate: "2025-04-08"
  }
];

const AppliedPositions = () => {
  const navigate = useNavigate();
  
  // Get full internship details for each application
  const appliedPositions = mockAppliedInternships.map((application) => {
    const internship = mockInternships.find(
      (i) => i.id === application.internshipId
    );
    return {
      ...application,
      internship
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Applications</h1>
          <p className="text-gray-600">
            Track the status of internships you've applied to
          </p>
        </div>
        
        {appliedPositions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-medium mb-3">No applications yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't applied to any internships yet. Start exploring opportunities!
              </p>
              <Button
                className="bg-nexus-300 hover:bg-nexus-400"
                onClick={() => navigate("/internships")}
              >
                Browse Internships
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Track the status and details of your internship applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appliedPositions.map((position) => (
                    position.internship && (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">
                          {position.internship.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building size={16} className="text-gray-500" />
                            <span>{position.internship.startupName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-gray-500" />
                              <span>{position.internship.mode}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-gray-500" />
                              <span>{position.internship.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-500" />
                              <span>Due {new Date(position.internship.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(position.appliedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              position.status === "Shortlisted"
                                ? "default"
                                : position.status === "Rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {position.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Application Tips</CardTitle>
              <CardDescription>
                Improve your chances of getting shortlisted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-nexus-400">Tailor Your Resume</h3>
                  <p className="text-sm text-gray-600">
                    Customize your resume for each application to highlight relevant skills and experiences.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-nexus-400">Be Specific</h3>
                  <p className="text-sm text-gray-600">
                    In your personal pitch, mention specific projects or achievements that relate to the role.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-nexus-400">Follow Up</h3>
                  <p className="text-sm text-gray-600">
                    If you don't hear back after a week, consider sending a polite follow-up email.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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

export default AppliedPositions;
