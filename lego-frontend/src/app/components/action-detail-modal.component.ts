import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActionBarsComponent, BarData } from './action-bars.component';
import { Action, DashboardService, PublisherAction } from '../services/dashboard.service';
import { forkJoin } from 'rxjs';

export interface ActionDetailData {
  action: Action;
  selectedDate: Date;
}

interface PublisherData {
  name: string;
  coverage: number;
  agreement: number[];
}

@Component({
  selector: 'app-action-detail-modal',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    ActionBarsComponent
  ],
  template: `
    <div class="action-detail-modal">
      <mat-dialog-content>
        <!-- Action Title -->
        <div class="action-title">
          <h2>{{ data.action.Description }}</h2>
        </div>

        <!-- Overall Action Bars -->
        <div class="overall-section">
          <h3>Overall</h3>
          <app-action-bars 
            [data]="getOverallBarData()" 
            [allData]="[]"
            [scaleToMax]="false">
          </app-action-bars>
        </div>

        <!-- Loading State -->
        <div class="loading-section" *ngIf="loading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading publisher data...</p>
        </div>

        <!-- Publishers Section -->
        <div class="publishers-section" *ngIf="!loading && publisherData.length > 0">
          <h3>By Publisher</h3>
          
          <div class="publisher-item" *ngFor="let publisher of publisherData">
            <div class="publisher-name">{{ publisher.name }}</div>
            <app-action-bars 
              [data]="getPublisherBarData(publisher)" 
              [allData]="getAllPublisherBarData()"
              [scaleToMax]="true">
            </app-action-bars>
          </div>
        </div>

        <!-- No Publisher Data Message -->
        <div class="no-data-message" *ngIf="!loading && publisherData.length === 0">
          <p>No detailed publisher data available for this action.</p>
        </div>

        <!-- Error Message -->
        <div class="error-message" *ngIf="error">
          <p>Error loading publisher data: {{ error }}</p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrl: './action-detail-modal.component.css'
})
export class ActionDetailModalComponent implements OnInit {
  publisherData: PublisherData[] = [];
  loading = true;
  error: string | null = null;

  // List of publishers to check (you can make this dynamic)
  private publishers = [
    'pub_dem_0',
    'pub_dem_1', 
    'pub_dem_2',
    'pub_rep_0',
    'pub_rep_1',
    'pub_rep_2'
  ];

  constructor(
    public dialogRef: MatDialogRef<ActionDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionDetailData,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadPublisherData();
  }

  private loadPublisherData(): void {
    // TO FIX: Real API call that was causing loading issues
    /*
    const dateString = this.data.selectedDate.toISOString().split('T')[0];
    
    // Create requests for all publishers
    const publisherRequests = this.publishers.map(publisher =>
      this.dashboardService.getPublisherActions(dateString, publisher)
    );

    forkJoin(publisherRequests).subscribe({
      next: (results) => {
        this.publisherData = [];
        
        results.forEach((actions, index) => {
          const publisherName = this.publishers[index];
          // Find the matching action by description
          const matchingAction = actions.find(
            action => action.Description === this.data.action.Description
          );
          
          if (matchingAction) {
            this.publisherData.push({
              name: this.formatPublisherName(publisherName),
              coverage: matchingAction.coverage,
              agreement: matchingAction.agreement
            });
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading publisher data:', error);
        this.error = 'Failed to load publisher data';
        this.loading = false;
      }
    });
    */

    // MOCK DATA: placeholder publisher data based on the overall action
    setTimeout(() => {
      this.publisherData = [
        {
          name: 'Democratic Publisher 1',
          coverage: this.data.action.coverage * 0.8,
          agreement: [
            this.data.action.agreement[0] * 1.2, // Higher support
            this.data.action.agreement[1] * 0.7, // Lower neutral
            this.data.action.agreement[2] * 0.6  // Lower oppose
          ]
        },
        {
          name: 'Democratic Publisher 2',
          coverage: this.data.action.coverage * 0.6,
          agreement: [
            this.data.action.agreement[0] * 1.1,
            this.data.action.agreement[1] * 0.9,
            this.data.action.agreement[2] * 0.8
          ]
        },
        {
          name: 'Democratic Publisher 3',
          coverage: this.data.action.coverage * 0.4,
          agreement: [
            this.data.action.agreement[0] * 1.3,
            this.data.action.agreement[1] * 0.6,
            this.data.action.agreement[2] * 0.5
          ]
        },
        {
          name: 'Republican Publisher 1',
          coverage: this.data.action.coverage * 0.7,
          agreement: [
            this.data.action.agreement[0] * 0.5, // Lower support
            this.data.action.agreement[1] * 1.1, // Higher neutral
            this.data.action.agreement[2] * 1.4  // Higher oppose
          ]
        },
        {
          name: 'Republican Publisher 2',
          coverage: this.data.action.coverage * 0.5,
          agreement: [
            this.data.action.agreement[0] * 0.6,
            this.data.action.agreement[1] * 1.2,
            this.data.action.agreement[2] * 1.3
          ]
        },
        {
          name: 'Republican Publisher 3',
          coverage: this.data.action.coverage * 0.3,
          agreement: [
            this.data.action.agreement[0] * 0.4,
            this.data.action.agreement[1] * 0.8,
            this.data.action.agreement[2] * 1.5
          ]
        }
      ];

      // Normalize agreement values to ensure they sum to reasonable values
      this.publisherData.forEach(publisher => {
        const total = publisher.agreement[0] + publisher.agreement[1] + publisher.agreement[2];
        if (total > 0) {
          publisher.agreement = publisher.agreement.map(val => Math.min(val / total, 1));
        }
      });

      this.loading = false;
    }, 500);
  }

  private formatPublisherName(publisherId: string): string {
    // Convert pub_dem_0 to "Democratic Publisher 1" etc.
    const parts = publisherId.split('_');
    if (parts.length === 3) {
      const party = parts[1] === 'dem' ? 'Democratic' : 'Republican';
      const number = parseInt(parts[2]) + 1;
      return `${party} Publisher ${number}`;
    }
    return publisherId;
  }

  close(): void {
    this.dialogRef.close();
  }

  getOverallBarData(): BarData {
    return {
      coverage: this.data.action.coverage,
      agreement: this.data.action.agreement,
      label: 'Overall'
    };
  }

  getPublisherBarData(publisher: PublisherData): BarData {
    return {
      coverage: publisher.coverage,
      agreement: publisher.agreement,
      label: publisher.name
    };
  }

  getAllPublisherBarData(): BarData[] {
    return this.publisherData.map(pub => this.getPublisherBarData(pub));
  }
}