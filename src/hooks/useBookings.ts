import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'> & {
  partner?: Tables<'partners'> | null;
  organization?: Tables<'organizations'> | null;
};

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          partner:partners(*),
          organization:organizations(*)
        `)
        .order('booking_date', { ascending: false })
        .order('pickup_time', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Buchungen');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status }
            : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
      throw err;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus,
    deleteBooking
  };
};