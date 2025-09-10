-- Update database schema to match MVP requirements exactly

-- First, update companies table to match spec
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS depot_address TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS service_radius_km INTEGER DEFAULT 25;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS cutoff_hours INTEGER DEFAULT 10;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS theme_primary TEXT DEFAULT '#0ea5e9';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS theme_logo_url TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS default_lang TEXT DEFAULT 'de';

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supports_wheelchair BOOLEAN DEFAULT false,
  supports_stretcher BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update partners table structure
ALTER TABLE public.partners DROP CONSTRAINT IF EXISTS partners_company_id_fkey;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Update bookings table to match exact spec
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS destination_address TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_adipositas BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_infectious BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_wheelchair BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_barrier_free BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_visually_impaired BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS estimated_travel_minutes INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Drop old columns that don't match spec
ALTER TABLE public.bookings DROP COLUMN IF EXISTS patient_name;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS patient_birth_date;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS patient_insurance;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS pickup_datetime;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS dropoff_address;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS additional_info;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS additional_notes;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS barrier_free;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS organization_id;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS partner_link_id;

-- Update status column to use proper enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('planned', 'confirmed', 'done', 'canceled');
  END IF;
END $$;

ALTER TABLE public.bookings ALTER COLUMN status TYPE booking_status USING status::booking_status;
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'planned';

-- Create emails table for partner email history
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now()
);

-- Create company_settings table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  buffer_sitzend_pre INTEGER DEFAULT 5,
  buffer_sitzend_post INTEGER DEFAULT 5,
  buffer_rollstuhl_pre INTEGER DEFAULT 7,
  buffer_rollstuhl_post INTEGER DEFAULT 8,
  buffer_tragestuhl_pre INTEGER DEFAULT 10,
  buffer_tragestuhl_post INTEGER DEFAULT 10,
  calendar_google_primary_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id)
);

-- Create audit_logs table
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

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - strict per company_id
CREATE POLICY "Vehicles accessible by company users" ON public.vehicles
  FOR ALL USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Company settings accessible by company users" ON public.company_settings
  FOR ALL USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Audit logs accessible by company users" ON public.audit_logs
  FOR ALL USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

-- Update bookings RLS to be company-specific
DROP POLICY IF EXISTS "Bookings can be created for active partners" ON public.bookings;
CREATE POLICY "Partner bookings can be created" ON public.bookings
  FOR INSERT WITH CHECK (
    partner_id IN (SELECT id FROM public.partners WHERE active = true)
  );

CREATE POLICY "Company bookings accessible by users" ON public.bookings
  FOR ALL USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_company ON public.vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_company_date ON public.bookings(company_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_emails_partner ON public.emails(partner_id);