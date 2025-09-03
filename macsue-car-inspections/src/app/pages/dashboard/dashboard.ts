import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InspectionService } from '../../services/inspection.service';
import { Inspection } from '../../models/inspection.model';
import { User } from '../../models/user.model';
import { FilterPipe } from '../../pipes/filter-pipe';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FilterPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  inspections: Inspection[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private inspectionService: InspectionService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadInspections();
    }
  }

  loadInspections() {
    if (this.currentUser) {
      this.inspectionService.getInspectionsByUser(this.currentUser.id!).subscribe(inspections => {
        this.inspections = inspections;
        this.isLoading = false;
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'scheduled': return 'bg-info';
      case 'in-progress': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
