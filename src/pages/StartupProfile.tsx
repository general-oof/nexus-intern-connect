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
import { supabase } from "@/integrations/supabase/client";

const DOMAINS = [
  "E-commerce",
  "EdTech",
  "FinTech",
  "HealthTech",
  "AgriTech",
  "CleanTech",
  "AI & ML",
  "Blockchain",
  "SaaS",
  "IoT",
  "Gaming",
  "Social Media",
  "FoodTech",
  "Travel Tech",
  "Real Estate Tech",
  "Logistics",
  "Analytics",
  "Consulting",
] as const;

const YEARS = Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => 2000 + i);

const formSchema = z.object({
  officialName: z.string().min(2, {
    message: "Official name must be at least 2 characters.",
  }),
  websiteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  yearOfIncorporation: z.coerce.number().min(2000, {
    message: "Year of incorporation must be 2000 or later.",
  }).max(new Date().getFullYear(), {
    message: "Year of incorporation cannot be in the future.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  logoUrl: z.string().url({
    message: "Please enter a valid logo URL.",
  }).optional().or(z.literal("")),
  summary: z.string().min(10, {
    message: "Summary must be at least 10 characters.",
  }).max(500, {
    message: "Summary cannot exceed 500 characters.",
  }),
  domainOfOperation: z.string({
    required_error: "Domain of operation is required.",
  }),
  founderName: z.string().min(2, {
    message: "Founder name must be at least 2 characters.",
  }),
  founderAge: z.coerce.number().min(18, {
    message: "Founder must be at least 18 years old.",
  }),
  founderEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  founderWhatsapp: z.string().optional(),
  founderLinkedin: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }).optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const StartupProfile = () => {
  const { user, setUserType, setProfileCompleted } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      officialName: "",
      websiteUrl: "https://",
      yearOfIncorporation: new Date().getFullYear(),
      location: "",
      logoUrl: "",
      summary: "",
      domainOfOperation: "",
      founderName: user?.name || "",
      founderAge: 25,
      founderEmail: user?.email || "",
      founderWhatsapp: "",
      founderLinkedin: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Set user type if not already set
      if (!user?.userType) {
        await setUserType("startup");
      }

      console.log("Creating startup profile for user:", user?.id);

      // Insert startup profile data
      const { error: profileError } = await supabase
        .from('startup_profiles')
        .upsert({
          id: user?.id,
          official_name: data.officialName,
          website_url: data.websiteUrl,
          year_of_incorporation: data.yearOfIncorporation,
          location: data.location,
          logo_url: data.logoUrl || null,
          summary: data.summary,
          domain_of_operation: data.domainOfOperation,
          founder_name: data.founderName,
          founder_age: data.founderAge,
          founder_email: data.founderEmail,
          founder_whatsapp: data.founderWhatsapp || null,
          founder_linkedin: data.founderLinkedin || null
        });

      if (profileError) {
        console.error("Error creating startup profile:", profileError);
        throw profileError;
      }

      console.log("Profile created, marking as completed");
      
      // Mark profile as completed
      await setProfileCompleted(true);
      
      toast({
        title: "Profile created",
        description: "Your startup profile has been created successfully.",
      });
      
      navigate("/startup");
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
            <CardTitle className="text-2xl text-center">Create Your Startup Profile</CardTitle>
            <CardDescription className="text-center">
              Tell us about your startup so we can connect you with the right talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Startup Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="officialName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Official Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL*</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="yearOfIncorporation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Incorporation*</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {YEARS.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <Input placeholder="Bangalore, India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="domainOfOperation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain of Operation*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DOMAINS.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary of what your startup does* (max 500 characters)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your startup's mission and what problems you're solving..." 
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs text-gray-500 text-right">
                          {field.value.length}/500 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Founder Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="founderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="founderAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age*</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="founderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Active Email ID*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="founder@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="founderWhatsapp"
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
                      name="founderLinkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/janedoe" {...field} />
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

export default StartupProfile;
