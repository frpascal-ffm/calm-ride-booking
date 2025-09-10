-- Fix the status column enum issue
-- First drop the default, then convert, then set new default
ALTER TABLE public.bookings ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.bookings ALTER COLUMN status TYPE TEXT;

-- Create enum type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('planned', 'confirmed', 'done', 'canceled');
  END IF;
END $$;

-- Convert column to enum type
UPDATE public.bookings SET status = 'planned' WHERE status NOT IN ('planned', 'confirmed', 'done', 'canceled');
ALTER TABLE public.bookings ALTER COLUMN status TYPE booking_status USING status::booking_status;
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'planned';