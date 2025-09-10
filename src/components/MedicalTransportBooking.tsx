import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  CalendarIcon, 
  MapPin, 
  Users, 
  FileText, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Phone,
  Clock,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MedicalTransportBookingProps {
  companyId: string;
  partnerId: string;
  companyData?: {
    name: string;
    theme_primary?: string;
    theme_logo_url?: string;
    cutoff_hours?: number;
    service_radius_km?: number;
  };
  partnerData?: {
    name: string;
    email?: string;
  };
}

interface BookingData {
  // Patient data
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  insurance: string;
  
  // Transport details
  pickupAddress: string;
  destinationAddress: string;
  notes: string;
  
  // Medical flags
  adipositas: boolean;
  infectious: boolean;
  wheelchair: boolean;
  barrierFree: boolean;
  visuallyImpaired: boolean;
  
  // Appointment
  selectedDate: Date | undefined;
  selectedTime: string;
  
  // Contact
  email: string;
  phone: string;
  
  // GDPR consent
  gdprConsent: boolean;
  termsAccepted: boolean;
}

const STEPS = [
  { id: 1, title: 'Patientendaten', icon: Users, description: 'Grundlegende Informationen' },
  { id: 2, title: 'Transportdetails', icon: MapPin, description: 'Abhol- und Zieladresse' },
  { id: 3, title: 'Besonderheiten', icon: FileText, description: 'Medizinische Angaben' },
  { id: 4, title: 'Terminwahl', icon: Clock, description: 'Datum und Uhrzeit' },
  { id: 5, title: 'Bestätigung', icon: CheckCircle, description: 'Abschluss der Buchung' }
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

export const MedicalTransportBooking: React.FC<MedicalTransportBookingProps> = ({
  companyId,
  partnerId,
  companyData,
  partnerData
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingData>({
    firstName: '',
    lastName: '',
    birthDate: undefined,
    insurance: '',
    pickupAddress: '',
    destinationAddress: '',
    notes: '',
    adipositas: false,
    infectious: false,
    wheelchair: false,
    barrierFree: false,
    visuallyImpaired: false,
    selectedDate: undefined,
    selectedTime: '',
    email: partnerData?.email || '',
    phone: '',
    gdprConsent: false,
    termsAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isWithinCutoff, setIsWithinCutoff] = useState(false);

  const { toast } = useToast();

  const updateFormData = (updates: Partial<BookingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const checkCutoffTime = (selectedDate: Date, selectedTime: string) => {
    if (!selectedDate || !selectedTime) return false;
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const cutoffHours = companyData?.cutoff_hours || 10;
    const cutoffTime = new Date(now.getTime() + cutoffHours * 60 * 60 * 1000);
    
    return appointmentDateTime < cutoffTime;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.birthDate && formData.insurance);
      case 2:
        return !!(formData.pickupAddress && formData.destinationAddress);
      case 3:
        return true; // Medical flags are optional
      case 4:
        return !!(formData.selectedDate && formData.selectedTime);
      case 5:
        return !!(formData.email && formData.gdprConsent && formData.termsAccepted);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Check cutoff time when moving from step 4
        const withinCutoff = checkCutoffTime(formData.selectedDate!, formData.selectedTime);
        setIsWithinCutoff(withinCutoff);
      }
      setCurrentStep(prev => prev + 1);
      setSubmitError(null);
    } else {
      setSubmitError('Bitte füllen Sie alle Pflichtfelder aus.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setSubmitError('Bitte füllen Sie alle Pflichtfelder aus und akzeptieren Sie die Bedingungen.');
      return;
    }

    if (isWithinCutoff) {
      // Show phone call option for bookings within cutoff time
      toast({
        title: "Kurzfristige Buchung",
        description: "Bitte rufen Sie uns für kurzfristige Termine an.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Generate case number
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 4).toUpperCase();
      const caseNumber = `KT-${timestamp}-${random}`;

      const bookingData = {
        company_id: companyId,
        partner_id: partnerId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDate!.toISOString().split('T')[0],
        case_number: caseNumber,
        pickup_address: formData.pickupAddress,
        dropoff_address: formData.destinationAddress,
        pickup_time: formData.selectedTime,
        booking_date: formData.selectedDate!.toISOString().split('T')[0],
        flags_adipositas: formData.adipositas,
        flags_infectious: formData.infectious,
        flags_wheelchair: formData.wheelchair,
        flags_barrier_free: formData.barrierFree,
        flags_visually_impaired: formData.visuallyImpaired,
        notes: formData.notes,
        confirmation_email: formData.email,
        status: 'confirmed'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: "Buchung erfolgreich!",
        description: `Ihre Transportbuchung wurde bestätigt. Fallnummer: ${caseNumber}`,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: undefined,
        insurance: '',
        pickupAddress: '',
        destinationAddress: '',
        notes: '',
        adipositas: false,
        infectious: false,
        wheelchair: false,
        barrierFree: false,
        visuallyImpaired: false,
        selectedDate: undefined,
        selectedTime: '',
        email: partnerData?.email || '',
        phone: '',
        gdprConsent: false,
        termsAccepted: false
      });
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      setSubmitError(error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      toast({
        title: "Buchung fehlgeschlagen",
        description: error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                  placeholder="Max"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Geburtsdatum *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.birthDate ? (
                        format(formData.birthDate, "dd.MM.yyyy", { locale: de })
                      ) : (
                        <span>Datum wählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={(date) => updateFormData({ birthDate: date })}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Krankenversicherung *</Label>
                <Select onValueChange={(value) => updateFormData({ insurance: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Versicherung wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AOK">AOK</SelectItem>
                    <SelectItem value="Barmer">Barmer</SelectItem>
                    <SelectItem value="TK">Techniker Krankenkasse</SelectItem>
                    <SelectItem value="DAK">DAK-Gesundheit</SelectItem>
                    <SelectItem value="IKK">IKK classic</SelectItem>
                    <SelectItem value="andere">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Abholadresse *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={(e) => updateFormData({ pickupAddress: e.target.value })}
                  placeholder="Straße, Hausnummer, PLZ Ort"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationAddress">Zieladresse *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={(e) => updateFormData({ destinationAddress: e.target.value })}
                  placeholder="Straße, Hausnummer, PLZ Ort"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Zusätzliche Informationen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData({ notes: e.target.value })}
                placeholder="Besondere Hinweise, Stockwerk, Besonderheiten..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Bitte geben Sie alle zutreffenden medizinischen Besonderheiten an, damit wir den Transport optimal vorbereiten können.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {[
                { key: 'adipositas' as keyof BookingData, label: 'Adipositas', description: 'Starkes Übergewicht' },
                { key: 'infectious' as keyof BookingData, label: 'Infektiöse Erkrankung', description: 'Ansteckende Krankheit' },
                { key: 'wheelchair' as keyof BookingData, label: 'Rollstuhlfahrer', description: 'Benötigt Rollstuhl' },
                { key: 'barrierFree' as keyof BookingData, label: 'Barrierefrei', description: 'Benötigt barrierefreien Transport' },
                { key: 'visuallyImpaired' as keyof BookingData, label: 'Sehbeeinträchtigung', description: 'Sehbehinderung oder Blindheit' }
              ].map((condition) => (
                <div key={condition.key} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={condition.key}
                    checked={formData[condition.key] as boolean}
                    onCheckedChange={(checked) => 
                      updateFormData({ [condition.key]: checked })
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor={condition.key} className="font-medium cursor-pointer">
                      {condition.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{condition.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Terminwunsch - Datum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.selectedDate ? (
                      format(formData.selectedDate, "PPPP", { locale: de })
                    ) : (
                      <span>Datum wählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.selectedDate}
                    onSelect={(date) => updateFormData({ selectedDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {formData.selectedDate && (
              <div className="space-y-4">
                <Label>Uhrzeit *</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      variant={formData.selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFormData({ selectedTime: time })}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {formData.selectedDate && formData.selectedTime && checkCutoffTime(formData.selectedDate, formData.selectedTime) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Dieser Termin liegt innerhalb der Vorlaufzeit von {companyData?.cutoff_hours || 10} Stunden. 
                  Bitte rufen Sie uns für kurzfristige Termine direkt an.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {isWithinCutoff ? (
              <Alert variant="destructive">
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  Ihr gewünschter Termin liegt innerhalb der Vorlaufzeit. Bitte kontaktieren Sie uns telefonisch für eine sofortige Buchung.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Buchungsübersicht</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p><strong>Patient:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Termin:</strong> {formData.selectedDate ? format(formData.selectedDate, "PPPP", { locale: de }) : ''} um {formData.selectedTime}</p>
                    <p><strong>Abholung:</strong> {formData.pickupAddress}</p>
                    <p><strong>Ziel:</strong> {formData.destinationAddress}</p>
                    {(formData.wheelchair || formData.adipositas || formData.infectious || formData.visuallyImpaired) && (
                      <div>
                        <strong>Besonderheiten:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.wheelchair && <Badge variant="secondary">Rollstuhl</Badge>}
                          {formData.adipositas && <Badge variant="secondary">Adipositas</Badge>}
                          {formData.infectious && <Badge variant="destructive">Infektiös</Badge>}
                          {formData.visuallyImpaired && <Badge variant="secondary">Sehbeeinträchtigung</Badge>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse für Bestätigung *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      placeholder="ihre.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="gdprConsent"
                      checked={formData.gdprConsent}
                      onCheckedChange={(checked) => updateFormData({ gdprConsent: checked as boolean })}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="gdprConsent" className="text-sm cursor-pointer">
                        Datenschutzeinwilligung (Art. 9 DSGVO) *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Ich willige ein, dass meine Gesundheitsdaten für die Durchführung des Krankentransports verarbeitet werden.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => updateFormData({ termsAccepted: checked as boolean })}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="termsAccepted" className="text-sm cursor-pointer">
                        AGB und Bedingungen akzeptiert *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiere diese.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        {companyData?.theme_logo_url && (
          <img 
            src={companyData.theme_logo_url} 
            alt={companyData.name}
            className="h-12 mx-auto mb-4"
          />
        )}
        <h1 className="text-3xl font-bold text-primary mb-2">
          Krankentransport buchen
        </h1>
        {companyData?.name && (
          <p className="text-lg text-muted-foreground">{companyData.name}</p>
        )}
        {partnerData?.name && (
          <p className="text-sm text-muted-foreground">für {partnerData.name}</p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                currentStep >= step.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <span className="text-xs mt-1 text-center max-w-16">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <STEPS[currentStep - 1].icon className="h-5 w-5" />
            <span>{STEPS[currentStep - 1].title}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {STEPS[currentStep - 1].description}
          </p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          {submitError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext}>
                Weiter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || isWithinCutoff}
              >
                {isSubmitting ? 'Wird gebucht...' : isWithinCutoff ? 'Anrufen erforderlich' : 'Buchung abschließen'}
                {!isSubmitting && !isWithinCutoff && (
                  <CheckCircle className="h-4 w-4 ml-2" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Sicherer Transport • DSGVO-konform • Professioneller Service</p>
      </div>
    </div>
  );
};