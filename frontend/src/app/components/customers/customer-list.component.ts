import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="ledger-head">
      <div>
        <span class="eyebrow">Folio No. 002</span>
        <h1>Customer Roll</h1>
        <p class="lede">Every account holder registered against this branch.</p>
      </div>
      <a routerLink="/customers/new" class="btn btn-brass">+ New Customer</a>
    </div>

    @if (loading) {
      <p class="loading-line">Turning the pages…</p>
    } @else if (error) {
      <div class="error-slip">
        <strong>Could not reach the register.</strong>
        <span>{{ error }}</span>
      </div>
    } @else if (customers.length === 0) {
      <div class="empty-slip">
        <p>No customers registered yet.</p>
        <a routerLink="/customers/new" class="btn btn-brass">Register the first customer</a>
      </div>
    } @else {
      <div class="ledger-table ruled-paper">
        <div class="ledger-row ledger-row--head">
          <span>Name</span>
          <span>PAN</span>
          <span>Phone</span>
          <span class="num">Monthly income</span>
          <span class="num">Credit score</span>
        </div>
        @for (c of customers; track c.id) {
          <div class="ledger-row">
            <span class="name-cell">
              <strong>{{ c.fullName }}</strong>
              <span class="sub">{{ c.email }}</span>
            </span>
            <span class="mono">{{ c.panNumber }}</span>
            <span class="mono">{{ c.phoneNumber }}</span>
            <span class="num mono">₹{{ c.monthlyIncome | number:'1.0-0' }}</span>
            <span class="num mono">{{ c.creditScore ?? '—' }}</span>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .ledger-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--ink-navy);
    }
    .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brass); }
    h1 { font-size: 30px; margin-top: 4px; }
    .lede { color: var(--text-ink-soft); margin-top: 6px; }

    .btn {
      display: inline-block;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      padding: 10px 16px;
      border-radius: var(--radius);
      border: 1.5px solid var(--brass);
      color: #211505;
      background: var(--brass);
      transition: transform 0.12s ease;
    }
    .btn:hover { transform: translateY(-1px); }

    .loading-line { font-family: var(--font-mono); color: var(--text-ink-soft); }
    .error-slip {
      background: #fff; border-left: 4px solid var(--stamp-red); box-shadow: var(--shadow-card);
      padding: 16px 18px; border-radius: var(--radius);
    }
    .empty-slip {
      background: #fff; border: 1px dashed var(--paper-line); border-radius: var(--radius);
      padding: 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px;
      color: var(--text-ink-soft);
    }

    .ledger-table { background: #fff; border: 1px solid var(--paper-line); border-radius: var(--radius); overflow: hidden; }
    .ledger-row {
      display: grid;
      grid-template-columns: 2fr 1.2fr 1.2fr 1fr 0.8fr;
      gap: 12px;
      padding: 13px 18px;
      align-items: center;
      border-bottom: 1px solid var(--paper-line);
      font-size: 14px;
    }
    .ledger-row:last-child { border-bottom: none; }
    .ledger-row--head {
      font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--text-ink-soft); background: var(--paper);
    }
    .name-cell { display: flex; flex-direction: column; gap: 2px; }
    .name-cell .sub { font-size: 12px; color: var(--text-ink-soft); }
    .num { text-align: right; }
    .mono { font-family: var(--font-mono); font-size: 13px; }

    @media (max-width: 720px) {
      .ledger-row { grid-template-columns: 1.6fr 1fr 1fr; }
      .ledger-row span:nth-child(3), .ledger-row span:nth-child(5) { display: none; }
    }
  `],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Unknown error';
        this.loading = false;
      },
    });
  }
}
