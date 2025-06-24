
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Folder, FolderOpen } from "lucide-react";
import { useProjects } from "@/hooks/useWorkspaces";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectListProps {
  workspaceId: string;
  selectedProject: string | null;
  onProjectSelect: (project: string | null) => void;
}

export function ProjectList({ workspaceId, selectedProject, onProjectSelect }: ProjectListProps) {
  const { data: projects = [], isLoading } = useProjects(workspaceId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        {[1, 2, 3].map((i) => (
          <SidebarMenuItem key={i}>
            <Skeleton className="h-16 w-full" />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (projects.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-3 text-sm text-muted-foreground text-center">
            No projects yet. Create your first project!
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

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
                {project.description || 'No description'}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
