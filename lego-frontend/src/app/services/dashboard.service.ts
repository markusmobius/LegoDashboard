import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Action {
  Description: string;   
  Republican: number;    
  coverage: number;       
  agreement: number[];    
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