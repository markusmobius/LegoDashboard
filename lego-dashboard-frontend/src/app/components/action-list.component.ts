import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action } from '../models/action.model';

@Component({
  selector: 'app-action-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-list">
      <div class="list-header">
        <h3>Actions</h3>
        <div class="action-count" *ngIf="actions && actions.length">
          {{ actions.length }} actions
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="loading-spinner"></div>
        <span>Loading actions...</span>
      </div>

      <div class="empty-state" *ngIf="!loading && (!actions || actions.length === 0)">
        <p>No actions found for the selected filters.</p>
      </div>

      <div class="action-items" *ngIf="!loading && actions && actions.length > 0">
        <div 
          class="action-item" 
          *ngFor="let action of actions; trackBy: trackByActionId"
          [class.republican-leaning]="action.Republican > 0"
          [class.democrat-leaning]="action.Republican < 0">
          
          <div class="action-content">
            <div class="action-title">
              {{ action.Description }}
            </div>
            
            <div class="action-meta">
              <div class="coverage-container">
                <div class="coverage-bar">
                  <div 
                    class="coverage-fill" 
                    [style.width.%]="getCoveragePercentage(action)">
                  </div>
                </div>
                <div class="coverage-value">
                  {{ getCoverageDisplay(action) }}
                </div>
              </div>
              
              <div class="political-indicator">
                <span class="political-score" [class]="getPoliticalClass(action)">
                  {{ getPoliticalLabel(action) }}
                </span>
              </div>
            </div>

            <div class="agreement-breakdown" *ngIf="action.agreement">
              <div class="agreement-item supporting">
                <span class="label">Supporting:</span>
                <span class="value">{{ action.agreement[0] }}</span>
              </div>
              <div class="agreement-item opposing">
                <span class="label">Opposing:</span>
                <span class="value">{{ action.agreement[1] }}</span>
              </div>
              <div class="agreement-item neutral">
                <span class="label">Neutral:</span>
                <span class="value">{{ action.agreement[2] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent {
  @Input() actions: Action[] | null = null;
  @Input() loading: boolean | null = false;

  trackByActionId(index: number, action: Action): string {
    return action.Description + index;
  }

  getCoveragePercentage(action: Action): number {
    // Normalize coverage to 0-100% range
    const maxCoverage = Math.max(...(this.actions || []).map(a => a.coverage));
    return maxCoverage > 0 ? (action.coverage / maxCoverage) * 100 : 0;
  }

  getCoverageDisplay(action: Action): string {
    // Multiply by 1000 as per requirements
    return Math.round(action.coverage * 1000).toString();
  }

  getPoliticalClass(action: Action): string {
    if (action.Republican > 0.2) return 'republican';
    if (action.Republican < -0.2) return 'democrat';
    return 'center';
  }

  getPoliticalLabel(action: Action): string {
    if (action.Republican > 0.2) return 'R';
    if (action.Republican < -0.2) return 'D';
    return 'C';
  }
}