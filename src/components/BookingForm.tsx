import React from 'react';
import { BookingFormV2 } from './BookingFormV2';

interface PatientData {
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  caseNumber: string;
  pickupAddress: string;
  destinationAddress: string;
  additionalInfo: string;
}

interface PatientConditions {
  adipositas: boolean;
  infectious: boolean;
  wheelchair: boolean;
  visuallyImpaired: boolean;
  additionalNotes: boolean;
  notes: string;
}

interface BookingFormProps {
  partnerId?: string;
  companyId?: string;
  partnerEmail?: string;
  workingHours?: {
    start: string;
    end: string;
  };
  bufferMinutes?: number;
}

export const BookingForm: React.FC<BookingFormProps> = (props) => {
  return <BookingFormV2 {...props} />;
};

// Export types for backward compatibility
export type { PatientData, PatientConditions, BookingFormProps };