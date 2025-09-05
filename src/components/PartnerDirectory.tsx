import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building2, ExternalLink, Users } from 'lucide-react';
import { getPartnerUrls } from '@/data/seedData';

const PartnerDirectory = () => {
  const partnerUrls = getPartnerUrls();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Partner-Verzeichnis</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Übersicht aller verfügbaren Partner-Buchungsseiten. 
            Klicken Sie auf einen Partner, um zur entsprechenden Buchungsseite zu gelangen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerUrls.map((partner) => (
            <Card key={partner.partnerId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{partner.partnerName}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {partner.companyName}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 bg-muted rounded text-sm font-mono">
                    {partner.url}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={partner.url}>
                        Buchungsseite öffnen
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Partner-ID: {partner.partnerId.slice(0, 8)}...
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {partnerUrls.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Partner gefunden</h3>
              <p className="text-muted-foreground">
                Es sind derzeit keine aktiven Partner konfiguriert.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Entwicklungshinweise</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Diese Seite zeigt alle verfügbaren Partner-URLs für das Dynamic Routing.
              </p>
              <p>
                URL-Format: <code className="bg-background px-2 py-1 rounded">/{'{companySlug}'}/{'{partnerSlug}'}</code>
              </p>
              <p>
                Die Partner-Daten werden aus <code className="bg-background px-2 py-1 rounded">src/data/seedData.ts</code> geladen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerDirectory;