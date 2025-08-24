import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, Clock, MapPin, Users, FileText, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PatientData {
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  caseNumber: string;
  pickupAddress: string;
  destinationAddress: string;
  additionalInfo: string;
}

interface PatientConditions {
  adipositas: boolean;
  infectious: boolean;
  wheelchair: boolean;
  barrierFree: boolean;
  visuallyImpaired: boolean;
  additionalNotes: boolean;
  notes: string;
}

interface BookingFormProps {
  partnerId?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ partnerId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    birthDate: undefined,
    caseNumber: `KT-${Date.now().toString().slice(-6)}`,
    pickupAddress: '',
    destinationAddress: '',
    additionalInfo: ''
  });
  const [conditions, setConditions] = useState<PatientConditions>({
    adipositas: false,
    infectious: false,
    wheelchair: false,
    barrierFree: false,
    visuallyImpaired: false,
    additionalNotes: false,
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [email, setEmail] = useState('');
  
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Patientendaten', icon: Users },
    { number: 2, title: 'Besonderheiten', icon: FileText },
    { number: 3, title: 'Terminwahl', icon: Clock },
    { number: 4, title: 'Bestätigung', icon: CheckCircle }
  ];

  const timeSlots = [
    '08:00', '08:15', '08:30', '08:45',
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45'
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Buchung erfolgreich!",
      description: "Ihre Transportbuchung wurde erfolgreich übermittelt. Sie erhalten eine Bestätigung per E-Mail.",
    });
    
    // Here you would submit to Supabase database
    console.log('Booking data:', {
      patientData,
      conditions,
      selectedDate,
      selectedTime,
      email,
      partnerId
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-medium">Vorname *</Label>
                <Input
                  id="firstName"
                  value={patientData.firstName}
                  onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                  placeholder="Max"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base font-medium">Nachname *</Label>
                <Input
                  id="lastName"
                  value={patientData.lastName}
                  onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                  placeholder="Mustermann"
                  className="h-12 text-base"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Geburtsdatum *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal text-base",
                        !patientData.birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      {patientData.birthDate ? (
                        format(patientData.birthDate, "dd.MM.yyyy", { locale: de })
                      ) : (
                        <span>Datum wählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={patientData.birthDate}
                      onSelect={(date) => setPatientData({ ...patientData, birthDate: date })}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseNumber" className="text-base font-medium">Fallnummer</Label>
                <Input
                  id="caseNumber"
                  value={patientData.caseNumber}
                  disabled
                  className="bg-muted h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress" className="text-base font-medium">Abholadresse *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="pickupAddress"
                    value={patientData.pickupAddress}
                    onChange={(e) => setPatientData({ ...patientData, pickupAddress: e.target.value })}
                    placeholder="Straße, Hausnummer, PLZ Ort"
                    className="pl-12 h-12 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationAddress" className="text-base font-medium">Zieladresse *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="destinationAddress"
                    value={patientData.destinationAddress}
                    onChange={(e) => setPatientData({ ...patientData, destinationAddress: e.target.value })}
                    placeholder="Straße, Hausnummer, PLZ Ort"
                    className="pl-12 h-12 text-base"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-base font-medium">Weitere Patienteninfos</Label>
                <Textarea
                  id="additionalInfo"
                  value={patientData.additionalInfo}
                  onChange={(e) => setPatientData({ ...patientData, additionalInfo: e.target.value })}
                  placeholder="Zusätzliche Informationen zum Patienten..."
                  className="min-h-[100px] text-base"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="adipositas"
                  checked={conditions.adipositas}
                  onCheckedChange={(checked) => setConditions({ ...conditions, adipositas: checked as boolean })}
                  className="mt-1"
                />
                <Label htmlFor="adipositas" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                  Adipositas
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="infectious"
                  checked={conditions.infectious}
                  onCheckedChange={(checked) => setConditions({ ...conditions, infectious: checked as boolean })}
                  className="mt-1"
                />
                <Label htmlFor="infectious" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                  Infektiös
                </Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="wheelchair"
                    checked={conditions.wheelchair}
                    onCheckedChange={(checked) => setConditions({ ...conditions, wheelchair: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="wheelchair" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                    Rollstuhlfahrer
                  </Label>
                </div>
                
                {conditions.wheelchair && (
                  <div className="ml-6 p-4 bg-accent/30 rounded-lg border border-accent">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="barrierFree"
                        checked={conditions.barrierFree}
                        onCheckedChange={(checked) => setConditions({ ...conditions, barrierFree: checked as boolean })}
                        className="mt-1"
                      />
                      <Label htmlFor="barrierFree" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                        Barrierefrei erforderlich
                      </Label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <Checkbox
                  id="visuallyImpaired"
                  checked={conditions.visuallyImpaired}
                  onCheckedChange={(checked) => setConditions({ ...conditions, visuallyImpaired: checked as boolean })}
                  className="mt-1"
                />
                <Label htmlFor="visuallyImpaired" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                  Sehbeeinträchtigt
                </Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    id="additionalNotes"
                    checked={conditions.additionalNotes}
                    onCheckedChange={(checked) => setConditions({ ...conditions, additionalNotes: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="additionalNotes" className="text-base font-medium leading-relaxed cursor-pointer flex-1">
                    Weitere Besonderheiten
                  </Label>
                </div>
                
                {conditions.additionalNotes && (
                  <div className="ml-6 space-y-2">
                    <Textarea
                      value={conditions.notes}
                      onChange={(e) => setConditions({ ...conditions, notes: e.target.value })}
                      placeholder="Beschreiben Sie weitere Besonderheiten..."
                      className="min-h-[100px] text-base"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Datum wählen *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal text-base",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      {selectedDate ? (
                        format(selectedDate, "dd.MM.yyyy", { locale: de })
                      ) : (
                        <span>Datum wählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Abholzeit wählen *</Label>
                    <div className="bg-accent/30 p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Geschätzte Fahrzeit:</strong> ca. 25 Min.<br />
                        Bitte geben Sie die gewünschte <strong>Abholzeit</strong> an.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "h-12 text-base font-medium transition-all",
                          selectedTime === time && "scale-105 shadow-md"
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center text-primary">Buchungsübersicht</h3>
              
              <div className="bg-accent/20 p-4 rounded-lg space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Patient:</span>
                    <span className="text-right font-semibold text-base">{patientData.firstName} {patientData.lastName}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Geburtsdatum:</span>
                    <span className="text-right text-base">{patientData.birthDate ? format(patientData.birthDate, "dd.MM.yyyy", { locale: de }) : '-'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Fallnummer:</span>
                    <span className="text-right text-base font-mono">{patientData.caseNumber}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 space-y-3">
                  <div className="space-y-2">
                    <span className="text-muted-foreground font-medium block">Von:</span>
                    <span className="text-sm bg-white/50 p-2 rounded border">{patientData.pickupAddress}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-muted-foreground font-medium block">Nach:</span>
                    <span className="text-sm bg-white/50 p-2 rounded border">{patientData.destinationAddress}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Termin:</span>
                    <span className="text-right font-semibold text-base text-primary">
                      {selectedDate ? format(selectedDate, "dd.MM.yyyy", { locale: de }) : '-'} um {selectedTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">E-Mail für Bestätigung *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  className="h-12 text-base"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-4 pb-8">
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-primary mb-4">
              Transportbuchung
            </CardTitle>
            
            {/* Mobile-optimized Progress Steps */}
            <div className="space-y-4">
              {/* Current Step Display */}
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2">
                  {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 text-primary" })}
                  <span className="text-base font-semibold text-primary">
                    Schritt {currentStep}: {steps[currentStep - 1].title}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      currentStep >= step.number 
                        ? "bg-primary text-primary-foreground scale-110" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "flex-1 h-2 rounded-full transition-all",
                        currentStep > step.number ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6">
            {renderStepContent()}

            {/* Mobile-optimized Navigation */}
            <div className="flex flex-col space-y-3 pt-6 border-t">
              {currentStep < 4 ? (
                <>
                  <Button 
                    onClick={handleNext}
                    size="lg"
                    className="w-full h-14 text-lg font-semibold"
                  >
                    Weiter
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                  {currentStep > 1 && (
                    <Button
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
                    onClick={handleSubmit} 
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90"
                  >
                    Buchung abschließen
                    <CheckCircle className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    size="lg"
                    className="w-full h-12 text-base"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" />
                    Zurück
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};