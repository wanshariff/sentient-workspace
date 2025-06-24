
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks, useCreateTask, useUpdateTask } from "@/hooks/useWorkspaces";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, User, Flag, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectBoardProps {
  projectId: string | null;
}

const taskColumns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export function ProjectBoard({ projectId }: ProjectBoardProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const { data: tasks = [], isLoading } = useTasks(projectId || undefined);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { toast } = useToast();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !newTaskTitle.trim()) return;

    createTask(
      {
        projectId,
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        priority: newTaskPriority,
        status: 'todo'
      },
      {
        onSuccess: () => {
          toast({
            title: "Task created",
            description: "Your new task has been added to the board."
          });
          setIsCreateDialogOpen(false);
          setNewTaskTitle('');
          setNewTaskDescription('');
          setNewTaskPriority('medium');
        },
        onError: (error) => {
          toast({
            title: "Error creating task",
            description: error.message,
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    updateTask(
      { id: taskId, updates: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: "Task updated",
            description: "Task status has been updated."
          });
        },
        onError: (error) => {
          toast({
            title: "Error updating task",
            description: error.message,
            variant: "destructive"
          });
        }
      }
    );
  };

  if (!projectId) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Select a project to view its board.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-full" />
              {[1, 2].map((j) => (
                <Skeleton key={j} className="h-32 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Board</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your project board.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Optional description..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Task
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {taskColumns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.id);
          
          return (
            <div key={column.id} className="space-y-4">
              <div className={`p-3 rounded-lg ${column.color}`}>
                <h3 className="font-semibold">{column.title}</h3>
                <p className="text-sm text-muted-foreground">{columnTasks.length} tasks</p>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{task.title}</CardTitle>
                      {task.description && (
                        <CardDescription className="text-xs line-clamp-2">
                          {task.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                        >
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        
                        <Select 
                          value={task.status} 
                          onValueChange={(value) => handleTaskStatusChange(task.id, value)}
                        >
                          <SelectTrigger className="w-auto h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {taskColumns.map((col) => (
                              <SelectItem key={col.id} value={col.id}>
                                {col.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Created {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
