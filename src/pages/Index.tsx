import React, { useState } from 'react';
import { BookingForm } from '@/components/BookingForm';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'booking' | 'admin'>('home');
  
  if (currentView === 'booking') {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto">
          <div className="mb-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="mb-4"
            >
              ← Zurück zur Startseite
            </Button>
          </div>
          <BookingForm />
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto">
          <div className="mb-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="mb-4"
            >
              ← Zurück zur Startseite
            </Button>
          </div>
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Krankentransport
              <span className="text-primary block">Buchungssystem</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Einfache und schnelle Terminbuchung für Ihre Partner. 
              Professionelle Abwicklung mit nur wenigen Klicks.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('booking')}
              className="text-lg px-8 py-6"
            >
              Neue Buchung
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentView('admin')}
              className="text-lg px-8 py-6"
            >
              Admin Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Warum unser Buchungssystem?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entwickelt speziell für Krankentransporte mit allen wichtigen Funktionen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>15-Minuten Takt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Präzise Terminplanung mit automatischer Fahrzeit-Berechnung und Karenzzeit-Verwaltung
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Partner-URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Individuelle Buchungslinks für jeden Partner ohne Login-Anforderung
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Medizinische Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Erfassung aller relevanten Patienteninformationen und Besonderheiten
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Bereit für die erste Buchung?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Starten Sie jetzt mit einer einfachen und professionellen Transportbuchung
          </p>
          <Button 
            size="lg" 
            onClick={() => setCurrentView('booking')}
            className="text-lg px-8 py-6"
          >
            Jetzt buchen
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
