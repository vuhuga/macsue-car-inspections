import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { InspectionService } from '../../services/inspection.service';
import { Inspection } from '../../models/inspection.model';
import { User } from '../../models/user.model';
import { FilterPipe } from '../../pipes/filter-pipe';
import { NotificationComponent } from '../../components/notification/notification';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FilterPipe, FormsModule, NotificationComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  currentUser: User | null = null;
  inspections: Inspection[] = [];
  isLoading = true;
  selectedInspection: Inspection | null = null;
  adminMessage = '';
  adminNotes = '';
  showMessageModal = false;
  showActionModal = false;
  actionType: 'accept' | 'reject' | null = null;
  showEditModal = false;
  editingInspection: Inspection | null = null;

  // Notification properties
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'warning' | 'info' = 'info';
  showNotification = false;

  // Subscriptions
  private inspectionsSubscription?: Subscription;
  private refreshSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private inspectionService: InspectionService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadInspections();
      this.setupAutoRefresh();
    }
  }

  ngOnDestroy() {
    if (this.inspectionsSubscription) {
      this.inspectionsSubscription.unsubscribe();
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadInspections() {
    if (this.currentUser) {
      // Subscribe to real-time updates
      this.inspectionsSubscription = this.inspectionService.inspections$.subscribe((allInspections: Inspection[]) => {
        const previousCount = this.inspections.length;

        if (this.currentUser?.isAdmin) {
          // Admin sees all inspections
          this.inspections = [...allInspections];
        } else {
          // Regular user sees only their inspections
          this.inspections = allInspections.filter(i => i.userId === this.currentUser?.id);
        }

        // Show notification for new bookings (admin only)
        if (this.currentUser?.isAdmin && allInspections.length > previousCount && !this.isLoading) {
          this.showInfoNotification('New booking request received!');
        }

        this.isLoading = false;
      });
    }
  }

  setupAutoRefresh() {
    // Refresh data every 30 seconds to ensure real-time updates
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.refreshData();
    });
  }

  refreshData() {
    // Force refresh by calling the service method that updates the BehaviorSubject
    this.inspectionService.getAllInspections().subscribe(inspections => {
      // This will trigger the inspections$ observable
    });
  }

  manualRefresh() {
    this.isLoading = true;
    this.refreshData();
    this.showInfoNotification('Dashboard refreshed!');
  }

  isAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'scheduled': return 'bg-info';
      case 'in-progress': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  openActionModal(inspection: Inspection, action: 'accept' | 'reject') {
    this.selectedInspection = inspection;
    this.actionType = action;
    this.adminNotes = '';
    this.showActionModal = true;
  }

  confirmAction() {
    if (!this.selectedInspection || !this.actionType) return;

    if (this.actionType === 'accept') {
      this.inspectionService.acceptInspection(this.selectedInspection.id!, this.adminNotes)
        .subscribe(result => {
          if (result.success) {
            this.showSuccessNotification(`Inspection request accepted successfully!`);
            this.closeActionModal();
          } else {
            this.showErrorNotification('Failed to accept inspection request');
          }
        });
    } else {
      this.inspectionService.rejectInspection(this.selectedInspection.id!, this.adminNotes)
        .subscribe(result => {
          if (result.success) {
            this.showSuccessNotification(`Inspection request rejected successfully!`);
            this.closeActionModal();
          } else {
            this.showErrorNotification('Failed to reject inspection request');
          }
        });
    }
  }

  closeActionModal() {
    this.showActionModal = false;
    this.selectedInspection = null;
    this.actionType = null;
    this.adminNotes = '';
  }

  openMessageModal(inspection: Inspection) {
    this.selectedInspection = inspection;
    this.adminMessage = '';
    this.showMessageModal = true;
  }

  sendMessage() {
    if (!this.selectedInspection || !this.adminMessage.trim() || !this.currentUser) return;

    this.inspectionService.sendAdminMessage(
      this.selectedInspection.id!,
      this.adminMessage,
      this.currentUser.id!
    ).subscribe(result => {
      if (result.success) {
        this.showSuccessNotification('Message sent to customer successfully!');
        this.closeMessageModal();
      } else {
        this.showErrorNotification('Failed to send message');
      }
    });
  }

  closeMessageModal() {
    this.showMessageModal = false;
    this.selectedInspection = null;
    this.adminMessage = '';
  }

  canAcceptOrReject(inspection: Inspection): boolean {
    return inspection.status === 'pending';
  }

  canEdit(inspection: Inspection): boolean {
    return inspection.status === 'accepted' || inspection.status === 'rejected';
  }

  openEditModal(inspection: Inspection) {
    this.editingInspection = { ...inspection };
    this.adminNotes = inspection.adminNotes || '';
    this.showEditModal = true;
  }

  saveEdit() {
    if (!this.editingInspection) return;

    this.inspectionService.updateInspectionStatus(
      this.editingInspection.id!,
      this.editingInspection.status,
      this.adminNotes
    ).subscribe(result => {
      if (result.success) {
        this.showSuccessNotification('Inspection updated successfully!');
        this.closeEditModal();
      } else {
        this.showErrorNotification('Failed to update inspection');
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingInspection = null;
    this.adminNotes = '';
  }

  showSuccessNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'success';
    this.showNotification = true;
    setTimeout(() => this.hideNotification(), 5000);
  }

  showErrorNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
    setTimeout(() => this.hideNotification(), 5000);
  }

  showInfoNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'info';
    this.showNotification = true;
    setTimeout(() => this.hideNotification(), 5000);
  }

  hideNotification() {
    this.showNotification = false;
  }
}
