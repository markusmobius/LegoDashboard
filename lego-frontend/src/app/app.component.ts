import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardService, Action } from './services/dashboard.service';
import { ActionBarsComponent, BarData } from './components/action-bars.component';
import { ActionDetailModalComponent } from './components/action-detail-modal.component';

interface Panel {
  id: string;
  selectedDate: Date | null;
  actions: Action[];
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatDatepickerModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    ActionBarsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  panels = signal<Panel[]>([
    { id: 'panel-1', selectedDate: new Date(), actions: [] }
  ]);

  // Computed signal to determine if split screen is active
  isSplitScreen = computed(() => this.panels().length > 1);

  constructor(
    private dashboardService: DashboardService,
    private dialog: MatDialog
  ) {
    this.loadActions('panel-1');
  }

  // Calculate coverage bar width relative to the highest coverage in the panel
  getCoverageWidth(coverage: number, allActions: Action[]): number {
    if (!allActions || allActions.length === 0) return 0;
    
    const maxCoverage = Math.max(...allActions.map(action => action.coverage));
    return maxCoverage > 0 ? (coverage / maxCoverage) * 100 : 0;
  }

  addPanel(): void {
    if (this.panels().length < 2) {
      // Get the selected date from the first panel
      const currentDate = this.panels()[0].selectedDate;
      
      const newPanel: Panel = {
        id: `panel-2`,
        selectedDate: currentDate,
        actions: []
      };
      
      // Use update to add new panel
      this.panels.update(currentPanels => [...currentPanels, newPanel]);
      this.loadActions('panel-2');
    }
  }

  removePanel(panelId: string): void {
    if (this.panels().length > 1) {
      // Delete the right panel
      this.panels.update(currentPanels => 
        currentPanels.filter(panel => panel.id !== panelId)
      );
      // Reset index to panel-1 for the remaining panel (debug problem of deleting panel-2 causes mulitple deletion)
      const currentDate = this.panels()[0].selectedDate;
      this.panels.update(currentPanels => [{id:'panel-1', selectedDate: currentDate, actions: []}]);
      this.loadActions('panel-1');
    }
  }

  onDateChange(panelId: string, date: Date | null): void {
    // Modify the specific panel
    this.panels.update(currentPanels => 
      currentPanels.map(panel => 
        panel.id === panelId 
          ? { ...panel, selectedDate: date }
          : panel
      )
    );
    
    this.loadActions(panelId);
  }

  private loadActions(panelId: string): void {
    const panel = this.panels().find(p => p.id === panelId);
    if (!panel?.selectedDate) return;

    const dateString = panel.selectedDate.toISOString().split('T')[0];
    
    this.dashboardService.getTopActions(dateString).subscribe({
      next: (actions) => {
        console.log('Received actions:', actions);
        this.panels.update(currentPanels => 
          // Update only the target panel and leaving others unchanged
          currentPanels.map(p => 
            p.id === panelId 
              ? { ...p, actions }
              : p
          )
        );
      },
      error: (error) => {
        console.error('Error loading actions:', error);
      }
    });
  }

  openActionDetail(action: Action): void {
    // For now using mock data for publishers
    const mockPublishers = [
      {
        name: 'Publisher A',
        coverage: action.coverage * 0.8,
        agreement: [action.agreement[0] * 1.1, action.agreement[1] * 0.9, action.agreement[2] * 0.8]
      },
      {
        name: 'Publisher B', 
        coverage: action.coverage * 0.6,
        agreement: [action.agreement[0] * 0.7, action.agreement[1] * 1.2, action.agreement[2] * 1.1]
      },
      {
        name: 'Publisher C',
        coverage: action.coverage * 0.4,
        agreement: [action.agreement[0] * 0.5, action.agreement[1] * 0.8, action.agreement[2] * 1.4]
      }
    ];

    this.dialog.open(ActionDetailModalComponent, {
      data: {
        action: action,
        publishers: mockPublishers
      },
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '80vh'
    });
  }

  getActionBarData(action: Action): BarData {
    return {
      coverage: action.coverage,
      agreement: action.agreement
    };
  }

  getAllActionBarData(actions: Action[]): BarData[] {
    return actions.map(action => this.getActionBarData(action));
  }
}