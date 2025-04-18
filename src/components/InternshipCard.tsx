
import { Internship } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, Mail, Award, MapPin, User } from "lucide-react";

interface InternshipCardProps {
  internship: Internship;
  showApplyButton?: boolean;
}

const InternshipCard = ({ internship, showApplyButton = true }: InternshipCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={internship.startupLogo} alt={internship.startupName} />
              <AvatarFallback className="bg-nexus-300 text-white">
                {internship.startupName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{internship.title}</CardTitle>
              <CardDescription>{internship.startupName}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-secondary">
            Listed {formatDate(internship.listingDate)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">{internship.description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            <span>{internship.openings} {internship.openings > 1 ? 'openings' : 'opening'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span>{internship.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span>{internship.mode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span>Due {formatDate(internship.deadline)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {internship.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          
          {internship.stipend && (
            <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <span>Stipend:</span>
              <span>{internship.stipend}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Mail size={14} />
            <span>{internship.contactEmail}</span>
          </div>
          
          {internship.certificate && (
            <div className="flex items-center gap-1 text-sm text-nexus-400">
              <Award size={14} />
              <span>Certificate provided</span>
            </div>
          )}
        </div>
      </CardContent>
      {showApplyButton && (
        <CardFooter className="pt-2">
          <Button asChild className="w-full bg-nexus-300 hover:bg-nexus-400">
            <Link to={`/apply/${internship.id}`} state={{ internship }}>
              Apply Now
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default InternshipCard;
