
import { Startup } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, MapPin } from "lucide-react";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={startup.logo} alt={startup.name} />
            <AvatarFallback className="bg-nexus-300 text-white">
              {startup.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{startup.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin size={14} />
              {startup.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-4 mb-3">{startup.summary}</p>
        <Badge variant="outline" className="bg-nexus-100 text-nexus-500 hover:bg-nexus-100">
          {startup.domain}
        </Badge>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>Founded {startup.founded}</span>
        </div>
        <a 
          href={startup.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-nexus-300 hover:text-nexus-500"
        >
          <Globe size={14} />
          <span>Website</span>
        </a>
      </CardFooter>
    </Card>
  );
};

export default StartupCard;
