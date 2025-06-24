
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Save, MessageCircle, History, Users } from "lucide-react";

interface ArtifactEditorProps {
  projectId: string | null;
  artifactId: string | null;
  onArtifactSelect: (artifactId: string) => void;
}

export function ArtifactEditor({ projectId, artifactId, onArtifactSelect }: ArtifactEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productDescription, setProductDescription] = useState("");

  const artifacts = [
    { id: "prd-1", name: "Product Requirements Document", type: "PRD", status: "draft" },
    { id: "personas-1", name: "User Personas", type: "Personas", status: "complete" },
    { id: "features-1", name: "Feature Specifications", type: "Features", status: "in-progress" },
    { id: "epics-1", name: "Epic Breakdown", type: "Epics", status: "draft" },
  ];

  const handleGenerateArtifacts = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  if (!projectId) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              AI-Powered Product Definition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Select a project to start generating artifacts, or create a new project to begin.
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
          <h2 className="text-2xl font-bold">Artifact Generator</h2>
          <p className="text-muted-foreground">Generate and manage product artifacts with AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4" />
            Version History
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
            Comments
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artifact List */}
        <Card>
          <CardHeader>
            <CardTitle>Project Artifacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {artifacts.map((artifact) => (
              <div 
                key={artifact.id}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                  artifactId === artifact.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => onArtifactSelect(artifact.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{artifact.name}</p>
                    <p className="text-xs text-muted-foreground">{artifact.type}</p>
                  </div>
                  <Badge 
                    variant={artifact.status === 'complete' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {artifact.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Editor */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generator">AI Generator</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Generate Product Artifacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Product Description</label>
                    <Textarea
                      placeholder="Describe your product idea in detail. Include target users, main features, and business goals..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="mt-2"
                      rows={6}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Product Name</label>
                      <Input placeholder="e.g., TaskFlow Pro" className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Target Market</label>
                      <Input placeholder="e.g., Small businesses" className="mt-2" />
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateArtifacts}
                    disabled={isGenerating || !productDescription}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating Artifacts...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate All Artifacts
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {artifactId ? "Product Requirements Document" : "Select an Artifact"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          P
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          D
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {artifactId ? (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Start editing your artifact here..."
                        rows={20}
                        defaultValue={`# Product Requirements Document

## Product Overview
TaskFlow Pro is a comprehensive task management solution designed for small to medium-sized teams who need better collaboration and project visibility.

## Target Users
- Project managers in growing companies
- Small team leads managing multiple projects
- Remote teams needing better coordination

## Core Features
1. **Intelligent Task Assignment**
   - AI-powered workload balancing
   - Skill-based task recommendations
   - Automated deadline management

2. **Real-time Collaboration**
   - Live document editing
   - Comment threading
   - @mentions and notifications

3. **Advanced Analytics**
   - Team productivity metrics
   - Project timeline analysis
   - Resource utilization reports

## Success Metrics
- Reduce project completion time by 25%
- Increase team collaboration score by 40%
- Achieve 90% user satisfaction rating`}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select an artifact from the list to start editing
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
