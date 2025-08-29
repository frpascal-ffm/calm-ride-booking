import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { BookingForm } from './BookingForm';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  email: string;
  company_id: string;
  active: boolean;
  company: {
    name: string;
    slug: string;
    arbeitszeiten_start: string;
    arbeitszeiten_end: string;
    karenzzeit: number;
  };
}

const PartnerBookingPage = () => {
  const { companySlug, partnerSlug } = useParams();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartnerData();
  }, [companySlug, partnerSlug]);

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      
      // Fetch partner with company data
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select(`
          id,
          name,
          email,
          company_id,
          active,
          company:organizations!company_id (
            name,
            slug,
            arbeitszeiten_start,
            arbeitszeiten_end,
            karenzzeit
          )
        `)
        .eq('slug', partnerSlug)
        .eq('active', true)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data || !data.company || data.company.slug !== companySlug) {
        setError('Partner nicht gefunden oder nicht aktiv');
        return;
      }

      setPartner(data as Partner);
    } catch (err: any) {
      console.error('Error fetching partner:', err);
      setError('Partner konnte nicht geladen werden');
      toast({
        title: "Fehler",
        description: "Partner konnte nicht geladen werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lade Partner-Daten...</p>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Partner nicht verfügbar</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              {error || 'Dieser Partner ist derzeit nicht verfügbar oder wurde deaktiviert.'}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        {/* Partner Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Startseite
          </Button>
          
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Buchung für {partner.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {partner.company.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Arbeitszeiten:</span>
                  <p className="text-muted-foreground">
                    {partner.company.arbeitszeiten_start} - {partner.company.arbeitszeiten_end}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Karenzzeit:</span>
                  <p className="text-muted-foreground">
                    {partner.company.karenzzeit} Minuten
                  </p>
                </div>
                <div>
                  <span className="font-medium">Kontakt:</span>
                  <p className="text-muted-foreground">
                    {partner.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <BookingForm 
          partnerId={partner.id}
          companyId={partner.company_id}
          partnerEmail={partner.email}
          workingHours={{
            start: partner.company.arbeitszeiten_start,
            end: partner.company.arbeitszeiten_end
          }}
          bufferMinutes={partner.company.karenzzeit}
        />
      </div>
    </div>
  );
};

export default PartnerBookingPage;