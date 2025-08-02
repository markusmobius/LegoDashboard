import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-dropdown">
      <label [for]="dropdownId">{{ label }}:</label>
      <select 
        [id]="dropdownId"
        [value]="selectedValue || ''"
        (change)="onValueChange($event)"
        class="dropdown-select">
        <option *ngFor="let option of options || []" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  `,
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent {
  @Input() label!: string;
  @Input() options: DropdownOption[] | null = [];
  @Input() selectedValue?: string | null;
  @Output() valueChange = new EventEmitter<string>();

  get dropdownId(): string {
    return `dropdown-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}