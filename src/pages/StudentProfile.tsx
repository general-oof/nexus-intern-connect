
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const DOMAINS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "Blockchain",
  "IoT",
  "Artificial Intelligence",
  "Business Development",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Strategy",
  "Consulting",
] as const;

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  birthYear: z.coerce.number().min(1980, {
    message: "Birth year must be after 1980.",
  }).max(new Date().getFullYear() - 15, {
    message: "You must be at least 15 years old.",
  }),
  campus: z.enum(["Pilani", "Goa", "Hyderabad"]),
  bitsId: z.string().min(5, {
    message: "BITS ID number must be at least 5 characters.",
  }),
  branch: z.string().min(2, {
    message: "Branch is required.",
  }),
  dualDegreeBranch: z.string().optional(),
  minorDegree: z.string().optional(),
  domainsOfInterest: z.array(z.string()).min(1, {
    message: "Select at least one domain of interest.",
  }).max(3, {
    message: "You can select up to 3 domains of interest.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  whatsappNumber: z.string().optional(),
  linkedinProfile: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }).optional().or(z.literal("")),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const StudentProfile = () => {
  const { user, setUserType, setProfileCompleted } = useAuth();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || "",
      birthYear: 2000,
      campus: "Pilani" as const,
      bitsId: "",
      branch: "",
      dualDegreeBranch: "",
      minorDegree: "",
      domainsOfInterest: [],
      email: user?.email || "",
      whatsappNumber: "",
      linkedinProfile: "",
      website: "",
    },
  });

  const handleSelectDomain = (domain: string) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domain)) {
        return prev.filter((d) => d !== domain);
      }
      if (prev.length >= 3) {
        toast({
          title: "Maximum domains selected",
          description: "You can select up to 3 domains of interest.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, domain];
    });
    
    form.setValue("domainsOfInterest", selectedDomains);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // In a real app, you would save this to the database
      console.log("Student profile data:", data);
      
      // Set user type to student and mark profile as completed
      setUserType("student");
      setProfileCompleted(true);
      
      toast({
        title: "Profile created",
        description: "Your student profile has been created successfully.",
      });
      
      navigate("/student");
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="nexus-container">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Your Student Profile</CardTitle>
            <CardDescription className="text-center">
              Tell us about yourself so we can help you find the perfect internship
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Year*</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Academic Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="campus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BITS Campus*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select campus" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pilani">Pilani</SelectItem>
                              <SelectItem value="Goa">Goa</SelectItem>
                              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bitsId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BITS ID Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="2020ABCD1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch*</FormLabel>
                          <FormControl>
                            <Input placeholder="Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dualDegreeBranch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dual Degree Branch (if applicable)</FormLabel>
                          <FormControl>
                            <Input placeholder="Economics" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="minorDegree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minor Degree (if applicable)</FormLabel>
                          <FormControl>
                            <Input placeholder="Data Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="domainsOfInterest"
                    render={() => (
                      <FormItem>
                        <FormLabel>Domains of Interest* (max 3)</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {DOMAINS.map((domain) => (
                            <Button
                              key={domain}
                              type="button"
                              variant={selectedDomains.includes(domain) ? "default" : "outline"}
                              className={selectedDomains.includes(domain) ? "bg-nexus-300" : ""}
                              onClick={() => handleSelectDomain(domain)}
                            >
                              {domain}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Email ID*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="linkedinProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Website / Portfolio</FormLabel>
                          <FormControl>
                            <Input placeholder="https://johndoe.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-nexus-300 hover:bg-nexus-400"
                  >
                    Complete Profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
