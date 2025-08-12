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
    const selectedDate = this.panels()[0].selectedDate || new Date();

    this.dialog.open(ActionDetailModalComponent, {
      data: {
        action: action,
        selectedDate: selectedDate
      },
      width: '900px',
      maxWidth: '95vw', 
      maxHeight: '90vh' 
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