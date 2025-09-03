import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Booking } from './pages/booking/booking';
import { Contact } from './pages/contact/contact';
import { Services } from './pages/services/services';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'booking', component: Booking, canActivate: [AuthGuard] },
  { path: 'contact', component: Contact },
  { path: 'services', component: Services },
  { path: '**', redirectTo: '' }
];
