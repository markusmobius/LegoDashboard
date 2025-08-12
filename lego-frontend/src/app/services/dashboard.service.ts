import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Action {
  Description: string;   
  Republican: number;    
  coverage: number;       
  agreement: number[];    
}

export interface PublisherAction {
  Description: string;
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

  getPublisherActions(date: string, publisher: string): Observable<PublisherAction[]> {
    const params = new HttpParams()
      .set('date', date)
      .set('publisher', publisher);
    
    return this.http.get<PublisherAction[]>(`${this.baseUrl}/topactions`, { params });
  }

  // Get all available publishers
  getPublishers(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/publishers`);
  }
}