import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WorkingHours {
  start: string; // "08:00"
  end: string; // "18:00"
}

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

interface Booking {
  pickup_datetime: string;
  estimated_drive_minutes: number;
  buffer_minutes: number;
}

export const useTimeSlots = (
  date: Date | null,
  companyId: string,
  workingHours: WorkingHours,
  bufferMinutes: number = 15
) => {
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date && companyId) {
      fetchExistingBookings();
    }
  }, [date, companyId]);

  const fetchExistingBookings = async () => {
    if (!date) return;
    
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('pickup_datetime, estimated_drive_minutes, buffer_minutes')
        .eq('company_id', companyId)
        .gte('pickup_datetime', `${dateStr}T00:00:00.000Z`)
        .lt('pickup_datetime', `${dateStr}T23:59:59.999Z`);

      if (error) throw error;
      
      setExistingBookings(data || []);
    } catch (error) {
      console.error('Error fetching existing bookings:', error);
      setExistingBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = useMemo(() => {
    if (!date) return [];

    const slots: TimeSlot[] = [];
    const startTime = parseTime(workingHours.start);
    const endTime = parseTime(workingHours.end);
    
    // Generate 15-minute slots
    let currentTime = startTime;
    while (currentTime < endTime) {
      const timeStr = formatTime(currentTime);
      const slotDateTime = new Date(date);
      slotDateTime.setHours(Math.floor(currentTime), currentTime % 60);
      
      // Check if slot is available
      const isAvailable = checkSlotAvailability(slotDateTime, existingBookings, bufferMinutes);
      
      slots.push({
        time: timeStr,
        available: isAvailable.available,
        reason: isAvailable.reason
      });
      
      currentTime += 15; // Add 15 minutes
    }
    
    return slots;
  }, [date, workingHours, existingBookings, bufferMinutes]);

  return { timeSlots, loading, refreshBookings: fetchExistingBookings };
};

// Helper functions
const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const checkSlotAvailability = (
  slotDateTime: Date,
  existingBookings: Booking[],
  defaultBufferMinutes: number
): { available: boolean; reason?: string } => {
  const now = new Date();
  
  // Check if slot is in the past
  if (slotDateTime < now) {
    return { available: false, reason: 'Vergangene Zeit' };
  }
  
  // Check if slot conflicts with existing bookings
  for (const booking of existingBookings) {
    const bookingStart = new Date(booking.pickup_datetime);
    const bookingEnd = new Date(bookingStart);
    const totalDuration = booking.estimated_drive_minutes + (booking.buffer_minutes || defaultBufferMinutes);
    bookingEnd.setMinutes(bookingEnd.getMinutes() + totalDuration);
    
    // Check if the slot overlaps with any existing booking (including buffer)
    const slotEnd = new Date(slotDateTime);
    slotEnd.setMinutes(slotEnd.getMinutes() + 15); // 15-minute slot duration
    
    if (
      (slotDateTime >= bookingStart && slotDateTime < bookingEnd) ||
      (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
      (slotDateTime <= bookingStart && slotEnd >= bookingEnd)
    ) {
      return { available: false, reason: 'Bereits gebucht' };
    }
  }
  
  return { available: true };
};