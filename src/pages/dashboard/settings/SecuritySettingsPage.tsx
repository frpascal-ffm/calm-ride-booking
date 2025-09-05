import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';

const SecuritySettingsPage: React.FC = () => {
  const recentSessions = [
    { id: 1, device: 'Chrome auf Windows', location: 'Berlin, Deutschland', lastActive: '2 Minuten', current: true },
    { id: 2, device: 'Safari auf iPhone', location: 'Berlin, Deutschland', lastActive: '1 Stunde', current: false },
    { id: 3, device: 'Firefox auf macOS', location: 'München, Deutschland', lastActive: '2 Tage', current: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Sicherheitseinstellungen</h1>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Passwort ändern</CardTitle>
            <CardDescription>
              Aktualisieren Sie Ihr Passwort für mehr Sicherheit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Aktuelles Passwort</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Passwort bestätigen</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Passwort aktualisieren
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
            <CardDescription>
              Erhöhen Sie die Sicherheit Ihres Kontos mit 2FA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-base font-medium">Authenticator App</Label>
                  <p className="text-sm text-muted-foreground">
                    Verwenden Sie eine Authenticator-App für zusätzliche Sicherheit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aktiviert
                </Badge>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-base font-medium">Backup-Codes</Label>
                  <p className="text-sm text-muted-foreground">
                    Generieren Sie Backup-Codes für den Notfall
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Codes generieren
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aktive Sitzungen</CardTitle>
            <CardDescription>
              Verwalten Sie Ihre aktiven Anmeldungen auf verschiedenen Geräten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{session.device}</h3>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • Zuletzt aktiv: {session.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.current ? (
                      <Badge variant="default">Aktuelle Sitzung</Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Abmelden
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="destructive" className="mt-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alle anderen Sitzungen beenden
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sicherheitseinstellungen</CardTitle>
            <CardDescription>
              Zusätzliche Sicherheitsoptionen für Ihr Konto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Login-Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">
                  E-Mail-Benachrichtigung bei neuen Anmeldungen
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Automatische Abmeldung</Label>
                <p className="text-sm text-muted-foreground">
                  Automatische Abmeldung nach 30 Minuten Inaktivität
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Button>Einstellungen speichern</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;