-- Add missing columns to bookings table first
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_id UUID;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_adipositas BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_infectious BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_wheelchair BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_barrier_free BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flags_visually_impaired BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmation_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- Update existing columns if needed
ALTER TABLE public.bookings ALTER COLUMN pickup_address TYPE TEXT;
ALTER TABLE public.bookings ALTER COLUMN dropoff_address TYPE TEXT;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  supports_wheelchair BOOLEAN DEFAULT false,
  supports_stretcher BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add foreign key constraint for vehicle_id
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_vehicle 
FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;