
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  role?: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Artifact {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  type: string;
  content: any;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const useWorkspaces = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(workspace => ({
        ...workspace,
        role: workspace.workspace_members?.[0]?.role
      }));
    },
    enabled: !!user
  });
};

export const useProjects = (workspaceId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['projects', workspaceId, user?.id],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!workspaceId
  });
};

export const useArtifacts = (projectId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['artifacts', projectId, user?.id],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!projectId
  });
};

export const useTasks = (projectId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tasks', projectId, user?.id],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!projectId
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data: workspace, error } = await supabase
        .from('workspaces')
        .insert({
          name,
          description,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add user as owner
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user?.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      return workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    }
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ workspaceId, name, description, status }: { 
      workspaceId: string; 
      name: string; 
      description?: string; 
      status?: string; 
    }) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          workspace_id: workspaceId,
          name,
          description,
          status,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
    }
  });
};

export const useCreateArtifact = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ projectId, name, description, type, content }: { 
      projectId: string; 
      name: string; 
      description?: string; 
      type?: string;
      content?: any;
    }) => {
      const { data, error } = await supabase
        .from('artifacts')
        .insert({
          project_id: projectId,
          name,
          description,
          type,
          content,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['artifacts', variables.projectId] });
    }
  });
};

export const useUpdateArtifact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Artifact> }) => {
      const { data, error } = await supabase
        .from('artifacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['artifacts', data.project_id] });
    }
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ projectId, title, description, status, priority }: { 
      projectId: string; 
      title: string; 
      description?: string; 
      status?: string;
      priority?: string;
    }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          project_id: projectId,
          title,
          description,
          status,
          priority,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.project_id] });
    }
  });
};
