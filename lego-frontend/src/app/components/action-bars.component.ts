import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface BarData {
  coverage: number;
  agreement: number[];
  label?: string; // For publisher name or other identifier
}

@Component({
  selector: 'app-action-bars',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './action-bars.component.html',
  styleUrl: './action-bars.component.css'
})
export class ActionBarsComponent {
  @Input() data!: BarData;
  @Input() allData: BarData[] = [];
  @Input() scaleToMax: boolean = true; 

  getCoverageWidth(): number {
    if (!this.scaleToMax) {
      // For overall action view, show actual coverage percentage
      return this.data.coverage * 100;
    }

    if (!this.allData || this.allData.length === 0) {
      return this.data.coverage * 100;
    }
    
    const maxCoverage = Math.max(...this.allData.map(item => item.coverage));
    return maxCoverage > 0 ? (this.data.coverage / maxCoverage) * 100 : 0;
  }
}