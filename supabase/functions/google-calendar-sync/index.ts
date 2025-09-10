import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { bookingId, action, calendarEventData } = await req.json();
    
    console.log('Google Calendar Sync request:', { bookingId, action });

    // Get the authorization header to extract the user's access token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Get user session to access Google tokens
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user's Google access token from user metadata
    const googleAccessToken = user.user_metadata?.provider_token;
    
    if (!googleAccessToken) {
      throw new Error('No Google access token found. Please re-authenticate with Google.');
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    let result;

    switch (action) {
      case 'create':
        result = await createCalendarEvent(googleAccessToken, booking, calendarEventData);
        break;
      case 'update':
        result = await updateCalendarEvent(googleAccessToken, booking, calendarEventData);
        break;
      case 'delete':
        result = await deleteCalendarEvent(googleAccessToken, booking);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    // Update booking with calendar event ID if creating
    if (action === 'create' && result.id) {
      await supabase
        .from('bookings')
        .update({ calendar_event_id: result.id })
        .eq('id', bookingId);
    }

    // Clear calendar event ID if deleting
    if (action === 'delete') {
      await supabase
        .from('bookings')
        .update({ calendar_event_id: null })
        .eq('id', bookingId);
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-calendar-sync function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createCalendarEvent(accessToken: string, booking: any, eventData?: any) {
  const startDateTime = new Date(booking.pickup_datetime);
  const endDateTime = new Date(startDateTime.getTime() + (booking.estimated_drive_minutes + booking.buffer_minutes) * 60000);

  const event = {
    summary: `Krankentransport: ${booking.first_name} ${booking.last_name}`,
    description: `Fallnummer: ${booking.case_number}\nAbholung: ${booking.pickup_address}\nZiel: ${booking.dropoff_address}\n\nBesondere Anforderungen:\n${booking.patient_notes || 'Keine'}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Europe/Berlin',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Europe/Berlin',
    },
    location: booking.pickup_address,
    ...eventData
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Calendar API error: ${error}`);
  }

  return await response.json();
}

async function updateCalendarEvent(accessToken: string, booking: any, eventData: any) {
  if (!booking.calendar_event_id) {
    throw new Error('No calendar event ID found for this booking');
  }

  const startDateTime = new Date(booking.pickup_datetime);
  const endDateTime = new Date(startDateTime.getTime() + (booking.estimated_drive_minutes + booking.buffer_minutes) * 60000);

  const event = {
    summary: `Krankentransport: ${booking.first_name} ${booking.last_name}`,
    description: `Fallnummer: ${booking.case_number}\nAbholung: ${booking.pickup_address}\nZiel: ${booking.dropoff_address}\n\nBesondere Anforderungen:\n${booking.patient_notes || 'Keine'}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Europe/Berlin',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Europe/Berlin',
    },
    location: booking.pickup_address,
    ...eventData
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.calendar_event_id}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Calendar API error: ${error}`);
  }

  return await response.json();
}

async function deleteCalendarEvent(accessToken: string, booking: any) {
  if (!booking.calendar_event_id) {
    throw new Error('No calendar event ID found for this booking');
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.calendar_event_id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    throw new Error(`Calendar API error: ${error}`);
  }

  return { deleted: true };
}