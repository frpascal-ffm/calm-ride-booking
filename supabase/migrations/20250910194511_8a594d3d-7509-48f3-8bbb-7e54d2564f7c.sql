-- Fix RLS security issues
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vehicles
CREATE POLICY "Vehicles are accessible by company users" ON public.vehicles
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.organizations WHERE auth.uid() IS NOT NULL
    )
  );