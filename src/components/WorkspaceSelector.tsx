
import { Check, ChevronsUpDown } from "lucide-react";
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

interface WorkspaceSelectorProps {
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
}

const workspaces = [
  { id: "workspace-1", name: "Product Team", role: "Admin" },
  { id: "workspace-2", name: "Design System", role: "Member" },
  { id: "workspace-3", name: "Research Lab", role: "Viewer" },
];

export function WorkspaceSelector({ selectedWorkspace, onWorkspaceChange }: WorkspaceSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedWorkspaceData = workspaces.find(w => w.id === selectedWorkspace);

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
            <span className="font-medium">{selectedWorkspaceData?.name}</span>
            <span className="text-xs text-muted-foreground">{selectedWorkspaceData?.role}</span>
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
