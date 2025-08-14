import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActionBarsComponent, BarData } from './action-bars.component';
import { Action, DashboardService, ActionDetailResponse } from '../services/dashboard.service';

export interface ActionDetailData {
  action: Action;
  selectedDate: Date;
}

interface PublisherData {
  id: string;
  name: string;
  leaning: string;
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
  templateUrl: './action-detail-modal.component.html',
  styleUrl: './action-detail-modal.component.css'
})
export class ActionDetailModalComponent implements OnInit {
  publisherData: PublisherData[] = [];
  loading = true;
  error: string | null = null;
  
  // Make Math accessible in template
  Math = Math;

  constructor(
    public dialogRef: MatDialogRef<ActionDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionDetailData,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadPublisherData();
  }

  private loadPublisherData(): void {
    const dateString = this.data.selectedDate.toISOString().split('T')[0];
    const actionId = this.data.action.id;

    this.dashboardService.getActionDetails(dateString, actionId).subscribe({
      next: (response: ActionDetailResponse) => {
        this.publisherData = response.publishers.map(pub => ({
          id: pub.id,
          name: pub.name,
          leaning: pub.leaning,
          coverage: pub.coverage,
          agreement: pub.agreement
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading publisher data:', error);
        this.error = 'Failed to load publisher data';
        this.loading = false;
      }
    });
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