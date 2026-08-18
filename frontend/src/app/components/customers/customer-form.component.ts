import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="ledger-head">
      <div>
        <span class="eyebrow">New entry</span>
        <h1>Open a New Account</h1>
        <p class="lede">Record the customer's particulars to begin their folio.</p>
      </div>
    </div>

    <form [formGroup]="form" (ngSubmit)="submit()" class="slip">
      <div class="field-grid">
        <label class="field">
          <span>Full name</span>
          <input type="text" formControlName="fullName" placeholder="e.g. Ananya Bhattacharya">
          @if (isInvalid('fullName')) { <small>Full name is required.</small> }
        </label>

        <label class="field">
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="name@example.com">
          @if (isInvalid('email')) { <small>Enter a valid email.</small> }
        </label>

        <label class="field">
          <span>Phone number</span>
          <input type="tel" formControlName="phoneNumber" placeholder="9876543210">
          @if (isInvalid('phoneNumber')) { <small>Enter a valid 10-digit mobile number.</small> }
        </label>

        <label class="field">
          <span>PAN number</span>
          <input type="text" formControlName="panNumber" placeholder="ABCDE1234F" style="text-transform: uppercase;">
          @if (isInvalid('panNumber')) { <small>Enter a valid PAN (e.g. ABCDE1234F).</small> }
        </label>

        <label class="field">
          <span>Date of birth</span>
          <input type="date" formControlName="dateOfBirth">
          @if (isInvalid('dateOfBirth')) { <small>Date of birth is required.</small> }
        </label>

        <label class="field">
          <span>Monthly income (₹)</span>
          <input type="number" formControlName="monthlyIncome" placeholder="65000">
          @if (isInvalid('monthlyIncome')) { <small>Enter a positive monthly income.</small> }
        </label>

        <label class="field">
          <span>Credit score <em>(optional)</em></span>
          <input type="number" formControlName="creditScore" placeholder="720">
        </label>

        <label class="field field--wide">
          <span>Address</span>
          <textarea formControlName="address" rows="2" placeholder="House, street, city, state, PIN"></textarea>
          @if (isInvalid('address')) { <small>Address is required.</small> }
        </label>
      </div>

      @if (serverError) {
        <div class="error-slip">{{ serverError }}</div>
      }

      <div class="actions">
        <a routerLink="/customers" class="btn btn-ghost">Cancel</a>
        <button type="submit" class="btn btn-brass" [disabled]="submitting">
          {{ submitting ? 'Saving…' : 'Save to Register' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .ledger-head { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid var(--ink-navy); }
    .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brass); }
    h1 { font-size: 30px; margin-top: 4px; }
    .lede { color: var(--text-ink-soft); margin-top: 6px; }

    .slip {
      background: #fff;
      border: 1px solid var(--paper-line);
      border-radius: var(--radius);
      box-shadow: var(--shadow-card);
      padding: 28px;
    }
    .field-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px 20px;
    }
    .field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--ink-navy); }
    .field--wide { grid-column: 1 / -1; }
    .field em { font-weight: 400; color: var(--text-ink-soft); }
    .field input, .field textarea {
      font-size: 14px;
      padding: 10px 12px;
      border: 1px solid var(--paper-line);
      border-radius: var(--radius);
      background: var(--paper);
      color: var(--text-ink);
      font-weight: 400;
    }
    .field input:focus, .field textarea:focus {
      outline: none;
      border-color: var(--brass);
      background: #fff;
    }
    .field small { color: var(--stamp-red); font-weight: 500; }

    .error-slip {
      margin-top: 18px;
      background: #fdf3f2;
      border-left: 4px solid var(--stamp-red);
      color: var(--stamp-red);
      padding: 12px 14px;
      border-radius: var(--radius);
      font-size: 13.5px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px dashed var(--paper-line);
    }
    .btn {
      display: inline-block;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: var(--radius);
      border: 1.5px solid var(--ink-navy);
      cursor: pointer;
    }
    .btn-ghost { color: var(--ink-navy); background: transparent; }
    .btn-brass { color: #211505; background: var(--brass); border-color: var(--brass); }
    .btn-brass:disabled { opacity: 0.6; cursor: default; }

    @media (max-width: 640px) {
      .field-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class CustomerFormComponent {
  form: FormGroup;
  submitting = false;
  serverError = '';

  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      monthlyIncome: [null, [Validators.required, Validators.min(1)]],
      creditScore: [null],
    });
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
    const value = this.form.value;
    value.panNumber = (value.panNumber || '').toUpperCase();

    this.customerService.create(value).subscribe({
      next: () => this.router.navigate(['/customers']),
      error: (err) => {
        this.serverError = err?.error?.message || 'Could not save this entry. Please check the details and try again.';
        this.submitting = false;
      },
    });
  }
}
