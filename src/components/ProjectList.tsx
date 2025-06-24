
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Folder, FolderOpen } from "lucide-react";

interface ProjectListProps {
  workspaceId: string;
  selectedProject: string | null;
  onProjectSelect: (project: string | null) => void;
}

const projects = [
  { id: "project-1", name: "Product Alpha", status: "active", artifacts: 12 },
  { id: "project-2", name: "Mobile Redesign", status: "planning", artifacts: 8 },
  { id: "project-3", name: "User Onboarding", status: "completed", artifacts: 15 },
];

export function ProjectList({ workspaceId, selectedProject, onProjectSelect }: ProjectListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarMenu>
      {projects.map((project) => (
        <SidebarMenuItem key={project.id}>
          <SidebarMenuButton 
            isActive={selectedProject === project.id}
            onClick={() => onProjectSelect(project.id)}
            className="flex flex-col items-start gap-1 h-auto p-3"
          >
            <div className="flex items-center gap-2 w-full">
              {selectedProject === project.id ? 
                <FolderOpen className="h-4 w-4" /> : 
                <Folder className="h-4 w-4" />
              }
              <span className="font-medium">{project.name}</span>
            </div>
            <div className="flex items-center gap-2 w-full text-xs">
              <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
              <span className="text-muted-foreground">
                {project.artifacts} artifacts
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
