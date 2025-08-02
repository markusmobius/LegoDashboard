import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, map, switchMap, catchError, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Action, FilterOptions, PoliticalGroup, Publisher } from '../models/action.model';
import { DateSelectorComponent } from './date-selector.component';
import { FilterDropdownComponent } from './filter-dropdown.component';
import { PoliticalSliderComponent } from './political-slider.component';
import { ActionListComponent } from './action-list.component';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, DateSelectorComponent, FilterDropdownComponent, PoliticalSliderComponent, ActionListComponent],
  template: `
    <div class="panel-container">
      <div class="panel-header">
        <h2>{{ title }}</h2>
        <div class="panel-controls">
          <app-date-selector 
            [selectedDate]="selectedDate$ | async"
            (dateChange)="onDateChange($event)">
          </app-date-selector>
        </div>
      </div>

      <div class="panel-filters">
        <div class="filter-row">
          <app-filter-dropdown
            label="All Actions"
            [options]="publisherOptions$ | async"
            [selectedValue]="selectedPublisher$ | async"
            (valueChange)="onPublisherChange($event)">
          </app-filter-dropdown>

          <app-filter-dropdown
            label="Political Leaning"
            [options]="politicalOptions"
            [selectedValue]="selectedGroup$ | async"
            (valueChange)="onGroupChange($event)">
          </app-filter-dropdown>
        </div>

        <app-political-slider 
          [republicanScore]="averageRepublicanScore$ | async">
        </app-political-slider>
      </div>

      <div class="panel-content">
        <div class="error-state" *ngIf="error$ | async as error">
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
          <button class="retry-button" (click)="retry()">Retry</button>
        </div>

        <app-action-list 
          [actions]="actions$ | async"
          [loading]="loading$ | async"
          [hidden]="error$ | async">
        </app-action-list>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements OnInit {
  @Input() panelId!: string;
  @Input() title!: string;

  selectedDate$ = new BehaviorSubject<string>('2025-07-26');
  selectedPublisher$ = new BehaviorSubject<string>('');
  selectedGroup$ = new BehaviorSubject<PoliticalGroup>('All');
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  actions$: Observable<Action[]>;
  averageRepublicanScore$: Observable<number>;
  publisherOptions$: Observable<{value: string, label: string}[]>;

  politicalOptions = [
    { value: 'All', label: 'All Publishers' },
    { value: 'Republican', label: 'Republican Publishers' },
    { value: 'Democrat', label: 'Democrat Publishers' }
  ];

  constructor(private apiService: ApiService) {
    const filters$ = combineLatest([
      this.selectedDate$,
      this.selectedPublisher$,
      this.selectedGroup$
    ]).pipe(
      map(([date, publisher, group]) => ({
        date,
        publisher: publisher || undefined,
        group
      } as FilterOptions))
    );

    this.actions$ = filters$.pipe(
      switchMap(filters => {
        this.loading$.next(true);
        this.error$.next(null);
        return this.apiService.getTopActions(filters).pipe(
          catchError(error => {
            this.error$.next(error.message);
            return of([]);
          })
        );
      }),
      map(actions => {
        this.loading$.next(false);
        return actions || [];
      })
    );

    this.averageRepublicanScore$ = this.actions$.pipe(
      map(actions => {
        if (!actions.length) return 0;
        const sum = actions.reduce((acc, action) => acc + action.Republican, 0);
        return sum / actions.length;
      })
    );

    this.publisherOptions$ = this.apiService.getPublishers().pipe(
      map(publishers => [
        { value: '', label: 'All Publishers' },
        ...publishers.map(p => ({ value: p.id, label: p.name }))
      ]),
      catchError(error => {
        console.error('Error loading publishers:', error);
        return of([{ value: '', label: 'All Publishers' }]);
      })
    );
  }

  ngOnInit(): void {
    // Initialize with default filters
  }

  onDateChange(date: string): void {
    this.selectedDate$.next(date);
  }

  onPublisherChange(publisher: string): void {
    this.selectedPublisher$.next(publisher);
  }

  onGroupChange(group: string): void {
    this.selectedGroup$.next(group as PoliticalGroup);
  }

  retry(): void {
    this.error$.next(null);
    // Trigger a refresh by emitting current filter values
    this.selectedDate$.next(this.selectedDate$.value);
  }
}