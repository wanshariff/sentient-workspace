
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewType } from "@/pages/Index";
import { Users, Share } from "lucide-react";

interface HeaderProps {
  currentView: ViewType;
  selectedWorkspace: string;
  selectedProject: string | null;
}

export function Header({ currentView, selectedWorkspace, selectedProject }: HeaderProps) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'artifacts':
        return 'Artifacts';
      case 'board':
        return 'Project Board';
      case 'calendar':
        return 'Calendar';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex items-center gap-2 flex-1">
        <h1 className="text-xl font-semibold">{getViewTitle()}</h1>
        {selectedProject && (
          <>
            <span className="text-muted-foreground">/</span>
            <Badge variant="secondary">Project Alpha</Badge>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Collaborate</span>
        </Button>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </header>
  );
}
