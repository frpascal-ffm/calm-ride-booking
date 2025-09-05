import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Clock, Calendar } from "lucide-react";

export interface WorkingHoursProps {
  startTime: string;
  endTime: string;
  bufferMinutes?: number;
  className?: string;
  showBuffer?: boolean;
}

function WorkingHours({
  startTime,
  endTime,
  bufferMinutes = 30,
  className,
  showBuffer = true,
}: WorkingHoursProps) {
  const formatTime = (time: string) => {
    // Erwartet Format: "HH:MM" oder "HH:MM:SS"
    return time.slice(0, 5);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Arbeitszeiten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Betriebszeit:</span>
          </div>
          <Badge variant="outline" className="font-mono">
            {formatTime(startTime)} - {formatTime(endTime)}
          </Badge>
        </div>
        
        {showBuffer && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Karenzzeit:</span>
            </div>
            <Badge variant="secondary">
              {bufferMinutes} Minuten
            </Badge>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p>
            Buchungen sind nur innerhalb der Arbeitszeiten möglich. 
            {showBuffer && (
              <>Die Karenzzeit wird automatisch zu jeder Fahrt hinzugefügt.</>  
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Erweiterte Komponente für Wochentage
export interface WeeklyWorkingHoursProps {
  schedule: Record<string, { start: string; end: string; active: boolean }>;
  bufferMinutes?: number;
  className?: string;
}

function WeeklyWorkingHours({
  schedule,
  bufferMinutes = 30,
  className,
}: WeeklyWorkingHoursProps) {
  const dayNames = {
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Wöchentliche Arbeitszeiten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(schedule).map(([day, hours]) => (
          <div key={day} className="flex items-center justify-between py-2">
            <span className="text-sm font-medium min-w-[80px]">
              {dayNames[day as keyof typeof dayNames]}
            </span>
            {hours.active ? (
              <Badge variant="outline" className="font-mono">
                {formatTime(hours.start)} - {formatTime(hours.end)}
              </Badge>
            ) : (
              <Badge variant="secondary">Geschlossen</Badge>
            )}
          </div>
        ))}
        
        {bufferMinutes > 0 && (
          <>
            <div className="border-t pt-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Karenzzeit:</span>
                <Badge variant="secondary">
                  {bufferMinutes} Minuten
                </Badge>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Utility-Funktion für Zeitberechnungen
export const timeUtils = {
  // Prüft ob eine Zeit innerhalb der Arbeitszeiten liegt
  isWithinWorkingHours: (time: string, start: string, end: string): boolean => {
    const timeMinutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  },
  
  // Generiert verfügbare Zeitslots
  generateTimeSlots: (
    start: string,
    end: string,
    intervalMinutes: number = 30,
    bufferMinutes: number = 30
  ): string[] => {
    const slots: string[] = [];
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end) - bufferMinutes;
    
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += intervalMinutes) {
      slots.push(minutesToTime(minutes));
    }
    
    return slots;
  },
  
  // Fügt Karenzzeit zu einer Zeit hinzu
  addBuffer: (time: string, bufferMinutes: number): string => {
    const minutes = timeToMinutes(time) + bufferMinutes;
    return minutesToTime(minutes);
  },
};

// Helper-Funktionen
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export { WorkingHours, WeeklyWorkingHours };