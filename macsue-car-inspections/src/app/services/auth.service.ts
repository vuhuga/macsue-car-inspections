import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users database
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@macsue.com',
      fullName: 'Admin User',
      phone: '123-456-7890',
      password: 'admin123',
      isAdmin: true
    },
    {
      id: 2,
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      phone: '555-0123',
      password: 'password123'
    }
  ];

  constructor() {
    // Check if user is logged in on service initialization
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<{ success: boolean; user?: User; error?: string }> {
    const user = this.users.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }
      this.currentUserSubject.next(userWithoutPassword);
      
      return of({ success: true, user: userWithoutPassword });
    } else {
      return of({ success: false, error: 'Invalid username or password' });
    }
  }

  register(userData: RegisterRequest): Observable<{ success: boolean; error?: string }> {
    // Check if username or email already exists
    const existingUser = this.users.find(u => 
      u.username === userData.username || u.email === userData.email
    );

    if (existingUser) {
      return of({ success: false, error: 'Username or email already exists' });
    }

    if (userData.password !== userData.confirmPassword) {
      return of({ success: false, error: 'Passwords do not match' });
    }

    // Create new user
    const newUser: User = {
      id: this.users.length + 1,
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      password: userData.password
    };

    this.users.push(newUser);
    return of({ success: true });
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.isAdmin === true;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}