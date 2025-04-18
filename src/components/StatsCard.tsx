
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Briefcase, Users } from "lucide-react";

interface StatsCardProps {
  startupCount: number;
  studentCount: number;
  internshipCount: number;
}

const StatsCard = ({ startupCount, studentCount, internshipCount }: StatsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{startupCount}</div>
          <p className="text-xs text-muted-foreground">
            Companies looking for talent
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentCount}</div>
          <p className="text-xs text-muted-foreground">
            BITS students registered on Nexus
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{internshipCount}</div>
          <p className="text-xs text-muted-foreground">
            Open positions across all startups
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
