import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { LoanService } from '../../services/loan.service';
import { Customer } from '../../models/customer.model';
import { LOAN_TYPES } from '../../models/loan.model';

@Component({
  selector: 'app-loan-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="ledger-head">
      <div>
        <span class="eyebrow">New entry</span>
        <h1>Enter a Loan Application</h1>
        <p class="lede">Select the account holder and record the terms sought.</p>
      </div>
    </div>

    @if (loadingCustomers) {
      <p class="loading-line">Fetching customer roll…</p>
    } @else if (customers.length === 0) {
      <div class="empty-slip">
        <p>No customers registered yet. A loan entry needs an account holder first.</p>
        <a routerLink="/customers/new" class="btn btn-brass">Register a customer</a>
      </div>
    } @else {
      <form [formGroup]="form" (ngSubmit)="submit()" class="slip">
        <div class="field-grid">
          <label class="field field--wide">
            <span>Customer</span>
            <select formControlName="customerId">
              <option [ngValue]="null" disabled>Select an account holder</option>
              @for (c of customers; track c.id) {
                <option [ngValue]="c.id">{{ c.fullName }} — {{ c.panNumber }}</option>
              }
            </select>
            @if (isInvalid('customerId')) { <small>Select a customer.</small> }
          </label>

          <label class="field">
            <span>Loan type</span>
            <select formControlName="loanType">
              @for (t of loanTypes; track t.value) {
                <option [value]="t.value">{{ t.label }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span>Loan amount (₹)</span>
            <input type="number" formControlName="loanAmount" placeholder="2500000">
            @if (isInvalid('loanAmount')) { <small>Enter a positive amount.</small> }
          </label>

          <label class="field">
            <span>Interest rate (% p.a.)</span>
            <input type="number" step="0.1" formControlName="interestRate" placeholder="8.5">
            @if (isInvalid('interestRate')) { <small>Enter a positive interest rate.</small> }
          </label>

          <label class="field">
            <span>Tenure (months)</span>
            <input type="number" formControlName="tenureInMonths" placeholder="240">
            @if (isInvalid('tenureInMonths')) { <small>Enter a positive tenure.</small> }
          </label>
        </div>

        @if (estimatedEmi !== null) {
          <div class="emi-preview">
            <span class="fig-label">Estimated EMI</span>
            <span class="fig-value">₹{{ estimatedEmi | number:'1.0-2' }} <span class="fig-note">/ month</span></span>
          </div>
        }

        @if (serverError) {
          <div class="error-slip">{{ serverError }}</div>
        }

        <div class="actions">
          <a routerLink="/loans" class="btn btn-ghost">Cancel</a>
          <button type="submit" class="btn btn-brass" [disabled]="submitting">
            {{ submitting ? 'Recording…' : 'Record Entry' }}
          </button>
        </div>
      </form>
    }
  `,
  styles: [`
    .ledger-head { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid var(--ink-navy); }
    .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brass); }
    h1 { font-size: 30px; margin-top: 4px; }
    .lede { color: var(--text-ink-soft); margin-top: 6px; }
    .loading-line { font-family: var(--font-mono); color: var(--text-ink-soft); }

    .empty-slip { background: #fff; border: 1px dashed var(--paper-line); border-radius: var(--radius); padding: 32px;
      text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; color: var(--text-ink-soft); }

    .slip { background: #fff; border: 1px solid var(--paper-line); border-radius: var(--radius); box-shadow: var(--shadow-card); padding: 28px; }
    .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px; }
    .field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--ink-navy); }
    .field--wide { grid-column: 1 / -1; }
    .field input, .field select {
      font-size: 14px; padding: 10px 12px; border: 1px solid var(--paper-line); border-radius: var(--radius);
      background: var(--paper); color: var(--text-ink); font-weight: 400;
    }
    .field input:focus, .field select:focus { outline: none; border-color: var(--brass); background: #fff; }
    .field small { color: var(--stamp-red); font-weight: 500; }

    .emi-preview {
      margin-top: 20px; padding: 14px 18px; background: var(--paper);
      border: 1px dashed var(--brass); border-radius: var(--radius);
      display: flex; flex-direction: column; gap: 4px;
    }
    .fig-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-ink-soft); }
    .fig-value { font-family: var(--font-mono); font-size: 22px; color: var(--ink-navy); font-weight: 600; }
    .fig-note { font-size: 12px; font-weight: 400; color: var(--text-ink-soft); }

    .error-slip { margin-top: 18px; background: #fdf3f2; border-left: 4px solid var(--stamp-red); color: var(--stamp-red);
      padding: 12px 14px; border-radius: var(--radius); font-size: 13.5px; }

    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px dashed var(--paper-line); }
    .btn { display: inline-block; text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 10px 18px;
      border-radius: var(--radius); border: 1.5px solid var(--ink-navy); cursor: pointer; }
    .btn-ghost { color: var(--ink-navy); background: transparent; }
    .btn-brass { color: #211505; background: var(--brass); border-color: var(--brass); }
    .btn-brass:disabled { opacity: 0.6; cursor: default; }

    @media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
  `],
})
export class LoanApplyComponent implements OnInit {
  form: FormGroup;
  customers: Customer[] = [];
  loadingCustomers = true;
  submitting = false;
  serverError = '';
  loanTypes = LOAN_TYPES;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private loanService: LoanService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      customerId: [null, Validators.required],
      loanType: ['HOME_LOAN', Validators.required],
      loanAmount: [null, [Validators.required, Validators.min(1)]],
      interestRate: [null, [Validators.required, Validators.min(0.1)]],
      tenureInMonths: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.loadingCustomers = false;
      },
      error: () => {
        this.loadingCustomers = false;
      },
    });
  }

  get estimatedEmi(): number | null {
    const { loanAmount, interestRate, tenureInMonths } = this.form.value;
    if (!loanAmount || !interestRate || !tenureInMonths) return null;
    const monthlyRate = interestRate / 12 / 100;
    if (monthlyRate === 0) return loanAmount / tenureInMonths;
    const factor = Math.pow(1 + monthlyRate, tenureInMonths);
    return (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    this.serverError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { customerId, ...rest } = this.form.value;

    this.loanService.apply(customerId, rest).subscribe({
      next: () => this.router.navigate(['/loans']),
      error: (err) => {
        this.serverError = err?.error?.message || 'Could not record this entry. Please check the details and try again.';
        this.submitting = false;
      },
    });
  }
}
