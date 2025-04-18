
export interface Startup {
  id: string;
  name: string;
  logo?: string;
  website: string;
  location: string;
  domain: string;
  founded: number;
  summary: string;
}

export interface Internship {
  id: string;
  startupId: string;
  startupName: string;
  startupLogo?: string;
  title: string;
  description: string;
  openings: number;
  duration: string;
  mode: "Online" | "Hybrid" | "Pilani" | "Goa" | "Hyderabad";
  deadline: string;
  skills: string[];
  stipend?: string;
  contactEmail: string;
  certificate: boolean;
  listingDate: string;
  customQuestions?: string[];
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentWhatsapp?: string;
  resume?: string;
  linkedin?: string;
  pitch: string;
  answers: { question: string; answer: string }[];
  status: "Pending" | "Shortlisted" | "Rejected";
  appliedDate: string;
}

export const mockStartups: Startup[] = [
  {
    id: "s1",
    name: "TechNova",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop",
    website: "https://technova.example.com",
    location: "Bangalore, India",
    domain: "AI & ML",
    founded: 2019,
    summary: "TechNova is leveraging artificial intelligence to revolutionize healthcare diagnostics, making medical diagnoses more accessible and accurate for everyone."
  },
  {
    id: "s2",
    name: "GreenScape",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    website: "https://greenscape.example.com",
    location: "Mumbai, India",
    domain: "CleanTech",
    founded: 2020,
    summary: "GreenScape is developing sustainable solutions for urban farming, enabling communities to grow fresh produce in limited spaces."
  },
  {
    id: "s3",
    name: "EduSpark",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop",
    website: "https://eduspark.example.com",
    location: "Delhi, India",
    domain: "EdTech",
    founded: 2018,
    summary: "EduSpark is transforming education through personalized learning experiences powered by data analytics and adaptive learning technologies."
  },
  {
    id: "s4",
    name: "FinWise",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    website: "https://finwise.example.com",
    location: "Pune, India",
    domain: "FinTech",
    founded: 2021,
    summary: "FinWise is democratizing financial planning with accessible tools that help individuals make informed decisions about their financial future."
  },
  {
    id: "s5",
    name: "HealthPulse",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
    website: "https://healthpulse.example.com",
    location: "Hyderabad, India",
    domain: "HealthTech",
    founded: 2020,
    summary: "HealthPulse is building a platform that connects patients with healthcare providers, streamlining the process of finding and booking medical appointments."
  },
  {
    id: "s6",
    name: "LogiTech",
    logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop",
    website: "https://logitech.example.com",
    location: "Chennai, India",
    domain: "Logistics",
    founded: 2019,
    summary: "LogiTech is optimizing supply chains through real-time tracking and analytics, reducing costs and environmental impact in the logistics industry."
  },
];

export const mockInternships: Internship[] = [
  {
    id: "i1",
    startupId: "s1",
    startupName: "TechNova",
    startupLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop",
    title: "Machine Learning Intern",
    description: "Join our AI team to develop cutting-edge algorithms for medical image analysis.",
    openings: 2,
    duration: "3 months",
    mode: "Online",
    deadline: "2025-05-30",
    skills: ["Python", "TensorFlow", "Computer Vision"],
    stipend: "₹20,000 per month",
    contactEmail: "careers@technova.example.com",
    certificate: true,
    listingDate: "2025-04-10",
    customQuestions: [
      "What projects have you worked on that involved machine learning?",
      "Are you familiar with medical imaging datasets?"
    ]
  },
  {
    id: "i2",
    startupId: "s2",
    startupName: "GreenScape",
    startupLogo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    title: "IoT Developer Intern",
    description: "Work on IoT solutions for monitoring plant health and automating urban farming systems.",
    openings: 3,
    duration: "6 months",
    mode: "Hybrid",
    deadline: "2025-05-15",
    skills: ["Arduino", "Raspberry Pi", "Sensors", "C++"],
    stipend: "₹15,000 per month",
    contactEmail: "tech@greenscape.example.com",
    certificate: true,
    listingDate: "2025-04-05"
  },
  {
    id: "i3",
    startupId: "s3",
    startupName: "EduSpark",
    startupLogo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop",
    title: "Frontend Developer Intern",
    description: "Develop intuitive user interfaces for our educational platform using modern web technologies.",
    openings: 2,
    duration: "4 months",
    mode: "Pilani",
    deadline: "2025-06-01",
    skills: ["React", "TypeScript", "UI/UX Design"],
    stipend: "₹18,000 per month",
    contactEmail: "developers@eduspark.example.com",
    certificate: true,
    listingDate: "2025-04-12"
  },
  {
    id: "i4",
    startupId: "s4",
    startupName: "FinWise",
    startupLogo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
    title: "Data Analyst Intern",
    description: "Analyze financial datasets and create insightful visualizations to help users understand complex financial concepts.",
    openings: 1,
    duration: "3 months",
    mode: "Goa",
    deadline: "2025-05-25",
    skills: ["SQL", "Python", "Data Visualization", "Financial Knowledge"],
    stipend: "₹16,000 per month",
    contactEmail: "data@finwise.example.com",
    certificate: false,
    listingDate: "2025-04-08"
  },
  {
    id: "i5",
    startupId: "s5",
    startupName: "HealthPulse",
    startupLogo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
    title: "Backend Developer Intern",
    description: "Build robust APIs and database structures for our healthcare scheduling platform.",
    openings: 2,
    duration: "5 months",
    mode: "Hyderabad",
    deadline: "2025-06-15",
    skills: ["Node.js", "MongoDB", "Express", "API Design"],
    stipend: "₹22,000 per month",
    contactEmail: "engineering@healthpulse.example.com",
    certificate: true,
    listingDate: "2025-04-15"
  },
  {
    id: "i6",
    startupId: "s6",
    startupName: "LogiTech",
    startupLogo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop",
    title: "Mobile App Developer Intern",
    description: "Develop features for our logistics tracking app used by thousands of delivery personnel.",
    openings: 3,
    duration: "4 months",
    mode: "Online",
    deadline: "2025-05-20",
    skills: ["Flutter", "Dart", "Firebase", "Maps API"],
    stipend: "₹19,000 per month",
    contactEmail: "mobile@logitech.example.com",
    certificate: true,
    listingDate: "2025-04-03"
  },
];

export const mockApplications: Application[] = [];
