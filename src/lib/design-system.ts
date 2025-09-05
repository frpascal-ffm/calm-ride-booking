/**
 * Design System Configuration für Krankentransport-System
 * 
 * Diese Datei definiert die Design-Tokens, Komponenten-Varianten und
 * Utility-Funktionen für ein konsistentes UI-Design.
 */

import { type ClassValue } from "clsx";
import { cn } from "./utils";

// Design Tokens
export const designTokens = {
  // Spacing Scale (basierend auf 4px Grid)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem",  // 8px
    md: "1rem",    // 16px
    lg: "1.5rem",  // 24px
    xl: "2rem",    // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },
  
  // Typography Scale
  typography: {
    sizes: {
      xs: "0.75rem",   // 12px
      sm: "0.875rem",  // 14px
      base: "1rem",    // 16px
      lg: "1.125rem",  // 18px
      xl: "1.25rem",   // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  
  // Border Radius
  radius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem",   // 8px
    xl: "0.75rem",  // 12px
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
} as const;

// Komponenten-Varianten für das Krankentransport-System
export const componentVariants = {
  // Button Varianten
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "bg-success text-success-foreground hover:bg-success/90",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },
  
  // Card Varianten
  card: {
    default: "bg-card text-card-foreground border border-border rounded-lg shadow-sm",
    elevated: "bg-card text-card-foreground border border-border rounded-lg shadow-lg",
    interactive: "bg-card text-card-foreground border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer",
  },
  
  // Status Badges
  badge: {
    pending: "bg-warning-light text-warning border-warning/20",
    confirmed: "bg-success-light text-success border-success/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    completed: "bg-muted text-muted-foreground border-border",
  },
  
  // Form Varianten
  input: {
    default: "border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20",
    error: "border-destructive focus:border-destructive focus:ring-destructive/20",
    success: "border-success focus:border-success focus:ring-success/20",
  },
} as const;

// Utility-Funktionen für das Design-System
export const designUtils = {
  // Responsive Breakpoints Helper
  responsive: {
    sm: "@media (min-width: 640px)",
    md: "@media (min-width: 768px)",
    lg: "@media (min-width: 1024px)",
    xl: "@media (min-width: 1280px)",
    "2xl": "@media (min-width: 1536px)",
  },
  
  // Fokus-Styles für Accessibility
  focus: "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  
  // Transition Presets
  transitions: {
    fast: "transition-all duration-150 ease-in-out",
    normal: "transition-all duration-200 ease-in-out",
    slow: "transition-all duration-300 ease-in-out",
  },
} as const;

// Helper-Funktionen
export function createVariant(
  base: string,
  variant: string,
  ...additional: ClassValue[]
): string {
  return cn(base, variant, ...additional);
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "text-warning",
    confirmed: "text-success",
    cancelled: "text-destructive",
    completed: "text-muted-foreground",
  };
  return statusMap[status] || "text-foreground";
}

export function getStatusBadge(status: string): string {
  const badgeMap: Record<string, string> = {
    pending: componentVariants.badge.pending,
    confirmed: componentVariants.badge.confirmed,
    cancelled: componentVariants.badge.cancelled,
    completed: componentVariants.badge.completed,
  };
  return badgeMap[status] || componentVariants.badge.pending;
}

// Krankentransport-spezifische Utility-Funktionen
export const transportUtils = {
  // Prioritäts-Farben für verschiedene Transport-Arten
  getPriorityColor: (priority: "normal" | "urgent" | "emergency"): string => {
    const priorityMap = {
      normal: "text-foreground",
      urgent: "text-warning",
      emergency: "text-destructive",
    };
    return priorityMap[priority];
  },
  
  // Fahrzeug-Typ Icons/Styles
  getVehicleTypeStyle: (type: "standard" | "wheelchair" | "stretcher"): string => {
    const typeMap = {
      standard: "text-primary",
      wheelchair: "text-accent-foreground",
      stretcher: "text-warning",
    };
    return typeMap[type];
  },
  
  // Zeit-Formatierung Utilities
  formatTimeSlot: (start: string, end: string): string => {
    return `${start} - ${end}`;
  },
} as const;

// Export für einfache Verwendung
export { cn } from "./utils";