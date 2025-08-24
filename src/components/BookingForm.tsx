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
import { CalendarIcon, Clock, MapPin, Users, FileText, CheckCircle } from 'lucide-react';
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={patientData.firstName}
                  onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                  placeholder="Max"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={patientData.lastName}
                  onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                  placeholder="Mustermann"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Geburtsdatum *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !patientData.birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                <Label htmlFor="caseNumber">Fallnummer</Label>
                <Input
                  id="caseNumber"
                  value={patientData.caseNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Abholadresse *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pickupAddress"
                    value={patientData.pickupAddress}
                    onChange={(e) => setPatientData({ ...patientData, pickupAddress: e.target.value })}
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
                    value={patientData.destinationAddress}
                    onChange={(e) => setPatientData({ ...patientData, destinationAddress: e.target.value })}
                    placeholder="Straße, Hausnummer, PLZ Ort"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Weitere Patienteninfos</Label>
                <Textarea
                  id="additionalInfo"
                  value={patientData.additionalInfo}
                  onChange={(e) => setPatientData({ ...patientData, additionalInfo: e.target.value })}
                  placeholder="Zusätzliche Informationen zum Patienten..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adipositas"
                  checked={conditions.adipositas}
                  onCheckedChange={(checked) => setConditions({ ...conditions, adipositas: checked as boolean })}
                />
                <Label htmlFor="adipositas" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Adipositas
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="infectious"
                  checked={conditions.infectious}
                  onCheckedChange={(checked) => setConditions({ ...conditions, infectious: checked as boolean })}
                />
                <Label htmlFor="infectious" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Infektiös
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wheelchair"
                  checked={conditions.wheelchair}
                  onCheckedChange={(checked) => setConditions({ ...conditions, wheelchair: checked as boolean })}
                />
                <Label htmlFor="wheelchair" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Rollstuhlfahrer
                </Label>
              </div>
              
              {conditions.wheelchair && (
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="barrierFree"
                    checked={conditions.barrierFree}
                    onCheckedChange={(checked) => setConditions({ ...conditions, barrierFree: checked as boolean })}
                  />
                  <Label htmlFor="barrierFree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Barrierefrei erforderlich
                  </Label>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visuallyImpaired"
                  checked={conditions.visuallyImpaired}
                  onCheckedChange={(checked) => setConditions({ ...conditions, visuallyImpaired: checked as boolean })}
                />
                <Label htmlFor="visuallyImpaired" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Sehbeeinträchtigt
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="additionalNotes"
                  checked={conditions.additionalNotes}
                  onCheckedChange={(checked) => setConditions({ ...conditions, additionalNotes: checked as boolean })}
                />
                <Label htmlFor="additionalNotes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Weitere Besonderheiten
                </Label>
              </div>
              
              {conditions.additionalNotes && (
                <div className="ml-6 space-y-2">
                  <Textarea
                    value={conditions.notes}
                    onChange={(e) => setConditions({ ...conditions, notes: e.target.value })}
                    placeholder="Beschreiben Sie weitere Besonderheiten..."
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Datum wählen *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "dd.MM.yyyy", { locale: de })
                      ) : (
                        <span>Datum wählen</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
                <div className="space-y-3">
                  <Label>Abholzeit wählen *</Label>
                  <div className="text-sm text-muted-foreground mb-3">
                    Geschätzte Fahrzeit: ca. 25 Min. - Bitte geben Sie die gewünschte Abholzeit an.
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs"
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Buchungsübersicht</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span>{patientData.firstName} {patientData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Geburtsdatum:</span>
                  <span>{patientData.birthDate ? format(patientData.birthDate, "dd.MM.yyyy", { locale: de }) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fallnummer:</span>
                  <span>{patientData.caseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Von:</span>
                  <span className="text-right">{patientData.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nach:</span>
                  <span className="text-right">{patientData.destinationAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Termin:</span>
                  <span>{selectedDate ? format(selectedDate, "dd.MM.yyyy", { locale: de }) : '-'} um {selectedTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail für Bestätigung *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
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
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Transportbuchung
          </CardTitle>
          
          {/* Progress Steps */}
          <div className="flex justify-between items-center mt-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step.number 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="text-xs mt-2 text-center font-medium">{step.title}</span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-full mt-2 transition-colors",
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Zurück
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Weiter
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-success hover:bg-success/90">
                Buchung abschließen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};