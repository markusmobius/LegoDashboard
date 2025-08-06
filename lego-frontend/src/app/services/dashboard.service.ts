import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Action {
  Description: string;    // Capitalized to match backend
  Republican: number;     // Backend sends 'Republican' not 'score'
  coverage: number;       // Backend sends 'coverage' not 'coverage_share'
  agreement: number[];    // Backend sends array [support, neutral, oppose]
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTopActions(date: string, filter?: string): Observable<Action[]> {
    let url = `${this.baseUrl}/topactions?date=${date}`;
    if (filter) {
      url += `&group=${filter}`;
    }
    return this.http.get<Action[]>(url);
  }
}