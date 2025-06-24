
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ViewType } from "@/pages/Index";
import { Plus, Users, Calendar, TrendingUp } from "lucide-react";

interface DashboardProps {
  selectedWorkspace: string;
  onProjectSelect: (project: string) => void;
  onViewChange: (view: ViewType) => void;
}

export function Dashboard({ selectedWorkspace, onProjectSelect, onViewChange }: DashboardProps) {
  const recentProjects = [
    { id: "project-1", name: "Product Alpha", progress: 75, lastUpdated: "2 hours ago", team: 5 },
    { id: "project-2", name: "Mobile Redesign", progress: 40, lastUpdated: "1 day ago", team: 3 },
    { id: "project-3", name: "User Onboarding", progress: 100, lastUpdated: "3 days ago", team: 4 },
  ];

  const recentArtifacts = [
    { id: "art-1", name: "Product Requirements Document", type: "PRD", project: "Product Alpha", updated: "1 hour ago" },
    { id: "art-2", name: "User Personas", type: "Personas", project: "Mobile Redesign", updated: "3 hours ago" },
    { id: "art-3", name: "Feature Specifications", type: "Features", project: "Product Alpha", updated: "5 hours ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Priya</h1>
          <p className="text-muted-foreground">Here's what's happening with your product team today.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artifacts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Projects you've been working on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                   onClick={() => {
                     onProjectSelect(project.id);
                     onViewChange('board');
                   }}>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{project.name}</p>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {project.team}
                    </Badge>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">Updated {project.lastUpdated}</p>
                </div>
                <div className="text-sm font-medium ml-4">{project.progress}%</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Artifacts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Artifacts</CardTitle>
            <CardDescription>Recently updated documents and artifacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentArtifacts.map((artifact) => (
              <div key={artifact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                   onClick={() => onViewChange('artifacts')}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{artifact.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {artifact.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{artifact.project}</p>
                  <p className="text-xs text-muted-foreground">Updated {artifact.updated}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
