export interface CustomHeading {
  id: string;
  title: string;
  content: string;
}

export interface PricingSlot {
  id: string;
  label: string;
  price: number;
  unit: string;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  keyword?: string;
  title: string;
  date?: Date;
  activities: string[];
}

export interface BankDetails {
  bank: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface Itinerary {
  id?: string;
  itineraryCode: string;
  consultantName: string;
  consultantNumber: string;
  quotationDate: Date;
  destination: string;
  duration: string;
  travelDate: Date;
  transportDetails: string;
  clientName: string;
  groupSize: number;
  customHeadings: CustomHeading[];
  pricingSlots: PricingSlot[];
  showDay0: boolean;
  dayPlans: DayPlan[];
  notes: string[];
  inclusions: string[];
  exclusions: string[];
  termsConditions: string;
  cancellationPolicy: string;
  bankDetails: BankDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface Keyword {
  id?: string;
  keyword: string;
  activities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Form data types for each step
export interface Step1FormData {
  consultantName: string;
  consultantNumber: string;
  quotationDate: Date;
  destination: string;
  duration: string;
  travelDate: Date;
  transportDetails: string;
  clientName: string;
  groupSize: number;
  customHeadings: CustomHeading[];
  pricingSlots: PricingSlot[];
}

export interface Step2FormData {
  showDay0: boolean;
  dayPlans: DayPlan[];
}

export interface Step3FormData {
  notes: string[];
  inclusions: string[];
  exclusions: string[];
}

export interface Step4FormData {
  termsConditions: string;
  cancellationPolicy: string;
  bankDetails: BankDetails;
}
