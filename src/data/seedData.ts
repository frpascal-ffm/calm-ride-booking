// Seed data for development and testing

export const organizations = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Krankentransport Berlin GmbH',
    slug: 'kt-berlin',
    arbeitszeiten_start: '08:00',
    arbeitszeiten_end: '18:00',
    karenzzeit: 15,
    standard_email: 'info@kt-berlin.de'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'MediTransport München',
    slug: 'meditransport-muenchen',
    arbeitszeiten_start: '07:00',
    arbeitszeiten_end: '19:00',
    karenzzeit: 20,
    standard_email: 'kontakt@meditransport-muenchen.de'
  }
];

export const partners = [
  {
    id: '660e8400-e29b-41d4-a716-446655440000',
    company_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Pflegedienst Müller',
    email: 'kontakt@pflegedienst-mueller.de',
    slug: 'pflegedienst-mueller',
    active: true
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    company_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Krankenhaus Nord',
    email: 'transport@krankenhaus-nord.de',
    slug: 'krankenhaus-nord',
    active: true
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    company_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Reha-Zentrum Süd',
    email: 'buchung@reha-sued.de',
    slug: 'reha-sued',
    active: true
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    company_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Praxis Dr. Schmidt',
    email: 'praxis@dr-schmidt.de',
    slug: 'praxis-dr-schmidt',
    active: true
  }
];

// Helper function to get partner with company data
export const getPartnerWithCompany = (companySlug: string, partnerSlug: string) => {
  const company = organizations.find(org => org.slug === companySlug);
  if (!company) return null;
  
  const partner = partners.find(p => p.slug === partnerSlug && p.company_id === company.id && p.active);
  if (!partner) return null;
  
  return {
    ...partner,
    company
  };
};

// Generate partner URLs for testing
export const getPartnerUrls = () => {
  return partners
    .filter(p => p.active)
    .map(partner => {
      const company = organizations.find(org => org.id === partner.company_id);
      return {
        partnerId: partner.id,
        partnerName: partner.name,
        companyName: company?.name,
        url: `/${company?.slug}/${partner.slug}`,
        fullUrl: `http://localhost:5173/${company?.slug}/${partner.slug}`
      };
    });
};