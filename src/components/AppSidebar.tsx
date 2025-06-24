
import { Calendar, Home, Kanban, List, Plus, Search, Settings } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ViewType } from "@/pages/Index";
import { WorkspaceSelector } from "@/components/WorkspaceSelector";
import { ProjectList } from "@/components/ProjectList";

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
    url: "#",
    icon: Home,
    view: "dashboard" as ViewType,
  },
  {
    title: "Artifacts",
    url: "#",
    icon: List,
    view: "artifacts" as ViewType,
  },
  {
    title: "Board",
    url: "#",
    icon: Kanban,
    view: "board" as ViewType,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
    view: "calendar" as ViewType,
  },
];

export function AppSidebar({ 
  currentView, 
  onViewChange, 
  selectedWorkspace, 
  onWorkspaceChange,
  selectedProject,
  onProjectSelect 
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <span className="font-semibold text-lg">Sentient Workspace</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <WorkspaceSelector 
              selectedWorkspace={selectedWorkspace}
              onWorkspaceChange={onWorkspaceChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={currentView === item.view}
                    onClick={() => onViewChange(item.view)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <ProjectList 
              workspaceId={selectedWorkspace}
              selectedProject={selectedProject}
              onProjectSelect={onProjectSelect}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
