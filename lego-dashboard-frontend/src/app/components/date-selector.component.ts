import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="date-selector">
      <label for="date-picker">Date:</label>
      <select 
        id="date-picker"
        [value]="selectedDate || ''"
        (change)="onDateChange($event)"
        class="date-select">
        <option *ngFor="let date of availableDates$ | async" [value]="date">
          {{ formatDate(date) }}
        </option>
      </select>
    </div>
  `,
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
  @Input() selectedDate?: string | null;
  @Output() dateChange = new EventEmitter<string>();

  availableDates$: Observable<string[]>;

  constructor(private apiService: ApiService) {
    this.availableDates$ = this.apiService.getAvailableDates();
  }

  ngOnInit(): void {}

  onDateChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.dateChange.emit(target.value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}