import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Users, Clock, Shield, ArrowRight, ExternalLink, 
  Phone, Mail, MapPin, Star, CheckCircle, Zap, 
  TrendingUp, Award, Smartphone, Monitor 
} from 'lucide-react';

const Index = () => {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Vielen Dank für Ihre Anfrage! Wir melden uns binnen 24 Stunden bei Ihnen.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-primary mr-2" />
              <span className="text-xl font-bold">CalmRide</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Referenzen</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Kontakt</a>
              <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
                <Zap className="w-4 h-4 mr-1" />
                Revolutionäre Buchungstechnologie
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-relaxed">
                Krankentransport
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block">
                  neu gedacht
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Steigern Sie Ihre Effizienz um <strong>300%</strong> mit unserem intelligenten 
                Buchungssystem. Automatisierte Terminplanung, nahtlose Partner-Integration 
                und professionelle Abwicklung – alles in einer Lösung.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Kostenlose Demo anfordern
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6 border-2 hover:bg-gray-50"
                  asChild
                >
                  <Link to="/dashboard">
                    Live Demo ansehen
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Keine Einrichtungskosten
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  30 Tage kostenlos testen
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Monitor className="w-5 h-5 text-gray-400" />
                </div>
                
                <img 
                  src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20medical%20transport%20booking%20dashboard%20interface%20with%20calendar%20view%2C%20clean%20blue%20and%20white%20design%2C%20professional%20healthcare%20software%20UI%2C%20desktop%20application%20screenshot&image_size=landscape_4_3" 
                  alt="Desktop Dashboard Preview" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">300%</div>
              <div className="text-gray-600">Effizienzsteigerung</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Verfügbarkeit</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15min</div>
              <div className="text-gray-600">Buchungszeit</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              <Award className="w-4 h-4 mr-1" />
              Branchenführende Technologie
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Warum führende Unternehmen
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                auf CalmRide setzen
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reduzieren Sie administrative Aufwände um 80% und steigern Sie gleichzeitig 
              die Kundenzufriedenheit durch nahtlose Buchungsprozesse.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Intelligente Terminplanung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Automatische Fahrzeit-Berechnung, Karenzzeit-Management und 
                  Konfliktprävention im 15-Minuten-Takt.
                </p>
                <div className="text-sm text-blue-600 font-semibold">
                  ✓ 90% weniger Planungsfehler
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Partner-Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Individuelle Buchungslinks für jeden Partner. Keine Schulungen, 
                  keine Logins – einfach buchen.
                </p>
                <div className="text-sm text-purple-600 font-semibold">
                  ✓ 100% Partnerakzeptanz
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">DSGVO-Konform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Vollständige Erfassung medizinischer Details mit höchsten 
                  Datenschutz- und Sicherheitsstandards.
                </p>
                <div className="text-sm text-green-600 font-semibold">
                  ✓ ISO 27001 zertifiziert
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Echtzeit-Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Detaillierte Berichte, KPI-Tracking und Optimierungsvorschläge 
                  für maximale Rentabilität.
                </p>
                <div className="text-sm text-orange-600 font-semibold">
                  ✓ 25% höhere Auslastung
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Mobile-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Optimiert für alle Endgeräte. Ihre Partner können von überall 
                  und jederzeit buchen.
                </p>
                <div className="text-sm text-indigo-600 font-semibold">
                  ✓ 95% mobile Nutzung
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Blitzschnelle Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Setup in unter 24 Stunden. Nahtlose Integration in bestehende 
                  Systeme ohne Ausfallzeiten.
                </p>
                <div className="text-sm text-red-600 font-semibold">
                  ✓ 0 Tage Downtime
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">
              <Star className="w-4 h-4 mr-1" />
              Kundenstimmen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Über 500 Krankentransport-Unternehmen vertrauen bereits auf CalmRide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Seit der Einführung von CalmRide haben wir unsere Buchungszeiten um 75% reduziert. 
                  Die Partner sind begeistert von der einfachen Handhabung."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">MS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Maria Schmidt</div>
                    <div className="text-gray-600 text-sm">Geschäftsführerin, MedTransport GmbH</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Die automatische Terminplanung ist ein Gamechanger. Keine Doppelbuchungen mehr, 
                  alles läuft reibungslos. ROI nach nur 3 Monaten!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">TK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Thomas Krüger</div>
                    <div className="text-gray-600 text-sm">Leiter Operations, VitalCare Services</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Unsere Partner lieben die individuellen Buchungslinks. Endlich keine 
                  Telefonate mehr um 6 Uhr morgens. Absolute Empfehlung!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">AW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Andrea Weber</div>
                    <div className="text-gray-600 text-sm">Inhaberin, HealthRide München</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-blue-100 text-blue-800">
                <Phone className="w-4 h-4 mr-1" />
                Kostenlose Beratung
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bereit für den
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  nächsten Schritt?
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Lassen Sie uns gemeinsam analysieren, wie CalmRide Ihr Unternehmen 
                transformieren kann. Kostenlose Demo und individuelle Beratung.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">30 Tage kostenlos testen</div>
                    <div className="text-gray-600">Vollzugriff ohne Risiko</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Persönliche Einrichtung</div>
                    <div className="text-gray-600">Unser Team richtet alles für Sie ein</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Keine Vertragsbindung</div>
                    <div className="text-gray-600">Monatlich kündbar</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Kostenlose Demo anfordern
                  </h3>
                  <p className="text-gray-600">
                    Wir melden uns binnen 24 Stunden bei Ihnen
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unternehmen *
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Ihr Unternehmen"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ihr Name"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ihre@email.de"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+49 123 456789"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nachricht
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Erzählen Sie uns von Ihren Anforderungen..."
                    rows={4}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Demo anfordern
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">CalmRide</span>
              </div>
              <p className="text-gray-400 mb-4">
                Die führende Buchungsplattform für Krankentransporte in Deutschland.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Preise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karriere</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hilfe Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dokumentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 CalmRide. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Impressum</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Datenschutz</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">AGB</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
