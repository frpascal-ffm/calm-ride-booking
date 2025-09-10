-- Create comprehensive medical transport booking system schema

-- Companies table (extended)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  depot_address TEXT,
  service_radius_km INTEGER DEFAULT 25,
  cutoff_hours INTEGER DEFAULT 10,
  theme_primary TEXT DEFAULT '#0ea5e9',
  theme_logo_url TEXT,
  default_lang TEXT DEFAULT 'de',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supports_wheelchair BOOLEAN DEFAULT false,
  supports_stretcher BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Partners table (extended)
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  slug TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, slug)
);

-- Bookings table (comprehensive)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  
  -- Patient information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  case_number TEXT UNIQUE,
  
  -- Transport details
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  estimated_travel_minutes INTEGER DEFAULT 30,
  booking_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  end_time TIME,
  
  -- Medical flags
  flags_adipositas BOOLEAN DEFAULT false,
  flags_infectious BOOLEAN DEFAULT false,
  flags_wheelchair BOOLEAN DEFAULT false,
  flags_barrier_free BOOLEAN DEFAULT false,
  flags_visually_impaired BOOLEAN DEFAULT false,
  
  -- Additional information
  notes TEXT,
  confirmation_email TEXT NOT NULL,
  attachment_url TEXT,
  
  -- Status and tracking
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'done', 'canceled')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Company settings table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Buffer times in minutes
  buffer_sitzend_pre INTEGER DEFAULT 5,
  buffer_sitzend_post INTEGER DEFAULT 5,
  buffer_rollstuhl_pre INTEGER DEFAULT 7,
  buffer_rollstuhl_post INTEGER DEFAULT 8,
  buffer_tragestuhl_pre INTEGER DEFAULT 10,
  buffer_tragestuhl_post INTEGER DEFAULT 10,
  
  -- Calendar integration
  calendar_google_primary_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(company_id)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  meta_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Companies are accessible by authenticated users" ON public.companies
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for vehicles
CREATE POLICY "Vehicles are accessible by company users" ON public.vehicles
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE auth.uid() IS NOT NULL
    )
  );

-- RLS Policies for partners
CREATE POLICY "Partners are accessible by company users" ON public.partners
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE auth.uid() IS NOT NULL
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Bookings are accessible by company users" ON public.bookings
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM public.companies WHERE auth.uid() IS NOT NULL
    )
  );

CREATE POLICY "Bookings can be created publicly via partner links" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Bookings can be updated by company users" ON public.bookings
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM public.companies WHERE auth.uid() IS NOT NULL
    )
  );

-- RLS Policies for company settings
CREATE POLICY "Company settings are accessible by company users" ON public.company_settings
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE auth.uid() IS NOT NULL
    )
  );

-- RLS Policies for audit logs
CREATE POLICY "Audit logs are accessible by company users" ON public.audit_logs
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE auth.uid() IS NOT NULL
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_company_date ON public.bookings(company_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_partner ON public.bookings(partner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_partners_company_slug ON public.partners(company_id, slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_company ON public.vehicles(company_id);

-- Functions
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
BEGIN
  timestamp_part := 'KT-' || EXTRACT(EPOCH FROM NOW())::bigint::text;
  RETURN timestamp_part;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for case number generation
CREATE OR REPLACE FUNCTION public.set_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
    NEW.case_number := public.generate_case_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER set_booking_case_number
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_case_number();

-- Updated at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();