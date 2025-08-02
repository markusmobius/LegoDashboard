import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPanelComponent } from './components/dashboard-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardPanelComponent],
  template: `
    <div class="app-container">
      <nav class="top-nav">
        <div class="nav-tabs">
          <button class="nav-tab active">RATIO</button>
          <button class="nav-tab">MSN</button>
          <button class="nav-tab">BING</button>
          <button class="nav-tab">ALL</button>
        </div>
        <div class="nav-actions">
          <button class="split-screen-toggle" (click)="toggleSplitScreen()">
            {{ isSplitScreen ? 'Single View' : 'Split View' }}
          </button>
        </div>
      </nav>

      <div class="dashboard-container" [class.split-screen]="isSplitScreen">
        <div class="panel" [class.left-panel]="isSplitScreen">
          <app-dashboard-panel 
            [panelId]="'left'"
            [title]="isSplitScreen ? 'All Publishers' : 'Dashboard'">
          </app-dashboard-panel>
        </div>
        
        <div class="panel right-panel" *ngIf="isSplitScreen">
          <app-dashboard-panel 
            [panelId]="'right'"
            [title]="'Filtered View'">
          </app-dashboard-panel>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSplitScreen = false;

  toggleSplitScreen(): void {
    this.isSplitScreen = !this.isSplitScreen;
  }
}