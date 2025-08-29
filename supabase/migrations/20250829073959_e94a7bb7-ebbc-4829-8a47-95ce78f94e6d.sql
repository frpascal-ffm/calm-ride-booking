-- Update organizations table to match companies requirements
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS arbeitszeiten_start TIME DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS arbeitszeiten_end TIME DEFAULT '18:00',
ADD COLUMN IF NOT EXISTS karenzzeit INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS standard_email TEXT;

-- Create companies table as alias/view if needed (using organizations as base)
-- Update organizations with proper constraints
ALTER TABLE public.organizations 
ALTER COLUMN name SET NOT NULL;

-- Create partners table based on partner_links
DROP TABLE IF EXISTS public.partners CASCADE;
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  slug TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, slug)
);

-- Enable RLS on partners
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partners
CREATE POLICY "Partners can be read via active company links" 
ON public.partners 
FOR SELECT 
USING (
  company_id IN (
    SELECT organization_id 
    FROM partner_links 
    WHERE is_active = true
  )
);

-- Update bookings table to match requirements
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.organizations(id),
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.partners(id),
ADD COLUMN IF NOT EXISTS destination_address TEXT,
ADD COLUMN IF NOT EXISTS additional_info TEXT,
ADD COLUMN IF NOT EXISTS barrier_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS additional_notes TEXT,
ADD COLUMN IF NOT EXISTS booking_date DATE,
ADD COLUMN IF NOT EXISTS pickup_time TIME;

-- Drop old columns if they exist and rename to match schema
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'dropoff_address') THEN
    ALTER TABLE public.bookings RENAME COLUMN dropoff_address TO destination_address;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'is_adipositas') THEN
    ALTER TABLE public.bookings RENAME COLUMN is_adipositas TO adipositas;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'is_infectious') THEN
    ALTER TABLE public.bookings RENAME COLUMN is_infectious TO infectious;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'is_wheelchair') THEN
    ALTER TABLE public.bookings RENAME COLUMN is_wheelchair TO wheelchair;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'needs_barrier_free') THEN
    ALTER TABLE public.bookings RENAME COLUMN needs_barrier_free TO barrier_free;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'is_visually_impaired') THEN
    ALTER TABLE public.bookings RENAME COLUMN is_visually_impaired TO visually_impaired;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'has_special_requirements') THEN
    ALTER TABLE public.bookings DROP COLUMN has_special_requirements;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'special_requirements_note') THEN
    ALTER TABLE public.bookings RENAME COLUMN special_requirements_note TO additional_notes;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'patient_notes') THEN
    ALTER TABLE public.bookings RENAME COLUMN patient_notes TO additional_info;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Ignore errors if columns don't exist
  NULL;
END $$;

-- Update case number generation function
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  timestamp_part TEXT;
  sequence_part TEXT;
  next_sequence INTEGER;
BEGIN
  -- Get current timestamp in format
  timestamp_part := 'KT-' || EXTRACT(EPOCH FROM NOW())::bigint::text;
  
  RETURN timestamp_part;
END;
$function$;

-- Create emails table for confirmation email history
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on emails
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for emails
CREATE POLICY "Emails can be read and inserted for active partners" 
ON public.emails 
FOR ALL 
USING (
  partner_id IN (
    SELECT id FROM partners WHERE active = true
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_partners_company_slug ON public.partners(company_id, slug);
CREATE INDEX IF NOT EXISTS idx_bookings_company_date ON public.bookings(company_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_emails_partner_email ON public.emails(partner_id, email);

-- Update RLS policies for bookings to be company-specific
DROP POLICY IF EXISTS "Bookings can be created publicly" ON public.bookings;
CREATE POLICY "Bookings can be created for active partners" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  partner_id IN (
    SELECT id FROM partners WHERE active = true
  )
);