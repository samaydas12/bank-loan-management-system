import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface EmiResponse {
  principal: number;
  annualInterestRate: number;
  tenureInMonths: number;
  emiAmount: number;
  totalPayment: number;
  totalInterest: number;
}

@Injectable({ providedIn: 'root' })
export class EmiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/emi`;

  constructor(private http: HttpClient) {}

  calculate(principal: number, annualInterestRate: number, tenureInMonths: number): Observable<EmiResponse> {
    const params = `principal=${principal}&annualInterestRate=${annualInterestRate}&tenureInMonths=${tenureInMonths}`;
    return this.http.get<EmiResponse>(`${this.baseUrl}/calculate?${params}`);
  }
}
