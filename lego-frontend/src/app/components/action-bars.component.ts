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
  template: `
    <div class="action-bars">
      <!-- Coverage bar section (1/3 width) -->
      <div class="coverage-section">
        <div 
          class="coverage-bar-container"
          [matTooltip]="'Coverage: ' + (data.coverage | number:'1.2-2')"
          matTooltipPosition="above">
          <div 
            class="coverage-bar"
            [style.width.%]="getCoverageWidth()">
          </div>
        </div>
      </div>
      
      <!-- SNO bar section (2/3 width) -->
      <div class="sno-section">
        <div class="sno-bar-container">
          <!-- Support segment (green) -->
          <div 
            class="sno-segment support"
            [style.width.%]="data.agreement[0] * 100"
            [matTooltip]="'Support: ' + (data.agreement[0] | percent:'1.1-1')"
            matTooltipPosition="above">
          </div>
          <!-- Neutral segment (gray) -->
          <div 
            class="sno-segment neutral"
            [style.width.%]="data.agreement[1] * 100"
            [matTooltip]="'Neutral: ' + (data.agreement[1] | percent:'1.1-1')"
            matTooltipPosition="above">
          </div>
          <!-- Oppose segment (red) -->
          <div 
            class="sno-segment oppose"
            [style.width.%]="data.agreement[2] * 100"
            [matTooltip]="'Oppose: ' + (data.agreement[2] | percent:'1.1-1')"
            matTooltipPosition="above">
          </div>
        </div>
      </div>
    </div>
  `,
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