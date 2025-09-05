import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';

type Organization = Tables<'organizations'>;

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setOrganizations(data || []);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Organisationen');
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (orgId: string, updates: TablesUpdate<'organizations'>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('organizations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orgId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setOrganizations(prev => 
          prev.map(org => 
            org.id === orgId ? data : org
          )
        );
      }

      return data;
    } catch (err) {
      console.error('Error updating organization:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations,
    updateOrganization
  };
};