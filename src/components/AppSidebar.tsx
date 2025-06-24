
import { Home, FileText, Kanban, Calendar, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { ProjectList } from "./ProjectList";
import { ViewType } from "@/pages/Index";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
  selectedProject: string | null;
  onProjectSelect: (project: string | null) => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Artifacts",
    url: "artifacts",
    icon: FileText,
  },
  {
    title: "Board",
    url: "board",
    icon: Kanban,
  },
  {
    title: "Calendar",
    url: "calendar",
    icon: Calendar,
  },
];

export function AppSidebar({
  currentView,
  onViewChange,
  selectedWorkspace,
  onWorkspaceChange,
  selectedProject,
  onProjectSelect,
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-lg font-semibold">Sentient Workspace</h2>
        </div>
        <SidebarSeparator />
        <div className="p-2">
          <WorkspaceSelector
            selectedWorkspace={selectedWorkspace}
            onWorkspaceChange={onWorkspaceChange}
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={currentView === item.url}
                    onClick={() => onViewChange(item.url as ViewType)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            Projects
            {selectedWorkspace && (
              <CreateProjectDialog 
                workspaceId={selectedWorkspace}
                trigger={<Button variant="ghost" size="sm" className="h-6 w-6 p-0">+</Button>}
              />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {selectedWorkspace ? (
              <ProjectList
                workspaceId={selectedWorkspace}
                selectedProject={selectedProject}
                onProjectSelect={onProjectSelect}
              />
            ) : (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Select a workspace to view projects
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
