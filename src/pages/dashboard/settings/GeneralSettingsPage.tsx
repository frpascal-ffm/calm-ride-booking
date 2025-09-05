import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings } from 'lucide-react';

const GeneralSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Allgemeine Einstellungen</h1>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Unternehmensinformationen</CardTitle>
            <CardDescription>
              Verwalten Sie die grundlegenden Informationen Ihres Unternehmens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Firmenname</Label>
                <Input id="company-name" placeholder="Ihr Firmenname" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">E-Mail</Label>
                <Input id="company-email" type="email" placeholder="kontakt@firma.de" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Adresse</Label>
              <Input id="company-address" placeholder="Straße, PLZ Ort" />
            </div>
            <Button>Änderungen speichern</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Systemeinstellungen</CardTitle>
            <CardDescription>
              Konfigurieren Sie allgemeine Systemeinstellungen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Zeitzone</Label>
                <Input id="timezone" value="Europe/Berlin" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Sprache</Label>
                <Input id="language" value="Deutsch" readOnly />
              </div>
            </div>
            <Button>Einstellungen aktualisieren</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;