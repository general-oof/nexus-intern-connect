
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Aarav Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop",
      bio: "BITS Pilani alumnus with a passion for connecting students with real-world opportunities."
    },
    {
      name: "Priya Patel",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
      bio: "With experience in both startups and education, Priya drives the operational excellence at Nexus."
    },
    {
      name: "Vikram Singh",
      role: "Technical Lead",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop",
      bio: "Computer Science graduate from BITS who believes in leveraging technology to solve real-world problems."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-2">About Nexus</h1>
            <p className="text-gray-600">
              Building bridges between BITS talent and startup innovation
            </p>
          </div>
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Nexus was founded with a simple but powerful mission: to create meaningful connections between the talented students of BITS Pilani campuses and the innovative startups that are shaping our future. We believe that these connections can spark extraordinary growth—both for students seeking real-world experience and for startups looking for fresh talent and perspectives.
              </p>
              <p className="mt-4 text-gray-700">
                By streamlining the internship discovery and application process, we aim to remove barriers and create opportunities that might otherwise be missed. Our platform is designed to highlight the unique strengths of BITS students while giving startups access to a pool of highly skilled and motivated individuals.
              </p>
            </CardContent>
          </Card>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardContent className="pt-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-nexus-300 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-nexus-400 mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>How Nexus began</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Nexus was born out of a firsthand experience with the challenges that BITS students face when looking for meaningful internship opportunities. Our founders, themselves BITS alumni, noticed that despite the incredible talent pool at BITS campuses, many students struggled to connect with innovative startups that aligned with their interests and career goals.
              </p>
              <p className="mt-4 text-gray-700">
                Similarly, many startups—especially early-stage ones—found it difficult to reach qualified students from top institutions like BITS. Recognizing this gap, we created Nexus as a dedicated platform to bridge these two worlds, facilitating connections that benefit both sides.
              </p>
              <p className="mt-4 text-gray-700">
                Since our launch, we've helped hundreds of students find internships that have kickstarted their careers, while providing startups with access to top-tier talent that has contributed significantly to their growth.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>The principles that guide us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-bold text-nexus-300 mb-2">Quality Connections</h3>
                  <p className="text-gray-600">
                    We prioritize meaningful matches over quantity, ensuring that both students and startups find the right fit.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-nexus-300 mb-2">Opportunity for All</h3>
                  <p className="text-gray-600">
                    We believe every BITS student deserves access to quality opportunities regardless of their background.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-nexus-300 mb-2">Innovation First</h3>
                  <p className="text-gray-600">
                    We support startups that are pushing boundaries and creating positive change in the world.
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

export default AboutPage;
