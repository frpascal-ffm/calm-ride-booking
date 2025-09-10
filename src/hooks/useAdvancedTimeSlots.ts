import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  addMinutes, 
  format, 
  isAfter, 
  isBefore, 
  isWeekend,
  getDay,
  addDays
} from 'date-fns';

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
  priority?: 'high' | 'medium' | 'low';
  estimatedDuration?: number;
  availableVehicles?: number;
}

export interface WorkingHours {
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
  enabled?: boolean;
}

export interface WeeklyWorkingHours {
  monday: WorkingHours;
  tuesday: WorkingHours;
  wednesday: WorkingHours;
  thursday: WorkingHours;
  friday: WorkingHours;
  saturday?: WorkingHours;
  sunday?: WorkingHours;
}

export const useAdvancedTimeSlots = (options: {
  date: Date | undefined;
  companyId: string;
  slotDuration?: number;
  bufferBefore?: number;
  bufferAfter?: number;
  workingHours?: WeeklyWorkingHours;
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleUtilization, setVehicleUtilization] = useState<Record<string, number>>({});

  const {
    date: selectedDate,
    companyId,
    slotDuration = 30,
    bufferBefore = 15,
    bufferAfter = 15,
    workingHours
  } = options;

  const minimumNoticeHours = 2;
  const maxAdvanceBookingDays = 30;
  const maxVehicles = 5; // Default vehicle capacity

  // Get working hours for specific date
  const getWorkingHoursForDate = useMemo(() => {
    return (date: Date): WorkingHours | null => {
      if (!workingHours) {
        return { start: '08:00', end: '18:00', enabled: true };
      }
      
      const dayOfWeek = getDay(date);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
      const dayName = dayNames[dayOfWeek];
      
      return workingHours[dayName] || { start: '08:00', end: '18:00', enabled: true };
    };
  }, [workingHours]);

  useEffect(() => {
    if (!selectedDate || !companyId) {
      setTimeSlots([]);
      return;
    }

    const generateAdvancedTimeSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if date is too far in advance
        const maxDate = addDays(new Date(), maxAdvanceBookingDays);
        if (isAfter(selectedDate, maxDate)) {
          setTimeSlots([]);
          setError(`Buchungen sind nur bis zu ${maxAdvanceBookingDays} Tage im Voraus möglich`);
          return;
        }

        // Get working hours for the selected date
        const workingHoursForDay = getWorkingHoursForDate(selectedDate);
        if (!workingHoursForDay || !workingHoursForDay.enabled) {
          setTimeSlots([]);
          setError('An diesem Tag sind keine Buchungen möglich');
          return;
        }

        // Generate time slots
        const slots = generateDayTimeSlots(workingHoursForDay, slotDuration);
        
        // Get existing bookings
        const existingBookings = await getExistingBookings(selectedDate, companyId);
        const utilization = await getVehicleUtilization(selectedDate, companyId);

        setVehicleUtilization(utilization);

        // Check availability for each slot
        const availableSlots = slots.map(slot => {
          const [hours, minutes] = slot.split(':').map(Number);
          const slotDateTime = new Date(selectedDate);
          slotDateTime.setHours(hours, minutes, 0, 0);
          
          // Get vehicle utilization for this hour
          const hourKey = hours.toString().padStart(2, '0') + ':00';
          const currentUtilization = utilization[hourKey] || 0;
          
          const availability = checkSlotAvailability(
            slot,
            selectedDate,
            existingBookings,
            utilization,
            {
              bufferBefore,
              bufferAfter,
              slotDuration,
              minimumNoticeHours,
              vehicleCapacity: maxVehicles
            }
          );
          
          const availableVehicles = Math.max(0, maxVehicles - currentUtilization);
          
          return {
            time: slot,
            available: availability.available && availableVehicles > 0,
            reason: availableVehicles === 0 ? 'Keine Fahrzeuge verfügbar' : availability.reason,
            priority: availability.priority || 'medium',
            estimatedDuration: slotDuration,
            availableVehicles,
          };
        });

        setTimeSlots(availableSlots);
      } catch (err) {
        console.error('Error generating advanced time slots:', err);
        setError('Fehler beim Laden der verfügbaren Zeiten');
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    generateAdvancedTimeSlots();
  }, [
    selectedDate, 
    companyId, 
    getWorkingHoursForDate,
    slotDuration,
    bufferBefore,
    bufferAfter,
    minimumNoticeHours,
    maxAdvanceBookingDays,
    maxVehicles
  ]);

  return { 
    timeSlots, 
    loading, 
    error, 
    vehicleUtilization,
    workingHours: selectedDate ? getWorkingHoursForDate(selectedDate) : null
  };
};

// Enhanced time slot generation with break times
const generateDayTimeSlots = (workingHours: WorkingHours, slotDuration: number): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = workingHours.end.split(':').map(Number);
  
  const startTime = new Date();
  startTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0, 0);
  
  let currentTime = new Date(startTime);
  
  // Parse break times if provided
  let breakStart: Date | null = null;
  let breakEnd: Date | null = null;
  
  if (workingHours.breakStart && workingHours.breakEnd) {
    const [breakStartHour, breakStartMinute] = workingHours.breakStart.split(':').map(Number);
    const [breakEndHour, breakEndMinute] = workingHours.breakEnd.split(':').map(Number);
    
    breakStart = new Date();
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
    
    breakEnd = new Date();
    breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
  }
  
  while (isBefore(currentTime, endTime)) {
    // Skip break time slots
    if (breakStart && breakEnd && 
        !isBefore(currentTime, breakStart) && 
        isBefore(currentTime, breakEnd)) {
      currentTime = new Date(breakEnd);
      continue;
    }
    
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, slotDuration);
  }
  
  return slots;
};

// Enhanced booking retrieval with vehicle information
const getExistingBookings = async (date: Date, companyId: string) => {
  const dateString = format(date, 'yyyy-MM-dd');
  
  const { data, error } = await supabase
    .from('bookings')
    .select('pickup_time')
    .eq('organization_id', companyId)
    .eq('booking_date', dateString)
    .in('status', ['planned', 'confirmed']);

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  
  return data || [];
};

// Get vehicle utilization for the day
const getVehicleUtilization = async (date: Date, companyId: string): Promise<Record<string, number>> => {
  const dateString = format(date, 'yyyy-MM-dd');
  
  const { data, error } = await supabase
    .from('bookings')
    .select('pickup_time')
    .eq('organization_id', companyId)
    .eq('booking_date', dateString)
    .in('status', ['confirmed', 'planned']);

  if (error || !data) {
    return {};
  }
  
  // Calculate utilization per hour
  const utilization: Record<string, number> = {};
  
  data.forEach(booking => {
    if (booking.pickup_time) {
      const [hours] = booking.pickup_time.split(':').map(Number);
      const hour = `${hours.toString().padStart(2, '0')}:00`;
      utilization[hour] = (utilization[hour] || 0) + 1;
    }
  });
  
  return utilization;
};

// Enhanced availability checking
const checkSlotAvailability = (
  slotTime: string,
  selectedDate: Date,
  existingBookings: any[],
  utilization: Record<string, number>,
  options: {
    bufferBefore: number;
    bufferAfter: number;
    slotDuration: number;
    minimumNoticeHours: number;
    vehicleCapacity: number;
  }
): { available: boolean; reason?: string; priority?: 'high' | 'medium' | 'low' } => {
  const now = new Date();
  const [hours, minutes] = slotTime.split(':').map(Number);
  const slotDateTime = new Date(selectedDate);
  slotDateTime.setHours(hours, minutes, 0, 0);
  const slotEnd = addMinutes(slotDateTime, options.slotDuration);
  const slotHour = format(slotDateTime, 'HH:00');
  
  // Check if slot is in the past
  if (isBefore(slotDateTime, now)) {
    return { available: false, reason: 'Vergangene Zeit' };
  }
  
  // Check minimum notice time
  const minimumNoticeTime = addMinutes(now, options.minimumNoticeHours * 60);
  if (isBefore(slotDateTime, minimumNoticeTime)) {
    return { 
      available: false, 
      reason: `Zu kurzfristig (min. ${options.minimumNoticeHours}h Vorlauf)` 
    };
  }
  
  // Check vehicle capacity
  const currentUtilization = utilization[slotHour] || 0;
  if (currentUtilization >= options.vehicleCapacity) {
    return { 
      available: false, 
      reason: `Alle Fahrzeuge belegt (${currentUtilization}/${options.vehicleCapacity})` 
    };
  }
  
  // Check conflicts with existing bookings
  for (const booking of existingBookings) {
    if (booking.pickup_time) {
      const [bookingHours, bookingMinutes] = booking.pickup_time.split(':').map(Number);
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(bookingHours, bookingMinutes, 0, 0);
      const bookingEnd = addMinutes(bookingDateTime, options.slotDuration);
      
      // Simple overlap check
      if (
        (slotDateTime >= bookingDateTime && slotDateTime < bookingEnd) ||
        (slotEnd > bookingDateTime && slotEnd <= bookingEnd) ||
        (slotDateTime <= bookingDateTime && slotEnd >= bookingEnd)
      ) {
        return { 
          available: false, 
          reason: `Belegt (${format(bookingDateTime, 'HH:mm')} - ${format(bookingEnd, 'HH:mm')})` 
        };
      }
    }
  }
  
  // Determine priority based on utilization
  let priority: 'high' | 'medium' | 'low' = 'high';
  const utilizationRatio = currentUtilization / options.vehicleCapacity;
  
  if (utilizationRatio > 0.7) {
    priority = 'low';
  } else if (utilizationRatio > 0.4) {
    priority = 'medium';
  }
  
  return { available: true, priority };
};

// Export utility functions
export const getOptimalTimeSlots = (timeSlots: TimeSlot[], count: number = 3): TimeSlot[] => {
  return timeSlots
    .filter(slot => slot.available)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium']);
    })
    .slice(0, count);
};

export const getTimeSlotsByPeriod = (timeSlots: TimeSlot[]) => {
  const morning = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 6 && hour < 12;
  });
  
  const afternoon = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  
  const evening = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 17 && hour < 22;
  });
  
  return { morning, afternoon, evening };
};

export const getAvailabilityStats = (timeSlots: TimeSlot[]) => {
  const total = timeSlots.length;
  const available = timeSlots.filter(slot => slot.available).length;
  const highPriority = timeSlots.filter(slot => slot.available && slot.priority === 'high').length;
  
  return {
    total,
    available,
    unavailable: total - available,
    availabilityRate: total > 0 ? (available / total) * 100 : 0,
    highPrioritySlots: highPriority
  };
};