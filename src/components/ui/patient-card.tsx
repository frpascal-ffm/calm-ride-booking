import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { StatusBadge } from "./status-badge";
import { Separator } from "./separator";
import {
  User,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  Accessibility,
  Eye,
  Shield,
} from "lucide-react";

const patientCardVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:shadow-md",
        interactive: "hover:shadow-lg cursor-pointer",
        compact: "p-4",
      },
      priority: {
        normal: "border-l-4 border-l-primary",
        urgent: "border-l-4 border-l-warning",
        emergency: "border-l-4 border-l-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
      priority: "normal",
    },
  }
);

export interface PatientInfo {
  name: string;
  birthDate?: string;
  insurance?: string;
  caseNumber?: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupTime: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
  specialRequirements?: {
    wheelchair?: boolean;
    visuallyImpaired?: boolean;
    infectious?: boolean;
    adipositas?: boolean;
    barrierFree?: boolean;
  };
  additionalNotes?: string;
  priority?: "normal" | "urgent" | "emergency";
}

export interface PatientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof patientCardVariants> {
  patient: PatientInfo;
  showDetails?: boolean;
  onCardClick?: (patient: PatientInfo) => void;
}

function PatientCard({
  className,
  variant,
  priority,
  patient,
  showDetails = true,
  onCardClick,
  ...props
}: PatientCardProps) {
  const handleClick = () => {
    if (variant === "interactive" && onCardClick) {
      onCardClick(patient);
    }
  };

  const getSpecialRequirementIcon = (requirement: string) => {
    const icons = {
      wheelchair: <Accessibility className="h-4 w-4" />,
      visuallyImpaired: <Eye className="h-4 w-4" />,
      infectious: <Shield className="h-4 w-4" />,
      adipositas: <AlertTriangle className="h-4 w-4" />,
      barrierFree: <User className="h-4 w-4" />,
    };
    return icons[requirement as keyof typeof icons];
  };

  const specialRequirements = patient.specialRequirements
    ? Object.entries(patient.specialRequirements)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    : [];

  return (
    <Card
      className={cn(
        patientCardVariants({ variant, priority: patient.priority || priority }),
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              {patient.name}
            </CardTitle>
            {patient.caseNumber && (
              <p className="text-sm text-muted-foreground">
                Fall-Nr: {patient.caseNumber}
              </p>
            )}
          </div>
          <StatusBadge status={patient.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basis-Informationen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {patient.birthDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Geb.: {new Date(patient.birthDate).toLocaleDateString('de-DE')}</span>
            </div>
          )}
          {patient.insurance && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Kasse: {patient.insurance}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Transport-Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {new Date(patient.bookingDate).toLocaleDateString('de-DE')} um {patient.pickupTime}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-green-600">Abholung:</span>
                <p className="text-muted-foreground">{patient.pickupAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-red-600">Ziel:</span>
                <p className="text-muted-foreground">{patient.destinationAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Besondere Anforderungen */}
        {specialRequirements.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Besondere Anforderungen
              </h4>
              <div className="flex flex-wrap gap-2">
                {specialRequirements.map((requirement) => (
                  <Badge
                    key={requirement}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {getSpecialRequirementIcon(requirement)}
                    {requirement === 'wheelchair' && 'Rollstuhl'}
                    {requirement === 'visuallyImpaired' && 'Sehbehinderung'}
                    {requirement === 'infectious' && 'Infektiös'}
                    {requirement === 'adipositas' && 'Adipositas'}
                    {requirement === 'barrierFree' && 'Barrierefrei'}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Zusätzliche Notizen */}
        {showDetails && patient.additionalNotes && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Zusätzliche Informationen</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {patient.additionalNotes}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { PatientCard, patientCardVariants };