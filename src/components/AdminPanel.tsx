import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Copy, Users, Calendar, Settings, ExternalLink, Trash2, Edit, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBookings } from '@/hooks/useBookings';
import { usePartners } from '@/hooks/usePartners';
import { useOrganizations } from '@/hooks/useOrganizations';

export const AdminPanel: React.FC = () => {
  const { bookings, loading: bookingsLoading, error: bookingsError, updateBookingStatus, deleteBooking } = useBookings();
  const { partners, loading: partnersLoading, error: partnersError, addPartner, togglePartnerStatus, deletePartner } = usePartners();
  const { organizations, loading: orgsLoading } = useOrganizations();

  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    company_id: ''
  });

  const [selectedOrg, setSelectedOrg] = useState<string>('');

  const { toast } = useToast();

  const generatePartnerUrl = (companySlug: string, partnerSlug: string) => {
    return `${window.location.origin}/${companySlug}/${partnerSlug}`;
  };

  const handleAddPartner = async () => {
    if (newPartner.name && newPartner.email && newPartner.company_id) {
      try {
        await addPartner(newPartner);
        setNewPartner({ name: '', email: '', company_id: '' });
        
        toast({
          title: "Partner hinzugefügt",
          description: `${newPartner.name} wurde erfolgreich erstellt.`
        });
      } catch (error) {
        toast({
          title: "Fehler",
          description: "Partner konnte nicht hinzugefügt werden.",
          variant: "destructive"
        });
      }
    }
  };

  const handleTogglePartnerStatus = async (id: string) => {
    try {
      await togglePartnerStatus(id);
      toast({
        title: "Status geändert",
        description: "Partner-Status wurde erfolgreich aktualisiert."
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link kopiert",
      description: "Der Partner-Link wurde in die Zwischenablage kopiert."
    });
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'bestätigt':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'geplant':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'storniert':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'bestätigt':
        return 'default';
      case 'geplant':
        return 'secondary';
      case 'storniert':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      toast({
        title: "Buchung gelöscht",
        description: "Die Buchung wurde erfolgreich gelöscht."
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Buchung konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast({
        title: "Status aktualisiert",
        description: "Der Buchungsstatus wurde erfolgreich geändert."
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden.",
        variant: "destructive"
      });
    }
  };

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
                <Select value={newPartner.company_id} onValueChange={(value) => setNewPartner({ ...newPartner, company_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Organisation wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Button onClick={handleAddPartner} className="w-full" disabled={partnersLoading}>
                  {partnersLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Wird hinzugefügt...</>
                  ) : (
                    "Partner hinzufügen"
                  )}
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
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {partner.organization ? generatePartnerUrl(partner.organization.slug, partner.slug) : 'URL nicht verfügbar'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(partner.organization ? generatePartnerUrl(partner.organization.slug, partner.slug) : '')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => partner.organization && window.open(generatePartnerUrl(partner.organization.slug, partner.slug), '_blank')}
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
                          onCheckedChange={() => handleTogglePartnerStatus(partner.id)}
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
              <CardTitle className="flex items-center justify-between">
                <span>Aktuelle Buchungen</span>
                {bookingsLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsError && (
                <div className="text-red-500 text-sm mb-4">
                  Fehler beim Laden der Buchungen: {bookingsError}
                </div>
              )}
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Keine Buchungen vorhanden
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span>{booking.patient_name}</span>
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={booking.status || 'geplant'}
                            onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="geplant">Geplant</SelectItem>
                              <SelectItem value="bestätigt">Bestätigt</SelectItem>
                              <SelectItem value="storniert">Storniert</SelectItem>
                            </SelectContent>
                          </Select>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Buchung löschen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Sind Sie sicher, dass Sie diese Buchung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBooking(booking.id)}>
                                  Löschen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>Partner: {booking.partner?.name || 'Unbekannt'}</div>
                        <div>Termin: {formatDate(booking.booking_date)} um {formatTime(booking.pickup_time)}</div>
                        <div>Von: {booking.pickup_address}</div>
                        <div>Nach: {booking.destination_address}</div>
                        {booking.case_number && (
                          <div className="md:col-span-2">Fallnummer: {booking.case_number}</div>
                        )}
                        {booking.patient_insurance && (
                          <div>Versicherung: {booking.patient_insurance}</div>
                        )}
                        {(booking.wheelchair || booking.adipositas || booking.infectious || booking.visually_impaired) && (
                          <div className="md:col-span-2">
                            <span>Besonderheiten: </span>
                            {[
                              booking.wheelchair && 'Rollstuhl',
                              booking.adipositas && 'Adipositas',
                              booking.infectious && 'Infektiös',
                              booking.visually_impaired && 'Sehbeeinträchtigt'
                            ].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
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