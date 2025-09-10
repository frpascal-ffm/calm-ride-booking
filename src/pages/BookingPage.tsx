import React from 'react';
import { useParams } from 'react-router-dom';
import { MedicalTransportBooking } from '@/components/MedicalTransportBooking';

interface BookingPageParams {
  companySlug: string;
  partnerSlug: string;
}

export const BookingPage: React.FC = () => {
  const { companySlug, partnerSlug } = useParams<BookingPageParams>();

  // Mock data - in real implementation, fetch from database
  const companyData = {
    id: '1',
    name: 'MediTransport GmbH',
    theme_primary: '#0ea5e9',
    theme_logo_url: undefined,
    cutoff_hours: 10,
    service_radius_km: 25
  };

  const partnerData = {
    id: '1',
    name: 'Pflegedienst Sonnenschein',
    email: 'info@pflegedienst-sonnenschein.de'
  };

  if (!companySlug || !partnerSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Ungültiger Buchungslink</h1>
          <p className="text-muted-foreground">
            Der Buchungslink ist nicht korrekt formatiert. 
            Bitte wenden Sie sich an Ihren Transportdienstleister.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MedicalTransportBooking
      companyId={companyData.id}
      partnerId={partnerData.id}
      companyData={companyData}
      partnerData={partnerData}
    />
  );
};