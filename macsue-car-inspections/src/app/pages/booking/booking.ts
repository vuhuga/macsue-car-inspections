import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InspectionService } from '../../services/inspection.service';
import { Inspection } from '../../models/inspection.model';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  bookingData: Inspection = {
    carMake: '',
    carModel: '',
    carYear: new Date().getFullYear(),
    carType: 'sedan',
    inspectionType: 'body',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    status: 'pending'
  };

  errors: string[] = [];
  success = false;
  isLoading = false;
  estimatedPrice = 0;

  timeSlots = [
    '09:00:00', '10:00:00', '11:00:00', '12:00:00',
    '13:00:00', '14:00:00', '15:00:00', '16:00:00'
  ];

  currentYear = new Date().getFullYear();
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private authService: AuthService,
    private inspectionService: InspectionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Set minimum date to today
    const today = new Date();
    this.bookingData.appointmentDate = today.toISOString().split('T')[0];
    this.updatePrice();
  }

  updatePrice() {
    this.estimatedPrice = this.inspectionService.getPrice(
      this.bookingData.carType, 
      this.bookingData.inspectionType
    );
  }

  onSubmit() {
    this.errors = [];
    this.isLoading = true;

    // Validation
    if (!this.bookingData.carMake) this.errors.push('Car make is required');
    if (!this.bookingData.carModel) this.errors.push('Car model is required');
    if (!this.bookingData.carYear || this.bookingData.carYear < 1900) {
      this.errors.push('Valid car year is required');
    }
    if (!this.bookingData.appointmentDate) this.errors.push('Appointment date is required');
    if (!this.bookingData.appointmentTime) this.errors.push('Appointment time is required');

    // Check if date is in the future
    const appointmentDateTime = new Date(`${this.bookingData.appointmentDate}T${this.bookingData.appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      this.errors.push('Appointment date and time must be in the future');
    }

    if (this.errors.length === 0) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.bookingData.userId = currentUser.id;
        
        this.inspectionService.bookInspection(this.bookingData).subscribe(result => {
          this.isLoading = false;
          if (result.success) {
            this.success = true;
          } else {
            this.errors.push(result.error || 'Failed to book inspection');
          }
        });
      }
    } else {
      this.isLoading = false;
    }
  }

  formatTimeSlot(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
}
