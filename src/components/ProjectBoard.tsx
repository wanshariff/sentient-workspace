
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal } from "lucide-react";

interface ProjectBoardProps {
  projectId: string | null;
}

export function ProjectBoard({ projectId }: ProjectBoardProps) {
  const columns = [
    { id: "todo", title: "To Do", count: 5 },
    { id: "inprogress", title: "In Progress", count: 3 },
    { id: "review", title: "Review", count: 2 },
    { id: "done", title: "Done", count: 8 },
  ];

  const tasks = {
    todo: [
      { id: "task-1", title: "User Research Analysis", type: "Research", assignee: "P", priority: "high" },
      { id: "task-2", title: "Competitive Analysis", type: "Analysis", assignee: "D", priority: "medium" },
      { id: "task-3", title: "Technical Architecture", type: "Technical", assignee: "E", priority: "high" },
      { id: "task-4", title: "Design System Setup", type: "Design", assignee: "S", priority: "low" },
      { id: "task-5", title: "API Documentation", type: "Technical", assignee: "E", priority: "medium" },
    ],
    inprogress: [
      { id: "task-6", title: "User Flow Diagrams", type: "Design", assignee: "S", priority: "high" },
      { id: "task-7", title: "Database Schema", type: "Technical", assignee: "E", priority: "high" },
      { id: "task-8", title: "Wireframe Creation", type: "Design", assignee: "D", priority: "medium" },
    ],
    review: [
      { id: "task-9", title: "Product Requirements", type: "Product", assignee: "P", priority: "high" },
      { id: "task-10", title: "User Personas", type: "Research", assignee: "P", priority: "medium" },
    ],
    done: [
      { id: "task-11", title: "Market Research", type: "Research", assignee: "P", priority: "high" },
      { id: "task-12", title: "Stakeholder Interviews", type: "Research", assignee: "D", priority: "medium" },
      { id: "task-13", title: "Initial Concept", type: "Product", assignee: "P", priority: "high" },
    ],
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Research': return 'bg-blue-100 text-blue-800';
      case 'Design': return 'bg-purple-100 text-purple-800';
      case 'Technical': return 'bg-orange-100 text-orange-800';
      case 'Product': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!projectId) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Project Board</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Select a project to view its Kanban board and track progress.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Board</h2>
          <p className="text-muted-foreground">Track and manage your project tasks</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                {column.title}
                <Badge variant="secondary" className="text-xs">
                  {column.count}
                </Badge>
              </h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {tasks[column.id as keyof typeof tasks]?.map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{task.assignee}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getTypeColor(task.type)}`}>
                        {task.type}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="ghost" className="w-full h-12 border-2 border-dashed">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
