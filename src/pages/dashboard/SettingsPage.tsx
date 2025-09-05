import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, User, Bell, Shield, Clock, MapPin, Palette, Database, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { toast } = useToast();
  
  // Company Settings State
  const [companySettings, setCompanySettings] = useState({
    name: 'Krankentransport GmbH',
    email: 'info@krankentransport.de',
    phone: '+49 123 456789',
    address: 'Musterstraße 123, 12345 Musterstadt',
    website: 'https://krankentransport.de',
    description: 'Professioneller Krankentransport-Service'
  });

  // Booking Settings State
  const [bookingSettings, setBookingSettings] = useState({
    workingHoursStart: '08:00',
    workingHoursEnd: '18:00',
    bufferMinutes: 15,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    autoConfirmBookings: false,
    requireInsuranceInfo: true,
    allowWeekendBookings: true
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newBookingAlert: true,
    cancellationAlert: true,
    reminderNotifications: true,
    dailyReportEmail: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    loginAttempts: 5
  });

  const handleSaveCompanySettings = () => {
    // Here you would typically save to your backend/database
    toast({
      title: "Einstellungen gespeichert",
      description: "Die Unternehmenseinstellungen wurden erfolgreich aktualisiert.",
    });
  };

  const handleSaveBookingSettings = () => {
    toast({
      title: "Buchungseinstellungen gespeichert",
      description: "Die Buchungseinstellungen wurden erfolgreich aktualisiert.",
    });
  };

  const handleSaveNotificationSettings = () => {
    toast({
      title: "Benachrichtigungseinstellungen gespeichert",
      description: "Die Benachrichtigungseinstellungen wurden erfolgreich aktualisiert.",
    });
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: "Sicherheitseinstellungen gespeichert",
      description: "Die Sicherheitseinstellungen wurden erfolgreich aktualisiert.",
    });
  };

  const handleResetAllSettings = () => {
    toast({
      title: "Einstellungen zurückgesetzt",
      description: "Alle Einstellungen wurden auf die Standardwerte zurückgesetzt.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre System- und Unternehmenseinstellungen
          </p>
        </div>
      </div>

      {/* Company Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Unternehmenseinstellungen
          </CardTitle>
          <CardDescription>
            Grundlegende Informationen über Ihr Unternehmen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Firmenname</Label>
              <Input
                id="company-name"
                value={companySettings.name}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">E-Mail</Label>
              <Input
                id="company-email"
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefon</Label>
              <Input
                id="company-phone"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={companySettings.website}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-address">Adresse</Label>
            <Input
              id="company-address"
              value={companySettings.address}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-description">Beschreibung</Label>
            <Textarea
              id="company-description"
              value={companySettings.description}
              onChange={(e) => setCompanySettings(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <Button onClick={handleSaveCompanySettings} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Buchungseinstellungen
          </CardTitle>
          <CardDescription>
            Konfigurieren Sie die Buchungsparameter und Arbeitszeiten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="working-hours-start">Arbeitsbeginn</Label>
              <Input
                id="working-hours-start"
                type="time"
                value={bookingSettings.workingHoursStart}
                onChange={(e) => setBookingSettings(prev => ({ ...prev, workingHoursStart: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="working-hours-end">Arbeitsende</Label>
              <Input
                id="working-hours-end"
                type="time"
                value={bookingSettings.workingHoursEnd}
                onChange={(e) => setBookingSettings(prev => ({ ...prev, workingHoursEnd: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buffer-minutes">Pufferzeit (Minuten)</Label>
              <Input
                id="buffer-minutes"
                type="number"
                min="5"
                max="60"
                value={bookingSettings.bufferMinutes}
                onChange={(e) => setBookingSettings(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-advance-days">Max. Vorlaufzeit (Tage)</Label>
              <Input
                id="max-advance-days"
                type="number"
                min="1"
                max="365"
                value={bookingSettings.maxAdvanceBookingDays}
                onChange={(e) => setBookingSettings(prev => ({ ...prev, maxAdvanceBookingDays: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatische Bestätigung</Label>
                <p className="text-sm text-muted-foreground">Buchungen automatisch bestätigen</p>
              </div>
              <Switch
                checked={bookingSettings.autoConfirmBookings}
                onCheckedChange={(checked) => setBookingSettings(prev => ({ ...prev, autoConfirmBookings: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Versicherungsinfo erforderlich</Label>
                <p className="text-sm text-muted-foreground">Versicherungsinformationen bei Buchung verlangen</p>
              </div>
              <Switch
                checked={bookingSettings.requireInsuranceInfo}
                onCheckedChange={(checked) => setBookingSettings(prev => ({ ...prev, requireInsuranceInfo: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Wochenend-Buchungen</Label>
                <p className="text-sm text-muted-foreground">Buchungen am Wochenende erlauben</p>
              </div>
              <Switch
                checked={bookingSettings.allowWeekendBookings}
                onCheckedChange={(checked) => setBookingSettings(prev => ({ ...prev, allowWeekendBookings: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveBookingSettings} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Benachrichtigungseinstellungen
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre Benachrichtigungseinstellungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>E-Mail Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">Allgemeine E-Mail Benachrichtigungen erhalten</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">SMS Benachrichtigungen erhalten</p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Neue Buchungen</Label>
                <p className="text-sm text-muted-foreground">Bei neuen Buchungen benachrichtigen</p>
              </div>
              <Switch
                checked={notificationSettings.newBookingAlert}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newBookingAlert: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stornierungen</Label>
                <p className="text-sm text-muted-foreground">Bei Stornierungen benachrichtigen</p>
              </div>
              <Switch
                checked={notificationSettings.cancellationAlert}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, cancellationAlert: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Täglicher Bericht</Label>
                <p className="text-sm text-muted-foreground">Täglichen E-Mail-Bericht erhalten</p>
              </div>
              <Switch
                checked={notificationSettings.dailyReportEmail}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, dailyReportEmail: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveNotificationSettings} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sicherheitseinstellungen
          </CardTitle>
          <CardDescription>
            Konfigurieren Sie Sicherheits- und Zugriffseinstellungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Zwei-Faktor-Authentifizierung</Label>
                <p className="text-sm text-muted-foreground">Zusätzliche Sicherheitsebene aktivieren</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (Minuten)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="15"
                  max="480"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-attempts">Max. Login-Versuche</Label>
                <Input
                  id="login-attempts"
                  type="number"
                  min="3"
                  max="10"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          
          <Button onClick={handleSaveSecuritySettings} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Gefahrenbereich
          </CardTitle>
          <CardDescription>
            Irreversible Aktionen - Vorsicht geboten!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2">Alle Einstellungen zurücksetzen</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Setzt alle Einstellungen auf die Standardwerte zurück. Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Zurücksetzen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Alle Einstellungen zurücksetzen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion setzt alle Ihre Einstellungen auf die Standardwerte zurück. 
                      Dies kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetAllSettings}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Zurücksetzen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;