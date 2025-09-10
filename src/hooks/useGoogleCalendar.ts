import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CalendarEventData {
  summary?: string;
  description?: string;
  location?: string;
  attendees?: Array<{ email: string }>;
}

export const useGoogleCalendar = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createCalendarEvent = async (bookingId: string, eventData?: CalendarEventData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          bookingId,
          action: 'create',
          calendarEventData: eventData
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Fehler beim Erstellen des Kalendereintrags');
      }

      toast({
        title: "Kalendereintrag erstellt",
        description: "Die Buchung wurde zu Ihrem Google Calendar hinzugefügt",
      });

      return data.result;
    } catch (error: any) {
      console.error('Calendar creation error:', error);
      toast({
        title: "Kalenderfehler",
        description: error.message || "Kalendereintrag konnte nicht erstellt werden",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCalendarEvent = async (bookingId: string, eventData?: CalendarEventData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          bookingId,
          action: 'update',
          calendarEventData: eventData
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Fehler beim Aktualisieren des Kalendereintrags');
      }

      toast({
        title: "Kalendereintrag aktualisiert",
        description: "Die Buchung wurde in Ihrem Google Calendar aktualisiert",
      });

      return data.result;
    } catch (error: any) {
      console.error('Calendar update error:', error);
      toast({
        title: "Kalenderfehler",
        description: error.message || "Kalendereintrag konnte nicht aktualisiert werden",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCalendarEvent = async (bookingId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          bookingId,
          action: 'delete'
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Fehler beim Löschen des Kalendereintrags');
      }

      toast({
        title: "Kalendereintrag gelöscht",
        description: "Die Buchung wurde aus Ihrem Google Calendar entfernt",
      });

      return data.result;
    } catch (error: any) {
      console.error('Calendar deletion error:', error);
      toast({
        title: "Kalenderfehler",
        description: error.message || "Kalendereintrag konnte nicht gelöscht werden",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    loading
  };
};