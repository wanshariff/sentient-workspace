
import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { ArtifactEditor } from "@/components/ArtifactEditor";
import { ProjectBoard } from "@/components/ProjectBoard";

export type ViewType = 'dashboard' | 'artifacts' | 'board' | 'calendar';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedWorkspace, setSelectedWorkspace] = useState('workspace-1');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          selectedWorkspace={selectedWorkspace} 
          onProjectSelect={setSelectedProject}
          onViewChange={setCurrentView}
        />;
      case 'artifacts':
        return <ArtifactEditor 
          projectId={selectedProject} 
          artifactId={selectedArtifact}
          onArtifactSelect={setSelectedArtifact}
        />;
      case 'board':
        return <ProjectBoard projectId={selectedProject} />;
      case 'calendar':
        return <div className="p-6">Calendar view coming soon...</div>;
      default:
        return <Dashboard 
          selectedWorkspace={selectedWorkspace} 
          onProjectSelect={setSelectedProject}
          onViewChange={setCurrentView}
        />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedWorkspace={selectedWorkspace}
          onWorkspaceChange={setSelectedWorkspace}
          selectedProject={selectedProject}
          onProjectSelect={setSelectedProject}
        />
        <SidebarInset className="flex-1">
          <Header 
            currentView={currentView}
            selectedWorkspace={selectedWorkspace}
            selectedProject={selectedProject}
          />
          <main className="flex-1">
            {renderMainContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
