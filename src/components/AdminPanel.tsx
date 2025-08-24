import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Copy, Users, Calendar, Settings, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  email: string;
  active: boolean;
  url: string;
  createdAt: Date;
}

export const AdminPanel: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Pflegedienst Müller',
      email: 'kontakt@pflegedienst-mueller.de',
      active: true,
      url: 'https://booking.krankentransport.de/partner/pflegedienst-mueller',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Krankenhaus Nord',
      email: 'transport@krankenhaus-nord.de',
      active: true,
      url: 'https://booking.krankentransport.de/partner/krankenhaus-nord',
      createdAt: new Date('2024-02-20')
    },
    {
      id: '3',
      name: 'Reha-Zentrum Süd',
      email: 'buchung@reha-sued.de',
      active: false,
      url: 'https://booking.krankentransport.de/partner/reha-sued',
      createdAt: new Date('2024-03-10')
    }
  ]);

  const [newPartner, setNewPartner] = useState({
    name: '',
    email: ''
  });

  const { toast } = useToast();

  const generatePartnerUrl = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const replacements: { [key: string]: string } = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
        return replacements[match] || match;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `https://booking.krankentransport.de/partner/${slug}`;
  };

  const addPartner = () => {
    if (newPartner.name && newPartner.email) {
      const partner: Partner = {
        id: Date.now().toString(),
        name: newPartner.name,
        email: newPartner.email,
        active: true,
        url: generatePartnerUrl(newPartner.name),
        createdAt: new Date()
      };
      
      setPartners([...partners, partner]);
      setNewPartner({ name: '', email: '' });
      
      toast({
        title: "Partner hinzugefügt",
        description: `${partner.name} wurde erfolgreich erstellt.`
      });
    }
  };

  const togglePartnerStatus = (id: string) => {
    setPartners(partners.map(partner => 
      partner.id === id 
        ? { ...partner, active: !partner.active }
        : partner
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link kopiert",
      description: "Der Partner-Link wurde in die Zwischenablage kopiert."
    });
  };

  const mockBookings = [
    {
      id: '1',
      patient: 'Max Mustermann',
      partner: 'Pflegedienst Müller',
      date: '24.08.2024',
      time: '09:30',
      from: 'Hauptstr. 123, 12345 Berlin',
      to: 'Krankenhaus Nord, Nordstr. 456, 12345 Berlin',
      status: 'bestätigt'
    },
    {
      id: '2',
      patient: 'Anna Schmidt',
      partner: 'Krankenhaus Nord',
      date: '24.08.2024',
      time: '14:15',
      from: 'Parkweg 789, 12345 Berlin',
      to: 'Reha-Zentrum Süd, Südstr. 321, 12345 Berlin',
      status: 'geplant'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Krankentransport Verwaltung</span>
        </div>
      </div>

      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Partner Verwaltung</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Buchungen</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Einstellungen</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
          {/* Add New Partner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Neuen Partner hinzufügen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner Name</Label>
                  <Input
                    id="partnerName"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    placeholder="z.B. Pflegedienst Beispiel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerEmail">E-Mail</Label>
                  <Input
                    id="partnerEmail"
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    placeholder="kontakt@beispiel.de"
                  />
                </div>
                <Button onClick={addPartner} className="w-full">
                  Partner hinzufügen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Partners List */}
          <div className="grid gap-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{partner.name}</h3>
                        <Badge variant={partner.active ? "default" : "secondary"}>
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{partner.email}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground">Buchungs-URL:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">{partner.url}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(partner.url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(partner.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`toggle-${partner.id}`} className="text-sm">
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </Label>
                        <Switch
                          id={`toggle-${partner.id}`}
                          checked={partner.active}
                          onCheckedChange={() => togglePartnerStatus(partner.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktuelle Buchungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{booking.patient}</h4>
                      <Badge variant={booking.status === 'bestätigt' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Partner: {booking.partner}</div>
                      <div>Termin: {booking.date} um {booking.time}</div>
                      <div>Von: {booking.from}</div>
                      <div>Nach: {booking.to}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Arbeitszeiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Beginn der Buchungszeiten</Label>
                  <Input id="startTime" type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Ende der Buchungszeiten</Label>
                  <Input id="endTime" type="time" defaultValue="18:00" />
                </div>
              </div>
              <Button className="mt-4">Einstellungen speichern</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Karenzzeit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bufferTime">Zusätzliche Karenzzeit (Minuten)</Label>
                <Input id="bufferTime" type="number" defaultValue="15" min="0" max="60" />
                <p className="text-sm text-muted-foreground">
                  Diese Zeit wird zusätzlich zur Fahrzeit für die Blockierung von Terminen verwendet.
                </p>
              </div>
              <Button className="mt-4">Einstellungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};