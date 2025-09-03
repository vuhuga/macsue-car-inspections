import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };
  
  errors: string[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errors = [];
    this.isLoading = true;

    if (!this.loginData.username) {
      this.errors.push('Username is required');
    }
    if (!this.loginData.password) {
      this.errors.push('Password is required');
    }

    if (this.errors.length === 0) {
      this.authService.login(this.loginData).subscribe(result => {
        this.isLoading = false;
        if (result.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errors.push(result.error || 'Login failed');
        }
      });
    } else {
      this.isLoading = false;
    }
  }
}
