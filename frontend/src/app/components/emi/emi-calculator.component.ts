import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmiService, EmiResponse } from '../../services/emi.service';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="ledger-head">
      <div>
        <span class="eyebrow">Ready reckoner</span>
        <h1>EMI Calculator</h1>
        <p class="lede">Work out the monthly instalment before it goes into the register.</p>
      </div>
    </div>

    <div class="layout">
      <form [formGroup]="form" (ngSubmit)="calculate()" class="slip">
        <label class="field">
          <span>Principal (₹)</span>
          <input type="number" formControlName="principal" placeholder="2500000">
        </label>
        <label class="field">
          <span>Interest rate (% p.a.)</span>
          <input type="number" step="0.1" formControlName="annualInterestRate" placeholder="8.5">
        </label>
        <label class="field">
          <span>Tenure (months)</span>
          <input type="number" formControlName="tenureInMonths" placeholder="240">
        </label>
        <button type="submit" class="btn btn-brass" [disabled]="form.invalid || loading">
          {{ loading ? 'Calculating…' : 'Calculate EMI' }}
        </button>
        @if (error) { <p class="error-text">{{ error }}</p> }
      </form>

      <div class="result-slip ruled-paper">
        @if (!result) {
          <p class="placeholder">Enter the terms on the left and press "Calculate EMI" — the working will appear stamped here.</p>
        } @else {
          <div class="result-row result-row--primary">
            <span>Monthly EMI</span>
            <span class="mono">₹{{ result.emiAmount | number:'1.0-2' }}</span>
          </div>
          <div class="result-row">
            <span>Principal</span>
            <span class="mono">₹{{ result.principal | number:'1.0-0' }}</span>
          </div>
          <div class="result-row">
            <span>Total interest payable</span>
            <span class="mono">₹{{ result.totalInterest | number:'1.0-0' }}</span>
          </div>
          <div class="result-row result-row--total">
            <span>Total repayment</span>
            <span class="mono">₹{{ result.totalPayment | number:'1.0-0' }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ledger-head { margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid var(--ink-navy); }
    .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brass); }
    h1 { font-size: 30px; margin-top: 4px; }
    .lede { color: var(--text-ink-soft); margin-top: 6px; }

    .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }

    .slip { background: #fff; border: 1px solid var(--paper-line); border-radius: var(--radius); box-shadow: var(--shadow-card);
      padding: 26px; display: flex; flex-direction: column; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--ink-navy); }
    .field input {
      font-size: 14px; padding: 10px 12px; border: 1px solid var(--paper-line); border-radius: var(--radius);
      background: var(--paper); color: var(--text-ink); font-weight: 400;
    }
    .field input:focus { outline: none; border-color: var(--brass); background: #fff; }

    .btn { font-size: 13.5px; font-weight: 600; padding: 11px 18px; border-radius: var(--radius);
      border: 1.5px solid var(--brass); color: #211505; background: var(--brass); margin-top: 6px; }
    .btn:disabled { opacity: 0.6; cursor: default; }
    .error-text { color: var(--stamp-red); font-size: 13px; }

    .result-slip {
      background: #fff; border: 1px solid var(--paper-line); border-radius: var(--radius);
      box-shadow: var(--shadow-card); padding: 26px; min-height: 220px;
      display: flex; flex-direction: column; justify-content: center; gap: 14px;
    }
    .placeholder { color: var(--text-ink-soft); font-size: 14px; line-height: 1.6; }

    .result-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; padding: 6px 0; }
    .result-row .mono { font-family: var(--font-mono); }
    .result-row--primary {
      font-family: var(--font-display); font-size: 22px; color: var(--ink-navy); font-weight: 600;
      border-bottom: 1px dashed var(--paper-line); padding-bottom: 14px; margin-bottom: 4px;
    }
    .result-row--primary .mono { font-size: 24px; color: var(--ledger-green); }
    .result-row--total { border-top: 1px solid var(--ink-navy); font-weight: 700; margin-top: 4px; padding-top: 12px; }

    @media (max-width: 720px) { .layout { grid-template-columns: 1fr; } }
  `],
})
export class EmiCalculatorComponent {
  form: FormGroup;
  result: EmiResponse | null = null;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private emiService: EmiService) {
    this.form = this.fb.group({
      principal: [500000, [Validators.required, Validators.min(1)]],
      annualInterestRate: [8.5, [Validators.required, Validators.min(0.1)]],
      tenureInMonths: [120, [Validators.required, Validators.min(1)]],
    });
  }

  calculate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { principal, annualInterestRate, tenureInMonths } = this.form.value;

    this.emiService.calculate(principal, annualInterestRate, tenureInMonths).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Could not calculate. Please try again.';
        this.loading = false;
      },
    });
  }
}
