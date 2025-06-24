
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
