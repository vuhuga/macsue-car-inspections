import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Inspection, PriceInfo, ContactMessage, AdminMessage } from '../models/inspection.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private inspectionsSubject = new BehaviorSubject<Inspection[]>([]);
  public inspections$ = this.inspectionsSubject.asObservable();
  
  private adminMessagesSubject = new BehaviorSubject<AdminMessage[]>([]);
  public adminMessages$ = this.adminMessagesSubject.asObservable();
  
  private adminMessages: AdminMessage[] = [];

  // Mock data
  private inspections: Inspection[] = [
    {
      id: 1,
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: 2018,
      carType: 'sedan',
      inspectionType: 'full',
      appointmentDate: '2024-12-15',
      appointmentTime: '10:00:00',
      status: 'accepted',
      userId: 2,
      user: {
        id: 2,
        fullName: 'Regular User',
        email: 'user@macsue.com'
      },
      notes: 'Please check the transmission carefully'
    },
    {
      id: 2,
      carMake: 'Honda',
      carModel: 'Civic',
      carYear: 2020,
      carType: 'sedan',
      inspectionType: 'body',
      appointmentDate: '2024-12-20',
      appointmentTime: '14:00:00',
      status: 'pending',
      userId: 2,
      user: {
        id: 2,
        fullName: 'Regular User',
        email: 'user@macsue.com'
      },
      notes: 'Minor scratches on the door'
    }
  ];

  private prices: PriceInfo[] = [
    { carType: 'sedan', inspectionType: 'body', price: 3500 },
    { carType: 'sedan', inspectionType: 'mechanical', price: 5500 },
    { carType: 'sedan', inspectionType: 'full', price: 8500 },
    { carType: 'suv', inspectionType: 'body', price: 4000 },
    { carType: 'suv', inspectionType: 'mechanical', price: 6500 },
    { carType: 'suv', inspectionType: 'full', price: 10000 },
    { carType: 'truck', inspectionType: 'body', price: 5000 },
    { carType: 'truck', inspectionType: 'mechanical', price: 8000 },
    { carType: 'truck', inspectionType: 'full', price: 12500 },
    { carType: 'other', inspectionType: 'body', price: 4500 },
    { carType: 'other', inspectionType: 'mechanical', price: 7000 },
    { carType: 'other', inspectionType: 'full', price: 11000 }
  ];

  constructor() {
    this.inspectionsSubject.next(this.inspections);
  }

  getInspections(): Observable<Inspection[]> {
    return this.inspections$;
  }

  getInspectionsByUser(userId: number): Observable<Inspection[]> {
    const userInspections = this.inspections.filter(i => i.userId === userId);
    return of(userInspections);
  }

  getAllInspections(): Observable<Inspection[]> {
    // Update the BehaviorSubject to trigger subscribers
    this.inspectionsSubject.next([...this.inspections]);
    return of([...this.inspections]);
  }

  bookInspection(inspection: Inspection): Observable<{ success: boolean; error?: string }> {
    // Validate appointment date is in the future
    const appointmentDateTime = new Date(`${inspection.appointmentDate}T${inspection.appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      return of({ success: false, error: 'Appointment date must be in the future' });
    }

    const newInspection: Inspection = {
      ...inspection,
      id: this.inspections.length + 1,
      status: 'pending',
      user: inspection.user || {
        id: inspection.userId || 0,
        fullName: 'Unknown User',
        email: 'unknown@example.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.inspections.push(newInspection);
    this.inspectionsSubject.next([...this.inspections]);

    return of({ success: true });
  }

  updateInspectionStatus(id: number, status: Inspection['status'], adminNotes?: string): Observable<{ success: boolean }> {
    const inspection = this.inspections.find(i => i.id === id);
    if (inspection) {
      inspection.status = status;
      if (adminNotes !== undefined) {
        inspection.adminNotes = adminNotes;
      }
      inspection.updatedAt = new Date().toISOString();
      this.inspectionsSubject.next([...this.inspections]);
      return of({ success: true });
    }
    return of({ success: false });
  }

  getPrice(carType: string, inspectionType: string): number {
    const priceInfo = this.prices.find(p => 
      p.carType === carType && p.inspectionType === inspectionType
    );
    return priceInfo?.price || 0;
  }

  getAllPrices(): Observable<PriceInfo[]> {
    return of(this.prices);
  }

  sendContactMessage(message: ContactMessage): Observable<{ success: boolean }> {
    // In a real app, this would send the message to a backend
    console.log('Contact message sent:', message);
    return of({ success: true });
  }

  acceptInspection(id: number, adminNotes?: string): Observable<{ success: boolean }> {
    const inspection = this.inspections.find(i => i.id === id);
    if (inspection) {
      inspection.status = 'accepted';
      inspection.adminNotes = adminNotes;
      inspection.updatedAt = new Date().toISOString();
      this.inspectionsSubject.next([...this.inspections]);
      return of({ success: true });
    }
    return of({ success: false });
  }

  rejectInspection(id: number, adminNotes?: string): Observable<{ success: boolean }> {
    const inspection = this.inspections.find(i => i.id === id);
    if (inspection) {
      inspection.status = 'rejected';
      inspection.adminNotes = adminNotes;
      inspection.updatedAt = new Date().toISOString();
      this.inspectionsSubject.next([...this.inspections]);
      return of({ success: true });
    }
    return of({ success: false });
  }

  sendAdminMessage(inspectionId: number, message: string, adminId: number): Observable<{ success: boolean }> {
    const newMessage: AdminMessage = {
      id: this.adminMessages.length + 1,
      inspectionId,
      message,
      sentAt: new Date().toISOString(),
      sentBy: adminId
    };
    
    this.adminMessages.push(newMessage);
    this.adminMessagesSubject.next([...this.adminMessages]);
    return of({ success: true });
  }

  getMessagesByInspection(inspectionId: number): Observable<AdminMessage[]> {
    const messages = this.adminMessages.filter(m => m.inspectionId === inspectionId);
    return of(messages);
  }

  getAllMessages(): Observable<AdminMessage[]> {
    return of([...this.adminMessages]);
  }
}