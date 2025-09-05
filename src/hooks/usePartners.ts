import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Partner = Tables<'partners'> & {
  organization?: Tables<'organizations'> | null;
};

type NewPartner = {
  name: string;
  email: string;
  company_id: string;
};

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const replacements: { [key: string]: string } = { 
          'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' 
        };
        return replacements[match] || match;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select(`
          *,
          organization:organizations(*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPartners(data || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Partner');
    } finally {
      setLoading(false);
    }
  };

  const addPartner = async (newPartner: NewPartner) => {
    try {
      const slug = generateSlug(newPartner.name);
      
      const partnerData: TablesInsert<'partners'> = {
        name: newPartner.name,
        email: newPartner.email,
        company_id: newPartner.company_id,
        slug,
        active: true
      };

      const { data, error: insertError } = await supabase
        .from('partners')
        .insert(partnerData)
        .select(`
          *,
          organization:organizations(*)
        `)
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        setPartners(prev => [data, ...prev]);
      }

      return data;
    } catch (err) {
      console.error('Error adding partner:', err);
      throw err;
    }
  };

  const updatePartner = async (partnerId: string, updates: Partial<TablesInsert<'partners'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('partners')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', partnerId)
        .select(`
          *,
          organization:organizations(*)
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setPartners(prev => 
          prev.map(partner => 
            partner.id === partnerId ? data : partner
          )
        );
      }

      return data;
    } catch (err) {
      console.error('Error updating partner:', err);
      throw err;
    }
  };

  const togglePartnerStatus = async (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return;

    return updatePartner(partnerId, { active: !partner.active });
  };

  const deletePartner = async (partnerId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

      if (deleteError) {
        throw deleteError;
      }

      setPartners(prev => prev.filter(partner => partner.id !== partnerId));
    } catch (err) {
      console.error('Error deleting partner:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading,
    error,
    refetch: fetchPartners,
    addPartner,
    updatePartner,
    togglePartnerStatus,
    deletePartner
  };
};