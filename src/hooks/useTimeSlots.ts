import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { addMinutes, format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface WorkingHours {
  start: string;
  end: string;
}

export interface UseTimeSlotsOptions {
  slotDuration?: number; // in minutes
  bufferBefore?: number; // buffer before appointment in minutes
  bufferAfter?: number; // buffer after appointment in minutes
}

export const useTimeSlots = (
  selectedDate: Date | undefined,
  companyId: string,
  workingHours: WorkingHours,
  bufferMinutes: number = 15,
  options: UseTimeSlotsOptions = {}
) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    slotDuration = 30,
    bufferBefore = bufferMinutes,
    bufferAfter = bufferMinutes
  } = options;

  useEffect(() => {
    if (!selectedDate || !companyId) {
      setTimeSlots([]);
      return;
    }

    const generateTimeSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        // Generate all possible time slots for the day
        const slots = generateDayTimeSlots(workingHours, slotDuration);
        
        // Get existing bookings for the selected date
        const existingBookings = await getExistingBookings(selectedDate, companyId);
        
        // Check availability for each slot
        const availableSlots = slots.map(slot => {
          const slotTime = parseTimeToDate(selectedDate, slot);
          const availability = checkSlotAvailability(
            slotTime,
            existingBookings,
            bufferBefore,
            bufferAfter,
            slotDuration
          );
          
          return {
            time: slot,
            available: availability.available,
            reason: availability.reason
          };
        });

        setTimeSlots(availableSlots);
      } catch (err) {
        console.error('Error generating time slots:', err);
        setError('Fehler beim Laden der verfügbaren Zeiten');
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    generateTimeSlots();
  }, [selectedDate, companyId, workingHours.start, workingHours.end, bufferBefore, bufferAfter, slotDuration]);

  return { timeSlots, loading, error };
};

// Helper function to generate time slots for a day
const generateDayTimeSlots = (workingHours: WorkingHours, slotDuration: number): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = workingHours.end.split(':').map(Number);
  
  const startTime = new Date();
  startTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0, 0);
  
  let currentTime = new Date(startTime);
  
  while (isBefore(currentTime, endTime)) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, slotDuration);
  }
  
  return slots;
};

// Helper function to get existing bookings for a date
const getExistingBookings = async (date: Date, companyId: string) => {
  const dateString = format(date, 'yyyy-MM-dd');
  
  const { data, error } = await supabase
    .from('bookings')
    .select('pickup_time, status')
    .eq('organization_id', companyId)
    .gte('pickup_time', `${dateString}T00:00:00`)
    .lt('pickup_time', `${dateString}T23:59:59`)
    .in('status', ['pending', 'confirmed', 'in_progress']); // Exclude cancelled and completed
  
  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  
  return data || [];
};

// Helper function to parse time string to Date object
const parseTimeToDate = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

// Helper function to check if a time slot is available
const checkSlotAvailability = (
  slotTime: Date,
  existingBookings: any[],
  bufferBefore: number,
  bufferAfter: number,
  slotDuration: number
): { available: boolean; reason?: string } => {
  const now = new Date();
  const slotEnd = addMinutes(slotTime, slotDuration);
  
  // Check if slot is in the past
  if (isBefore(slotTime, now)) {
    return { available: false, reason: 'Vergangene Zeit' };
  }
  
  // Check if slot is too close to current time (minimum 2 hours notice)
  const minimumNoticeTime = addMinutes(now, 120);
  if (isBefore(slotTime, minimumNoticeTime)) {
    return { available: false, reason: 'Zu kurzfristig (min. 2h Vorlauf)' };
  }
  
  // Check conflicts with existing bookings
  for (const booking of existingBookings) {
    const bookingTime = parseISO(booking.pickup_time);
    const bookingEnd = addMinutes(bookingTime, slotDuration);
    
    // Calculate buffer zones
    const bookingStartWithBuffer = addMinutes(bookingTime, -bufferBefore);
    const bookingEndWithBuffer = addMinutes(bookingEnd, bufferAfter);
    const slotStartWithBuffer = addMinutes(slotTime, -bufferBefore);
    const slotEndWithBuffer = addMinutes(slotEnd, bufferAfter);
    
    // Check for overlaps considering buffers
    const slotStartsInBooking = isAfter(slotTime, bookingStartWithBuffer) && isBefore(slotTime, bookingEndWithBuffer);
    const slotEndsInBooking = isAfter(slotEnd, bookingStartWithBuffer) && isBefore(slotEnd, bookingEndWithBuffer);
    const bookingStartsInSlot = isAfter(bookingTime, slotStartWithBuffer) && isBefore(bookingTime, slotEndWithBuffer);
    const bookingEndsInSlot = isAfter(bookingEnd, slotStartWithBuffer) && isBefore(bookingEnd, slotEndWithBuffer);
    const slotContainsBooking = isBefore(slotTime, bookingTime) && isAfter(slotEnd, bookingEnd);
    const bookingContainsSlot = isBefore(bookingTime, slotTime) && isAfter(bookingEnd, slotEnd);
    
    const hasOverlap = slotStartsInBooking || slotEndsInBooking || bookingStartsInSlot || 
                      bookingEndsInSlot || slotContainsBooking || bookingContainsSlot;
    
    if (hasOverlap) {
      return { 
        available: false, 
        reason: `Belegt (${format(bookingTime, 'HH:mm')} - ${format(bookingEnd, 'HH:mm')})` 
      };
    }
  }
  
  return { available: true };
};

// Utility function to get next available slot
export const getNextAvailableSlot = (timeSlots: TimeSlot[]): TimeSlot | null => {
  return timeSlots.find(slot => slot.available) || null;
};

// Utility function to get available slots count
export const getAvailableSlotsCount = (timeSlots: TimeSlot[]): number => {
  return timeSlots.filter(slot => slot.available).length;
};

// Utility function to format time slot for display
export const formatTimeSlot = (time: string): string => {
  return time;
};

// Utility function to get recommended slots (e.g., morning, afternoon)
export const getRecommendedSlots = (timeSlots: TimeSlot[]): {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
} => {
  const morning = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 8 && hour < 12;
  });
  
  const afternoon = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  
  const evening = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 17 && hour < 20;
  });
  
  return { morning, afternoon, evening };
};

// Utility function to check if a specific time is available
export const isTimeSlotAvailable = (timeSlots: TimeSlot[], time: string): boolean => {
  const slot = timeSlots.find(slot => slot.time === time);
  return slot?.available || false;
};

// Utility function to get slot by time
export const getSlotByTime = (timeSlots: TimeSlot[], time: string): TimeSlot | undefined => {
  return timeSlots.find(slot => slot.time === time);
};