
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkspaceSelectorProps {
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
}

export function WorkspaceSelector({ selectedWorkspace, onWorkspaceChange }: WorkspaceSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: workspaces = [], isLoading } = useWorkspaces();

  const selectedWorkspaceData = workspaces.find(w => w.id === selectedWorkspace);

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{selectedWorkspaceData?.name || 'Select workspace'}</span>
            <span className="text-xs text-muted-foreground">{selectedWorkspaceData?.role || ''}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search workspaces..." />
          <CommandList>
            <CommandEmpty>No workspaces found.</CommandEmpty>
            <CommandGroup>
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={workspace.id}
                  onSelect={() => {
                    onWorkspaceChange(workspace.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedWorkspace === workspace.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{workspace.name}</span>
                    <span className="text-xs text-muted-foreground">{workspace.role}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
