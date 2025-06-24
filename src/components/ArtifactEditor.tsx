import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useArtifacts, useCreateArtifact, useUpdateArtifact } from "@/hooks/useWorkspaces";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save, Plus, Edit, Code, Image, FileIcon, PresentationIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtifactEditorProps {
  projectId: string | null;
  artifactId: string | null;
  onArtifactSelect: (artifactId: string | null) => void;
}

const artifactTypeIcons = {
  document: FileText,
  code: Code,
  design: Image,
  presentation: PresentationIcon,
  other: FileIcon,
};

export function ArtifactEditor({ projectId, artifactId, onArtifactSelect }: ArtifactEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'document' | 'design' | 'code' | 'presentation' | 'other'>('document');
  const [content, setContent] = useState('');

  const { data: artifacts = [], isLoading } = useArtifacts(projectId || undefined);
  const { mutate: createArtifact, isPending: isCreating } = useCreateArtifact();
  const { mutate: updateArtifact, isPending: isUpdating } = useUpdateArtifact();
  const { toast } = useToast();

  const selectedArtifact = artifacts.find(a => a.id === artifactId);

  useEffect(() => {
    if (selectedArtifact) {
      setName(selectedArtifact.name);
      setDescription(selectedArtifact.description || '');
      setType(selectedArtifact.type as any);
      setContent(typeof selectedArtifact.content === 'string' ? selectedArtifact.content : JSON.stringify(selectedArtifact.content, null, 2));
    } else {
      setName('');
      setDescription('');
      setType('document');
      setContent('');
    }
  }, [selectedArtifact]);

  const handleSave = () => {
    if (!projectId || !name.trim()) return;

    const artifactData = {
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      content: content.trim() || undefined
    };

    if (artifactId && selectedArtifact) {
      updateArtifact(
        { id: artifactId, updates: artifactData },
        {
          onSuccess: () => {
            toast({
              title: "Artifact updated",
              description: "Your artifact has been saved successfully."
            });
            setIsEditing(false);
          },
          onError: (error) => {
            toast({
              title: "Error updating artifact",
              description: error.message,
              variant: "destructive"
            });
          }
        }
      );
    } else {
      createArtifact(
        { projectId, ...artifactData },
        {
          onSuccess: (newArtifact) => {
            toast({
              title: "Artifact created",
              description: "Your new artifact has been created successfully."
            });
            onArtifactSelect(newArtifact.id);
            setIsEditing(false);
          },
          onError: (error) => {
            toast({
              title: "Error creating artifact",
              description: error.message,
              variant: "destructive"
            });
          }
        }
      );
    }
  };

  const handleNewArtifact = () => {
    onArtifactSelect(null);
    setIsEditing(true);
  };

  if (!projectId) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Select a project to manage artifacts.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Artifacts</h2>
        <Button onClick={handleNewArtifact}>
          <Plus className="h-4 w-4 mr-2" />
          New Artifact
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artifacts List */}
        <Card>
          <CardHeader>
            <CardTitle>Project Artifacts</CardTitle>
            <CardDescription>
              {artifacts.length} artifacts in this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {artifacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No artifacts yet.</p>
            ) : (
              artifacts.map((artifact) => {
                const IconComponent = artifactTypeIcons[artifact.type as keyof typeof artifactTypeIcons] || FileIcon;
                return (
                  <div
                    key={artifact.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                      artifactId === artifact.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      onArtifactSelect(artifact.id);
                      setIsEditing(false);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <IconComponent className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{artifact.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {artifact.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            v{artifact.version}
                          </span>
                        </div>
                        {artifact.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {artifact.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Artifact Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {artifactId ? (isEditing ? 'Edit Artifact' : selectedArtifact?.name) : 'New Artifact'}
                  </CardTitle>
                  {selectedArtifact && !isEditing && (
                    <CardDescription>
                      Created {new Date(selectedArtifact.created_at).toLocaleDateString()}
                    </CardDescription>
                  )}
                </div>
                {artifactId && !isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isEditing || !artifactId) ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Artifact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={type} onValueChange={(value: any) => setType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="code">Code</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional description..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Artifact content..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={isCreating || isUpdating || !name.trim()}>
                      {(isCreating || isUpdating) ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    {isEditing && artifactId && (
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </>
              ) : selectedArtifact ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const IconComponent = artifactTypeIcons[selectedArtifact.type as keyof typeof artifactTypeIcons] || FileIcon;
                          return <IconComponent className="h-4 w-4" />;
                        })()}
                        <Badge variant="outline">{selectedArtifact.type}</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Version</Label>
                      <p className="mt-1">v{selectedArtifact.version}</p>
                    </div>
                  </div>

                  {selectedArtifact.description && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="mt-1 text-sm">{selectedArtifact.description}</p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Content</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {typeof selectedArtifact.content === 'string' 
                          ? selectedArtifact.content 
                          : JSON.stringify(selectedArtifact.content, null, 2)
                        }
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Select an artifact to view or edit it.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
