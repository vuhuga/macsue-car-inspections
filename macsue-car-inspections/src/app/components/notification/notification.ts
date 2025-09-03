import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  template: `
    <div class="alert alert-dismissible fade show" 
         [class.alert-success]="type === 'success'"
         [class.alert-danger]="type === 'error'"
         [class.alert-warning]="type === 'warning'"
         [class.alert-info]="type === 'info'"
         *ngIf="show">
      <i class="fas" 
         [class.fa-check-circle]="type === 'success'"
         [class.fa-exclamation-circle]="type === 'error'"
         [class.fa-exclamation-triangle]="type === 'warning'"
         [class.fa-info-circle]="type === 'info'"></i>
      {{ message }}
      <button type="button" class="btn-close" (click)="close()"></button>
    </div>
  `,
  styles: [`
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1060;
      min-width: 300px;
      max-width: 500px;
    }
    
    .alert i {
      margin-right: 8px;
    }
  `]
})
export class NotificationComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.show = false;
    this.closed.emit();
  }
}