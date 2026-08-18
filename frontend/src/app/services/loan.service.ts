import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoanApplication, LoanStatus } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly baseUrl = `${environment.apiBaseUrl}/loans`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(this.baseUrl);
  }

  getById(id: number): Observable<LoanApplication> {
    return this.http.get<LoanApplication>(`${this.baseUrl}/${id}`);
  }

  getByStatus(status: LoanStatus): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.baseUrl}/status/${status}`);
  }

  apply(customerId: number, application: Partial<LoanApplication>): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(`${this.baseUrl}/apply/${customerId}`, application);
  }

  moveToReview(id: number): Observable<LoanApplication> {
    return this.http.patch<LoanApplication>(`${this.baseUrl}/${id}/review`, {});
  }

  approve(id: number, remarks?: string): Observable<LoanApplication> {
    return this.http.patch<LoanApplication>(`${this.baseUrl}/${id}/approve`, { remarks });
  }

  reject(id: number, remarks?: string): Observable<LoanApplication> {
    return this.http.patch<LoanApplication>(`${this.baseUrl}/${id}/reject`, { remarks });
  }

  disburse(id: number): Observable<LoanApplication> {
    return this.http.patch<LoanApplication>(`${this.baseUrl}/${id}/disburse`, {});
  }

  close(id: number): Observable<LoanApplication> {
    return this.http.patch<LoanApplication>(`${this.baseUrl}/${id}/close`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
