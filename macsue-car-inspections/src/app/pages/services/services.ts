import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InspectionService } from '../../services/inspection.service';
import { PriceInfo } from '../../models/inspection.model';

@Component({
  selector: 'app-services',
  imports: [CommonModule, RouterModule],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services implements OnInit {
  prices: PriceInfo[] = [];

  constructor(private inspectionService: InspectionService) {}

  ngOnInit() {
    this.inspectionService.getAllPrices().subscribe(prices => {
      this.prices = prices;
    });
  }

  getPricesByType(inspectionType: string): PriceInfo[] {
    return this.prices.filter(p => p.inspectionType === inspectionType);
  }
}
