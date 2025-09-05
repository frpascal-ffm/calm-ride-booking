import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/status-badge';
import { TimeSlot, TimeSlotGrid } from '@/components/ui/time-slot';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedTimeSlots } from '@/hooks/useAdvancedTimeSlots';
import { supabase } from '@/integrations/supabase/client';

// Validation schemas for each step
const patientDataSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  birthDate: z.date({ required_error: 'Geburtsdatum ist erforderlich' }),
  pickupAddress: z.string().min(5, 'Abholadresse muss mindestens 5 Zeichen haben'),
  destinationAddress: z.string().min(5, 'Zieladresse muss mindestens 5 Zeichen haben'),
  additionalInfo: z.string().optional(),
  insurance: z.string().min(1, 'Versicherung ist erforderlich')
});

const conditionsSchema = z.object({
  adipositas: z.boolean().default(false),
  infectious: z.boolean().default(false),
  wheelchair: z.boolean().default(false),
  barrierFree: z.boolean().default(false),
  visuallyImpaired: z.boolean().default(false),
  additionalNotes: z.boolean().default(false),
  notes: z.string().optional()
});

const appointmentSchema = z.object({
  selectedDate: z.date({ required_error: 'Datum ist erforderlich' }),
  selectedTime: z.string().min(1, 'Uhrzeit ist erforderlich')
});

const confirmationSchema = z.object({
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Sie müssen die Geschäftsbedingungen akzeptieren'
  })
});

// Combined schema for final validation
const fullBookingSchema = patientDataSchema
  .merge(conditionsSchema)
  .merge(appointmentSchema)
  .merge(confirmationSchema);

type BookingFormData = z.infer<typeof fullBookingSchema>;

interface BookingFormV2Props {
  partnerId?: string;
  companyId?: string;
  partnerEmail?: string;
  workingHours?: {
    start: string;
    end: string;
  };
  bufferMinutes?: number;
}

const STEPS = [
  { 
    id: 1, 
    title: 'Patientendaten', 
    icon: Users, 
    description: 'Grundlegende Patienteninformationen',
    schema: patientDataSchema 
  },
  { 
    id: 2, 
    title: 'Besonderheiten', 
    icon: FileText, 
    description: 'Medizinische und transport-relevante Besonderheiten',
    schema: conditionsSchema 
  },
  { 
    id: 3, 
    title: 'Terminwahl', 
    icon: Clock, 
    description: 'Datum und Uhrzeit für den Transport',
    schema: appointmentSchema 
  },
  { 
    id: 4, 
    title: 'Bestätigung', 
    icon: CheckCircle, 
    description: 'Überprüfung und Abschluss der Buchung',
    schema: confirmationSchema 
  }
];

export const BookingFormV2: React.FC<BookingFormV2Props> = ({ 
  partnerId, 
  companyId, 
  partnerEmail, 
  workingHours, 
  bufferMinutes = 15 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Form setup with validation
  const form = useForm<BookingFormData>({
    resolver: zodResolver(fullBookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: undefined,
      pickupAddress: '',
      destinationAddress: '',
      additionalInfo: '',
      insurance: '',
      adipositas: false,
      infectious: false,
      wheelchair: false,
      barrierFree: false,
      visuallyImpaired: false,
      additionalNotes: false,
      notes: '',
      selectedDate: undefined,
      selectedTime: '',
      email: partnerEmail || '',
      termsAccepted: false
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();
  const selectedDate = form.watch('selectedDate');
  const wheelchair = form.watch('wheelchair');
  const additionalNotes = form.watch('additionalNotes');

  // Time slots hook
  const { timeSlots, loading: slotsLoading, error: slotsError } = useAdvancedTimeSlots({
    date: selectedDate,
    companyId: companyId || 'default-company-id',
    slotDuration: 30,
    bufferBefore: bufferMinutes,
    bufferAfter: bufferMinutes,
    workingHours: {
      monday: { start: workingHours?.start || '08:00', end: workingHours?.end || '18:00', enabled: true },
      tuesday: { start: workingHours?.start || '08:00', end: workingHours?.end || '18:00', enabled: true },
      wednesday: { start: workingHours?.start || '08:00', end: workingHours?.end || '18:00', enabled: true },
      thursday: { start: workingHours?.start || '08:00', end: workingHours?.end || '18:00', enabled: true },
      friday: { start: workingHours?.start || '08:00', end: workingHours?.end || '18:00', enabled: true },
      saturday: { start: '09:00', end: '16:00', enabled: true },
      sunday: { start: '10:00', end: '14:00', enabled: false }
    }
  });

  // Auto-generate case number
  useEffect(() => {
    const generateCaseNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 4).toUpperCase();
      return `KT-${timestamp}-${random}`;
    };
    
    // Set case number when form is initialized
    if (!form.getValues('firstName') && !form.getValues('lastName')) {
      // This is a new form, generate case number
    }
  }, [form]);

  // Step validation
  const validateCurrentStep = async () => {
    const currentStepData = STEPS[currentStep - 1];
    const values = form.getValues();
    
    try {
      await currentStepData.schema.parseAsync(values);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form errors
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            form.setError(err.path[0] as keyof BookingFormData, {
              message: err.message
            });
          }
        });
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setSubmitError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSubmitError(null);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!partnerId || !companyId) {
        throw new Error('Partner-ID oder Unternehmen-ID fehlt');
      }

      // Combine date and time
      const [hours, minutes] = data.selectedTime.split(':').map(Number);
      const pickupDateTime = new Date(data.selectedDate);
      pickupDateTime.setHours(hours, minutes, 0, 0);

      // Generate case number
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 4).toUpperCase();
      const caseNumber = `KT-${timestamp}-${random}`;

      const bookingData = {
        organization_id: companyId,
        partner_id: partnerId,
        patient_name: `${data.firstName} ${data.lastName}`,
        patient_birth_date: data.birthDate.toISOString().split('T')[0],
        patient_insurance: data.insurance,
        case_number: caseNumber,
        pickup_address: data.pickupAddress,
        destination_address: data.destinationAddress,
        pickup_time: pickupDateTime.toISOString(),
        adipositas: data.adipositas,
        infectious: data.infectious,
        wheelchair: data.wheelchair,
        visually_impaired: data.visuallyImpaired,
        special_requirements: data.notes || null,
        booking_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      // Send confirmation email (simplified - would need proper email service)
      console.log('Booking confirmation email would be sent to:', data.email);

      toast({
        title: "Buchung erfolgreich!",
        description: `Ihre Transportbuchung wurde erfolgreich übermittelt. Fallnummer: ${caseNumber}`,
      });
      
      // Reset form
      form.reset();
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
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Vorname *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Max"
                        className="h-12 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Nachname *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Mustermann"
                        className="h-12 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Geburtsdatum *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal text-base",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5" />
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy", { locale: de })
                            ) : (
                              <span>Datum wählen</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Versicherung *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="AOK, Barmer, etc."
                        className="h-12 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="pickupAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Abholadresse *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Straße, Hausnummer, PLZ Ort"
                          className="pl-12 h-12 text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Zieladresse *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Straße, Hausnummer, PLZ Ort"
                          className="pl-12 h-12 text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Weitere Patienteninfos</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Zusätzliche Informationen zum Patienten..."
                        className="min-h-[100px] text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Bitte geben Sie alle zutreffenden Besonderheiten an, damit wir den Transport optimal vorbereiten können.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {[
                { name: 'adipositas' as const, label: 'Adipositas', description: 'Starkes Übergewicht' },
                { name: 'infectious' as const, label: 'Infektiös', description: 'Ansteckende Erkrankung' },
                { name: 'wheelchair' as const, label: 'Rollstuhlfahrer', description: 'Benötigt Rollstuhl' },
                { name: 'visuallyImpaired' as const, label: 'Sehbeeinträchtigt', description: 'Sehbehinderung oder Blindheit' }
              ].map((condition) => (
                <FormField
                  key={condition.name}
                  control={form.control}
                  name={condition.name}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-base font-medium leading-relaxed cursor-pointer">
                            {condition.label}
                          </FormLabel>
                          <p className="text-sm text-muted-foreground mt-1">
                            {condition.description}
                          </p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              ))}

              {wheelchair && (
                <div className="ml-6 p-4 bg-accent/30 rounded-lg border border-accent">
                  <FormField
                    control={form.control}
                    name="barrierFree"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <FormLabel className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                            Barrierefrei erforderlich
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormLabel className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                        Weitere Besonderheiten
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {additionalNotes && (
                <div className="ml-6 space-y-2">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Beschreiben Sie weitere Besonderheiten..."
                            className="min-h-[100px] text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="selectedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Datum wählen *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal text-base",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5" />
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy", { locale: de })
                          ) : (
                            <span>Datum wählen</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedDate && (
              <div className="space-y-4">
                <div className="bg-accent/30 p-3 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Geschätzte Fahrzeit:</strong> ca. 25 Min.<br />
                    Bitte geben Sie die gewünschte <strong>Abholzeit</strong> an.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="selectedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Abholzeit wählen *</FormLabel>
                      <FormControl>
                        <div>
                          {slotsLoading ? (
                            <div className="text-center py-8">
                              <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
                              <p className="text-muted-foreground">Lade verfügbare Zeiten...</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {timeSlots.map((slot) => (
                                <button
                                  key={slot.time}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => slot.available && field.onChange(slot.time)}
                                  className={cn(
                                    "p-2 text-sm rounded border transition-colors",
                                    slot.available
                                      ? "border-gray-300 hover:border-primary hover:bg-primary/5"
                                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed",
                                    field.value === slot.time && "border-primary bg-primary text-white"
                                  )}
                                >
                                  {slot.time}
                                </button>
                              ))}
                            </div>
                          )}
                          {timeSlots.length === 0 && !slotsLoading && (
                            <div className="text-center py-4 text-muted-foreground">
                              Keine verfügbaren Zeiten für dieses Datum
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary mb-2">Buchungsübersicht</h3>
              <p className="text-muted-foreground">Bitte überprüfen Sie Ihre Angaben vor dem Abschluss</p>
            </div>
            
            <div className="bg-accent/20 p-4 rounded-lg space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground font-medium">Patient:</span>
                  <span className="text-right font-semibold text-base">
                    {watchedValues.firstName} {watchedValues.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground font-medium">Geburtsdatum:</span>
                  <span className="text-right text-base">
                    {watchedValues.birthDate ? format(watchedValues.birthDate, "dd.MM.yyyy", { locale: de }) : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground font-medium">Versicherung:</span>
                  <span className="text-right text-base">{watchedValues.insurance}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <span className="text-muted-foreground font-medium block">Von:</span>
                  <span className="text-sm bg-white/50 p-2 rounded border block">
                    {watchedValues.pickupAddress}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-muted-foreground font-medium block">Nach:</span>
                  <span className="text-sm bg-white/50 p-2 rounded border block">
                    {watchedValues.destinationAddress}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground font-medium">Termin:</span>
                <span className="text-right font-semibold text-base text-primary">
                  {watchedValues.selectedDate ? format(watchedValues.selectedDate, "dd.MM.yyyy", { locale: de }) : '-'} um {watchedValues.selectedTime}
                </span>
              </div>

              {/* Show selected conditions */}
              {(watchedValues.adipositas || watchedValues.infectious || watchedValues.wheelchair || watchedValues.visuallyImpaired) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-muted-foreground font-medium block">Besonderheiten:</span>
                    <div className="flex flex-wrap gap-2">
                      {watchedValues.adipositas && <Badge variant="secondary">Adipositas</Badge>}
                      {watchedValues.infectious && <Badge variant="secondary">Infektiös</Badge>}
                      {watchedValues.wheelchair && <Badge variant="secondary">Rollstuhl</Badge>}
                      {watchedValues.visuallyImpaired && <Badge variant="secondary">Sehbeeinträchtigt</Badge>}
                    </div>
                  </div>
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">E-Mail für Bestätigung *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="ihre@email.de"
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <FormLabel className="text-sm leading-relaxed cursor-pointer flex-1">
                      Ich akzeptiere die <a href="#" className="text-primary underline">Geschäftsbedingungen</a> und <a href="#" className="text-primary underline">Datenschutzbestimmungen</a> *
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-8">
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-primary mb-4">
              Transportbuchung
            </CardTitle>
            
            {/* Progress indicator */}
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {React.createElement(currentStepData.icon, { className: "w-5 h-5 text-primary" })}
                  <span className="text-base font-semibold text-primary">
                    Schritt {currentStep}: {currentStepData.title}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>
              
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Schritt {currentStep} von {STEPS.length}</span>
                  <span>{Math.round(progress)}% abgeschlossen</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}

                {/* Navigation */}
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  {currentStep < STEPS.length ? (
                    <>
                      <Button 
                        type="button"
                        onClick={handleNext}
                        size="lg"
                        className="w-full h-14 text-lg font-semibold"
                      >
                        Weiter
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          size="lg"
                          className="w-full h-12 text-base"
                        >
                          <ChevronLeft className="mr-2 w-4 h-4" />
                          Zurück
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button 
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Buchung wird übermittelt...
                          </>
                        ) : (
                          <>
                            Buchung abschließen
                            <CheckCircle className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base"
                      >
                        <ChevronLeft className="mr-2 w-4 h-4" />
                        Zurück
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};