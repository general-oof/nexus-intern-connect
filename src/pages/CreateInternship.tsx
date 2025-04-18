
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }).max(500, {
    message: "Description must be at most 500 characters.",
  }),
  openings: z.coerce.number().min(1, {
    message: "At least one opening is required.",
  }),
  duration: z.string().min(2, {
    message: "Duration is required.",
  }),
  mode: z.enum(["Online", "Hybrid", "Pilani", "Goa", "Hyderabad"], {
    required_error: "Please select a mode.",
  }),
  deadline: z.string().min(1, {
    message: "Deadline is required.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "At least one skill is required.",
  }),
  stipend: z.string().optional(),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  customQuestions: z.array(
    z.object({
      question: z.string().min(5, {
        message: "Question must be at least 5 characters.",
      }),
    })
  ).optional(),
  requiresResume: z.boolean(),
  requiresLinkedin: z.boolean(),
  providesCertificate: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const CreateInternship = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newSkill, setNewSkill] = useState("");
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      openings: 1,
      duration: "",
      mode: "Online",
      deadline: new Date().toISOString().split('T')[0],
      skills: [],
      stipend: "",
      contactEmail: "",
      customQuestions: [{ question: "" }],
      requiresResume: true,
      requiresLinkedin: false,
      providesCertificate: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customQuestions",
  });
  
  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    
    const skills = form.getValues("skills");
    if (skills.includes(newSkill.trim())) {
      toast({
        title: "Skill already added",
        description: "This skill is already in your list.",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue("skills", [...skills, newSkill.trim()]);
    setNewSkill("");
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    const skills = form.getValues("skills");
    form.setValue(
      "skills",
      skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      // In a real app, you would submit this to the database
      console.log("Internship data:", data);
      
      toast({
        title: "Internship created!",
        description: "Your internship listing has been successfully created.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating internship:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your internship listing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="nexus-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Internship</h1>
            <p className="text-gray-600">
              List an internship position to find talented BITS students
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
              <CardDescription>
                Provide information about the internship opportunity you're offering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Title*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Frontend Developer Intern" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Description* (50-500 characters)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the internship role, responsibilities, and what you're looking for in an intern..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-right">
                            {field.value.length}/500 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="openings"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Openings*</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration*</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 3 months, 6 weeks" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mode & Preferred Campus*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Online">Online</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
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
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Deadline*</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="stipend"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stipend (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., ₹15,000 per month" {...field} />
                            </FormControl>
                            <FormDescription>
                              Leave blank if unpaid or to be discussed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email*</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="skills"
                      render={() => (
                        <FormItem>
                          <FormLabel>Required Skills*</FormLabel>
                          <div className="flex">
                            <FormControl>
                              <Input
                                placeholder="e.g., React, Python, Data Analysis"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="flex-grow"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSkill();
                                  }
                                }}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddSkill}
                              className="ml-2"
                            >
                              <Plus size={16} className="mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            {form.getValues("skills").map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="ml-1 hover:bg-gray-200 rounded-full p-1"
                                >
                                  <X size={12} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          
                          {form.getValues("skills").length === 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                              No skills added yet. Add at least one skill.
                            </p>
                          )}
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Custom Questions (Optional)</h3>
                      <p className="text-sm text-gray-500">
                        Add up to 2 custom questions for applicants to answer
                      </p>
                      
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-2">
                          <FormField
                            control={form.control}
                            name={`customQuestions.${index}.question`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input
                                    placeholder={`Custom question #${index + 1}`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1 && !fields[0].question}
                          >
                            <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
                          </Button>
                        </div>
                      ))}
                      
                      {fields.length < 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => append({ question: "" })}
                          className="flex items-center gap-1"
                        >
                          <Plus size={16} />
                          Add Question
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <FormField
                        control={form.control}
                        name="requiresResume"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Resume Required?</FormLabel>
                              <FormDescription>
                                Require applicants to upload their resume
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="requiresLinkedin"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">LinkedIn Required?</FormLabel>
                              <FormDescription>
                                Require applicants to provide LinkedIn profile
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="providesCertificate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:col-span-2">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Certificate Provided?</FormLabel>
                              <FormDescription>
                                Will interns receive a certificate upon completion?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => navigate("/startup")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-nexus-300 hover:bg-nexus-400">
                      Create Internship
                    </Button>
                  </div>
                </form>
              </Form>
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

export default CreateInternship;
