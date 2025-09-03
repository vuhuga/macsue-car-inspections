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
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  userId?: number;
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