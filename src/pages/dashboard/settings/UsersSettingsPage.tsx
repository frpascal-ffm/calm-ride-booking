import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Plus, Edit, Trash2 } from 'lucide-react';

const UsersSettingsPage: React.FC = () => {
  const mockUsers = [
    { id: 1, name: 'Max Mustermann', email: 'max@firma.de', role: 'Administrator', status: 'Aktiv' },
    { id: 2, name: 'Anna Schmidt', email: 'anna@firma.de', role: 'Benutzer', status: 'Aktiv' },
    { id: 3, name: 'Tom Weber', email: 'tom@firma.de', role: 'Benutzer', status: 'Inaktiv' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Benutzerverwaltung</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Neuer Benutzer
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Benutzer hinzufügen</CardTitle>
            <CardDescription>
              Fügen Sie neue Benutzer zu Ihrem System hinzu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input id="user-name" placeholder="Vollständiger Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">E-Mail</Label>
                <Input id="user-email" type="email" placeholder="benutzer@firma.de" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Rolle</Label>
              <Input id="user-role" placeholder="Benutzer" />
            </div>
            <Button>Benutzer hinzufügen</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bestehende Benutzer</CardTitle>
            <CardDescription>
              Verwalten Sie alle Benutzer in Ihrem System.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === 'Aktiv' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <Badge variant="outline">{user.role}</Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersSettingsPage;