import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-political-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="political-slider">
      <div class="slider-labels">
        <span class="label left">Far Left</span>
        <span class="label center">Center</span>
        <span class="label right">Far Right</span>
      </div>
      <div class="slider-track">
        <div class="track-background"></div>
        <div class="track-fill democrat"></div>
        <div class="track-fill republican"></div>
        <div 
          class="slider-dot" 
          [style.left.%]="dotPosition">
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./political-slider.component.scss']
})
export class PoliticalSliderComponent {
  @Input() republicanScore: number | null = 0;

  get dotPosition(): number {
    // Convert republican score (-1 to 1) to percentage (0 to 100)
    const score = this.republicanScore || 0;
    return ((score + 1) / 2) * 100;
  }
}