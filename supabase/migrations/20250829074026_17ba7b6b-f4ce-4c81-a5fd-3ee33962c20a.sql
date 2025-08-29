-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  timestamp_part TEXT;
BEGIN
  -- Get current timestamp in format
  timestamp_part := 'KT-' || EXTRACT(EPOCH FROM NOW())::bigint::text;
  
  RETURN timestamp_part;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_case_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.case_number IS NULL OR NEW.case_number = '' THEN
    NEW.case_number := public.generate_case_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;