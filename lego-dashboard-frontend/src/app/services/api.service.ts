import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, retry, timeout } from 'rxjs';
import { Action, Publisher, FilterOptions } from '../models/action.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTopActions(filters?: FilterOptions): Observable<Action[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.date) {
        params = params.set('date', filters.date);
      }
      if (filters.publisher) {
        params = params.set('publisher', filters.publisher);
      }
      if (filters.group && filters.group !== 'All') {
        params = params.set('group', filters.group);
      }
    }

    return this.http.get<Action[]>(`${this.baseUrl}/topactions`, { params })
      .pipe(
        timeout(10000),
        retry(2),
        catchError(this.handleError)
      );
  }

  getPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(`${this.baseUrl}/publishers`)
      .pipe(
        timeout(10000),
        retry(2),
        catchError(this.handleError)
      );
  }

  getAvailableDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/dates`)
      .pipe(
        timeout(10000),
        retry(2),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your connection.';
          break;
        case 404:
          errorMessage = 'Requested data not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}