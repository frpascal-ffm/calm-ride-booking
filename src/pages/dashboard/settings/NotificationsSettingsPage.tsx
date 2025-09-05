import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Smartphone, Monitor } from 'lucide-react';

const NotificationsSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Benachrichtigungseinstellungen</h1>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>E-Mail Benachrichtigungen</CardTitle>
            <CardDescription>
              Konfigurieren Sie, welche E-Mail-Benachrichtigungen Sie erhalten möchten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-bookings" className="text-base font-medium">
                    Neue Buchungen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigung bei neuen Transportbuchungen
                  </p>
                </div>
              </div>
              <Switch id="email-bookings" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-cancellations" className="text-base font-medium">
                    Stornierungen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigung bei Buchungsstornierungen
                  </p>
                </div>
              </div>
              <Switch id="email-cancellations" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-reports" className="text-base font-medium">
                    Wöchentliche Berichte
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Zusammenfassung der wöchentlichen Aktivitäten
                  </p>
                </div>
              </div>
              <Switch id="email-reports" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Push-Benachrichtigungen</CardTitle>
            <CardDescription>
              Verwalten Sie Browser- und Mobile-Push-Benachrichtigungen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="browser-notifications" className="text-base font-medium">
                    Browser-Benachrichtigungen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sofortige Benachrichtigungen im Browser
                  </p>
                </div>
              </div>
              <Switch id="browser-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="mobile-notifications" className="text-base font-medium">
                    Mobile Benachrichtigungen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Push-Benachrichtigungen auf mobilen Geräten
                  </p>
                </div>
              </div>
              <Switch id="mobile-notifications" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Benachrichtigungszeiten</CardTitle>
            <CardDescription>
              Legen Sie fest, wann Sie Benachrichtigungen erhalten möchten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Ruhemodus</Label>
                <p className="text-sm text-muted-foreground">
                  Keine Benachrichtigungen zwischen 22:00 und 06:00 Uhr
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Wochenende</Label>
                <p className="text-sm text-muted-foreground">
                  Reduzierte Benachrichtigungen am Wochenende
                </p>
              </div>
              <Switch />
            </div>
            
            <Button className="mt-4">Einstellungen speichern</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsSettingsPage;