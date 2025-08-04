import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Panel {
  id: string;
  selectedDate: Date | null;
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
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  panels = signal<Panel[]>([
    { id: 'panel-1', selectedDate: new Date() }
  ]);

  // Computed signal to determine if split screen is active
  isSplitScreen = computed(() => this.panels().length > 1);

  addPanel(): void {
    if (this.panels().length < 2) {
      // Get the selected date from the first panel
      const currentDate = this.panels()[0].selectedDate;
      
      const newPanel: Panel = {
        id: `panel-2`,
        selectedDate: currentDate // Copy the date from the first panel
      };
      
      // Use update to add new panel
      this.panels.update(currentPanels => [...currentPanels, newPanel]);
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
      this.panels.update(currentPanels => [{id:'panel-1', selectedDate: currentDate}]);
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
  }
}