export interface Inspection {
  id?: number;
  carMake: string;
  carModel: string;
  carYear: number;
  carType: 'sedan' | 'suv' | 'truck' | 'other';
  inspectionType: 'body' | 'mechanical' | 'full';
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  userId?: number;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceInfo {
  carType: string;
  inspectionType: string;
  price: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface AdminMessage {
  id?: number;
  inspectionId: number;
  message: string;
  sentAt: string;
  sentBy: number;
}