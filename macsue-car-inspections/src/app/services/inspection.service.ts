import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Inspection, PriceInfo, ContactMessage } from '../models/inspection.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private inspectionsSubject = new BehaviorSubject<Inspection[]>([]);
  public inspections$ = this.inspectionsSubject.asObservable();

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
      status: 'scheduled',
      userId: 2,
      notes: 'Please check the transmission carefully'
    }
  ];

  private prices: PriceInfo[] = [
    { carType: 'sedan', inspectionType: 'body', price: 49.99 },
    { carType: 'sedan', inspectionType: 'mechanical', price: 79.99 },
    { carType: 'sedan', inspectionType: 'full', price: 119.99 },
    { carType: 'suv', inspectionType: 'body', price: 59.99 },
    { carType: 'suv', inspectionType: 'mechanical', price: 89.99 },
    { carType: 'suv', inspectionType: 'full', price: 139.99 },
    { carType: 'truck', inspectionType: 'body', price: 69.99 },
    { carType: 'truck', inspectionType: 'mechanical', price: 99.99 },
    { carType: 'truck', inspectionType: 'full', price: 159.99 },
    { carType: 'other', inspectionType: 'body', price: 79.99 },
    { carType: 'other', inspectionType: 'mechanical', price: 109.99 },
    { carType: 'other', inspectionType: 'full', price: 179.99 }
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.inspections.push(newInspection);
    this.inspectionsSubject.next([...this.inspections]);

    return of({ success: true });
  }

  updateInspectionStatus(id: number, status: Inspection['status']): Observable<{ success: boolean }> {
    const inspection = this.inspections.find(i => i.id === id);
    if (inspection) {
      inspection.status = status;
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
}