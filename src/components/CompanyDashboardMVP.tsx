import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  Settings,
  Plus,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Copy,
  QrCode
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  booking_date: string;
  status: string;
  flags_wheelchair: boolean;
  flags_adipositas: boolean;
  flags_infectious: boolean;
  flags_visually_impaired: boolean;
  confirmation_email: string;
  case_number: string;
  notes?: string;
}

interface Vehicle {
  id: string;
  name: string;
  supports_wheelchair: boolean;
  supports_stretcher: boolean;
  active: boolean;
}

interface Partner {
  id: string;
  name: string;
  slug: string;
  email?: string;
  active: boolean;
}

interface Company {
  id: string;
  name: string;
  slug: string;
  depot_address?: string;
  service_radius_km: number;
  cutoff_hours: number;
  theme_primary: string;
  theme_logo_url?: string;
}

export const CompanyDashboardMVP: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load bookings for today
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', today)
        .order('pickup_time');
      
      // Load vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*')
        .eq('active', true);
      
      // Load partners
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .eq('active', true);
      
      // Load company data (mock for now)
      const mockCompany: Company = {
        id: '1',
        name: 'MediTransport GmbH',
        slug: 'meditransport',
        depot_address: 'Musterstraße 123, 12345 Berlin',
        service_radius_km: 25,
        cutoff_hours: 10,
        theme_primary: '#0ea5e9'
      };
      
      setBookings(bookingsData || []);
      setVehicles(vehiclesData || []);
      setPartners(partnersData || []);
      setCompany(mockCompany);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Dashboard-Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Bestätigt';
      case 'pending': return 'Ausstehend';
      case 'completed': return 'Abgeschlossen';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  const generatePartnerLink = (partner: Partner) => {
    return `${window.location.origin}/book/${company?.slug}/${partner.slug}`;
  };

  const copyPartnerLink = (partner: Partner) => {
    const link = generatePartnerLink(partner);
    navigator.clipboard.writeText(link);
    toast({
      title: "Link kopiert",
      description: "Partner-Link wurde in die Zwischenablage kopiert.",
    });
  };

  const todaysBookings = bookings.filter(booking => 
    booking.booking_date === format(selectedDate, 'yyyy-MM-dd')
  );

  const stats = {
    totalBookings: todaysBookings.length,
    confirmedBookings: todaysBookings.filter(b => b.status === 'confirmed').length,
    completedBookings: todaysBookings.filter(b => b.status === 'completed').length,
    utilizationRate: vehicles.length > 0 ? (todaysBookings.length / vehicles.length) * 100 : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{company?.name}</h1>
              <p className="text-primary-foreground/80">Krankentransport Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">
                {format(new Date(), 'EEEE, dd. MMMM yyyy', { locale: de })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heutige Fahrten</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bestätigt</p>
                  <p className="text-3xl font-bold text-green-600">{stats.confirmedBookings}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Abgeschlossen</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.completedBookings}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Auslastung</p>
                  <p className="text-3xl font-bold">{Math.round(stats.utilizationRate)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <Progress value={stats.utilizationRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="bookings">Fahrten</TabsTrigger>
            <TabsTrigger value="vehicles">Fahrzeuge</TabsTrigger>
            <TabsTrigger value="partners">Partner</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Heutige Fahrten ({format(selectedDate, 'dd.MM.yyyy')})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysBookings.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Keine Fahrten für heute geplant.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zeit</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Besonderheiten</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todaysBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.pickup_time}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {booking.first_name} {booking.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.case_number}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>Von:</strong> {booking.pickup_address}
                              </p>
                              <p className="text-sm">
                                <strong>Nach:</strong> {booking.dropoff_address}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusLabel(booking.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {booking.flags_wheelchair && (
                                <Badge variant="secondary" className="text-xs">Rollstuhl</Badge>
                              )}
                              {booking.flags_adipositas && (
                                <Badge variant="secondary" className="text-xs">Adipositas</Badge>
                              )}
                              {booking.flags_infectious && (
                                <Badge variant="destructive" className="text-xs">Infektiös</Badge>
                              )}
                              {booking.flags_visually_impaired && (
                                <Badge variant="secondary" className="text-xs">Sehbehinderung</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>Fahrzeugflotte</span>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Fahrzeug hinzufügen
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicles.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Keine Fahrzeuge konfiguriert. Fügen Sie Fahrzeuge hinzu, um Buchungen zu ermöglichen.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map((vehicle) => (
                      <Card key={vehicle.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{vehicle.name}</h3>
                            <Badge variant={vehicle.active ? "default" : "secondary"}>
                              {vehicle.active ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {vehicle.supports_wheelchair ? "Rollstuhl ✓" : "Rollstuhl ✗"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {vehicle.supports_stretcher ? "Trage ✓" : "Trage ✗"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Partner & Buchungslinks</span>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Partner hinzufügen
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {partners.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Keine Partner konfiguriert. Fügen Sie Partner hinzu, um Buchungslinks zu erstellen.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {partners.map((partner) => (
                      <div key={partner.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{partner.name}</h3>
                            {partner.email && (
                              <p className="text-sm text-muted-foreground">{partner.email}</p>
                            )}
                          </div>
                          <Badge variant={partner.active ? "default" : "secondary"}>
                            {partner.active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Buchungslink:</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              readOnly
                              value={generatePartnerLink(partner)}
                              className="text-sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyPartnerLink(partner)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Grundeinstellungen</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Firmenname</Label>
                      <Input value={company?.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Subdomain</Label>
                      <Input value={company?.slug} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Depot-Adresse</Label>
                      <Input value={company?.depot_address} />
                    </div>
                    <div className="space-y-2">
                      <Label>Servicegebiet (km)</Label>
                      <Input type="number" value={company?.service_radius_km} />
                    </div>
                    <div className="space-y-2">
                      <Label>Vorlaufzeit (Stunden)</Label>
                      <Input type="number" value={company?.cutoff_hours} />
                    </div>
                    <div className="space-y-2">
                      <Label>Primärfarbe</Label>
                      <Input type="color" value={company?.theme_primary} />
                    </div>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    Einstellungen speichern
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};