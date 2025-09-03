import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerData: RegisterRequest = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phone: ''
  };
  
  errors: string[] = [];
  success = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errors = [];
    this.isLoading = true;

    // Validation
    if (!this.registerData.username) this.errors.push('Username is required');
    if (!this.registerData.password) this.errors.push('Password is required');
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errors.push('Passwords do not match');
    }
    if (!this.registerData.email) this.errors.push('Email is required');
    if (!this.isValidEmail(this.registerData.email)) this.errors.push('Invalid email format');
    if (!this.registerData.fullName) this.errors.push('Full name is required');
    if (!this.registerData.phone) this.errors.push('Phone number is required');

    if (this.errors.length === 0) {
      this.authService.register(this.registerData).subscribe(result => {
        this.isLoading = false;
        if (result.success) {
          this.success = true;
        } else {
          this.errors.push(result.error || 'Registration failed');
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
}
