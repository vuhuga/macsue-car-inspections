import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InspectionService } from '../../services/inspection.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  carType = '';
  inspectionType = '';
  priceResult = '';

  constructor(private inspectionService: InspectionService) {}

  calculatePrice() {
    if (this.carType && this.inspectionType) {
      const price = this.inspectionService.getPrice(this.carType, this.inspectionType);
      this.priceResult = `$${price.toFixed(2)}`;
    } else {
      this.priceResult = '';
    }
  }
}
