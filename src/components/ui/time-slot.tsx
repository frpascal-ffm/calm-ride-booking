import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const timeSlotVariants = cva(
  "flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        available: "border-border bg-background hover:bg-accent hover:border-accent-foreground/20",
        selected: "border-primary bg-primary/10 text-primary",
        unavailable: "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60",
        past: "border-muted bg-muted/30 text-muted-foreground cursor-not-allowed opacity-40",
      },
      size: {
        sm: "p-2 text-sm",
        md: "p-3 text-base",
        lg: "p-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "available",
      size: "md",
    },
  }
);

export interface TimeSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    VariantProps<typeof timeSlotVariants> {
  time: string;
  available?: boolean;
  selected?: boolean;
  isPast?: boolean;
  onTimeSelect?: (time: string) => void;
  disabled?: boolean;
}

function TimeSlot({
  className,
  variant,
  size,
  time,
  available = true,
  selected = false,
  isPast = false,
  onTimeSelect,
  disabled = false,
  ...props
}: TimeSlotProps) {
  const getVariant = () => {
    if (isPast) return "past";
    if (!available || disabled) return "unavailable";
    if (selected) return "selected";
    return "available";
  };

  const handleClick = () => {
    if (!available || disabled || isPast) return;
    onTimeSelect?.(time);
  };

  return (
    <div
      className={cn(timeSlotVariants({ variant: getVariant(), size }), className)}
      onClick={handleClick}
      role="button"
      tabIndex={available && !disabled && !isPast ? 0 : -1}
      aria-selected={selected}
      aria-disabled={!available || disabled || isPast}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      {...props}
    >
      <span className="font-medium">{time}</span>
      {!available && !isPast && (
        <span className="text-xs mt-1 opacity-70">Belegt</span>
      )}
      {isPast && (
        <span className="text-xs mt-1 opacity-70">Vergangen</span>
      )}
    </div>
  );
}

// TimeSlot Grid Komponente für bessere Organisation
export interface TimeSlotGridProps {
  timeSlots: Array<{
    time: string;
    available: boolean;
    isPast?: boolean;
  }>;
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  className?: string;
}

function TimeSlotGrid({
  timeSlots,
  selectedTime,
  onTimeSelect,
  className,
}: TimeSlotGridProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", className)}>
      {timeSlots.map((slot) => (
        <TimeSlot
          key={slot.time}
          time={slot.time}
          available={slot.available}
          selected={selectedTime === slot.time}
          isPast={slot.isPast}
          onTimeSelect={onTimeSelect}
        />
      ))}
    </div>
  );
}

export { TimeSlot, TimeSlotGrid, timeSlotVariants };