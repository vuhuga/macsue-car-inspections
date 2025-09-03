import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InspectionService } from '../../services/inspection.service';
import { ContactMessage } from '../../models/inspection.model';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contactData: ContactMessage = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  errors: string[] = [];
  success = false;
  isLoading = false;

  constructor(private inspectionService: InspectionService) {}

  onSubmit() {
    this.errors = [];
    this.isLoading = true;

    // Validation
    if (!this.contactData.name) this.errors.push('Name is required');
    if (!this.contactData.email || !this.isValidEmail(this.contactData.email)) {
      this.errors.push('Valid email is required');
    }
    if (!this.contactData.subject) this.errors.push('Subject is required');
    if (!this.contactData.message) this.errors.push('Message is required');

    if (this.errors.length === 0) {
      this.inspectionService.sendContactMessage(this.contactData).subscribe(result => {
        this.isLoading = false;
        if (result.success) {
          this.success = true;
          this.resetForm();
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm() {
    this.contactData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
