export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height: number; // in cm
  weight: number; // in kg
  location: {
    division: string;
    district: string;
    area: string;
  };
  medicalHistory?: string;
  allergies?: string;
  isDonor: boolean;
  lastDonationDate?: string;
  profileComplete: boolean;
  role: 'patient' | 'doctor' | 'admin'; // New: Multi-role support
  specialization?: string; // For doctors
  bmdc?: string; // For doctors
  licenseNumber?: string; // For doctors
  licenseExpiry?: string; // For doctors
  clinicAddress?: string; // For doctors
  consultationFee?: number; // For doctors
  availableSlots?: string[]; // For doctors
  totalPatients?: number; // For doctors
  rating?: number; // For doctors
  verified?: boolean; // For doctors
  createdAt?: string;
  updatedAt?: string;
}

// Health Timeline Entry
export interface TimelineEntry {
  id: string;
  userId: string;
  type: 'ai_consultation' | 'doctor_visit' | 'lab_report' | 'prescription' | 'test_ordered' | 'appointment';
  date: string;
  title: string;
  description: string;
  symptoms?: string[];
  aiImpression?: string;
  medicines?: Medicine[];
  tests?: Test[];
  followUpDate?: string;
  urgencyLevel?: 'low' | 'medium' | 'high';
  doctorId?: string;
  doctorName?: string;
  consultationId?: string;
  reportId?: string;
}

// AI Consultation Record
export interface Consultation {
  id: string;
  userId: string;
  date: string;
  messages: ChatMessage[];
  symptoms: string[];
  duration?: string;
  severity?: string;
  medicinesTaken?: string;
  otherConditions?: string;
  aiImpression?: string;
  recommendedMedicines?: Medicine[];
  recommendedTests?: Test[];
  followUpNeeded: boolean;
  followUpAfterDays?: number;
  urgencyLevel: 'low' | 'medium' | 'high';
  advice: string[];
  redFlags?: string[];
  status: 'active' | 'resolved' | 'follow_up_needed';
  daysWithSymptoms?: number;
  nextVisitDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  message: string;
  timestamp: string;
  questionType?: 'greeting' | 'symptom' | 'duration' | 'severity' | 'medicine_history' | 'other_conditions' | 'follow_up';
}

export interface Medicine {
  brand: string;
  name: string;
  dosage: string;
  frequency: string;
  price: number;
  quantity: number;
  duration?: string;
}

export interface Test {
  name: string;
  reason: string;
  price: number;
  category?: string;
}

// Appointment
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'in_person' | 'video' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

// Lab Report
export interface LabReport {
  id: string;
  userId: string;
  date: string;
  type: string;
  file?: string;
  aiAnalysis?: {
    abnormalMarkers: string[];
    insights: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  values?: Record<string, { value: number; unit: string; normal: string; status: 'normal' | 'low' | 'high' }>;
}

// Prescription
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  location: {
    division: string;
    district: string;
    area: string;
  };
  lastDonationDate: string;
  age: number;
  height: number;
  weight: number;
  physicalCondition: string;
  distance?: number;
}