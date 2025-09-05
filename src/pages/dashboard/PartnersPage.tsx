import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Copy, ExternalLink, Trash2, Edit, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePartners } from '@/hooks/usePartners';
import { useOrganizations } from '@/hooks/useOrganizations';

export const PartnersPage: React.FC = () => {
  const { partners, loading: partnersLoading, error: partnersError, addPartner, togglePartnerStatus, deletePartner } = usePartners();
  const { organizations, loading: orgsLoading } = useOrganizations();

  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    company_id: ''
  });

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopiert!",
      description: "URL wurde in die Zwischenablage kopiert."
    });
  };

  if (partnersLoading || orgsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Partner Verwaltung</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Partner Verwaltung</h2>
          <p className="text-muted-foreground">Verwalten Sie Ihre Partner und deren Buchungslinks</p>
        </div>
      </div>

      {/* Neuen Partner hinzufügen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Neuen Partner hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="partner-name">Name</Label>
              <Input
                id="partner-name"
                placeholder="Partner Name"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="partner-email">E-Mail</Label>
              <Input
                id="partner-email"
                type="email"
                placeholder="partner@example.com"
                value={newPartner.email}
                onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="partner-company">Organisation</Label>
              <Select
                value={newPartner.company_id}
                onValueChange={(value) => setNewPartner({ ...newPartner, company_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Organisation wählen" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddPartner} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Partner hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Partner Liste */}
      <div className="grid gap-4">
        {partners?.map((partner) => {
          const organization = organizations?.find(org => org.id === partner.company_id);
          const partnerUrl = generatePartnerUrl(organization?.slug || '', partner.slug);
          
          return (
            <Card key={partner.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{partner.name}</h3>
                      <Badge variant={partner.active ? "default" : "secondary"}>
                        {partner.active ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Aktiv</>
                        ) : (
                          <><AlertCircle className="h-3 w-3 mr-1" /> Inaktiv</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{partner.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Organisation: {organization?.name || 'Unbekannt'}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {partnerUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(partnerUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(partnerUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={partner.active ? "secondary" : "default"}
                      onClick={() => togglePartnerStatus(partner.id)}
                    >
                      {partner.active ? 'Deaktivieren' : 'Aktivieren'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Partner löschen</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sind Sie sicher, dass Sie {partner.name} löschen möchten? 
                            Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletePartner(partner.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {partners?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Partner vorhanden</h3>
            <p className="text-muted-foreground mb-4">
              Fügen Sie Ihren ersten Partner hinzu, um zu beginnen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartnersPage;