import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { LoanService } from '../../services/loan.service';
import { Customer } from '../../models/customer.model';
import { LoanApplication } from '../../models/loan.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="ledger-head">
      <div>
        <span class="eyebrow">Folio No. 001</span>
        <h1>The Register</h1>
        <p class="lede">A running account of every customer and loan passing through the books.</p>
      </div>
      <div class="head-actions">
        <a routerLink="/customers/new" class="btn btn-ghost">+ New Customer</a>
        <a routerLink="/loans/apply" class="btn btn-brass">+ New Loan Entry</a>
      </div>
    </div>

    @if (loading) {
      <p class="loading-line">Opening the ledger…</p>
    } @else if (error) {
      <div class="error-slip">
        <strong>Could not reach the register.</strong>
        <span>{{ error }}</span>
        <span class="hint">The free server sleeps after inactivity — the first request can take up to a minute. Try again shortly.</span>
      </div>
    } @else {
      <section class="stat-row">
        <div class="stat-card">
          <span class="stat-label">Customers on file</span>
          <span class="stat-value">{{ customers.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Loan entries</span>
          <span class="stat-value">{{ loans.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Awaiting decision</span>
          <span class="stat-value">{{ pendingCount }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Disbursed, total</span>
          <span class="stat-value stat-value--mono">₹{{ disbursedTotal | number:'1.0-0' }}</span>
        </div>
      </section>

      <section class="recent">
        <h2>Latest entries</h2>
        @if (loans.length === 0) {
          <div class="empty-slip">
            <p>The ledger is empty. Every account begins with its first entry.</p>
            <a routerLink="/customers/new" class="btn btn-brass">Register the first customer</a>
          </div>
        } @else {
          <div class="ledger-table ruled-paper">
            <div class="ledger-row ledger-row--head">
              <span>Applicant</span>
              <span>Loan type</span>
              <span class="num">Amount</span>
              <span>Status</span>
            </div>
            @for (loan of recentLoans; track loan.id) {
              <div class="ledger-row">
                <span>{{ loan.customer?.fullName }}</span>
                <span class="muted">{{ formatType(loan.loanType) }}</span>
                <span class="num mono">₹{{ loan.loanAmount | number:'1.0-0' }}</span>
                <span><span class="stamp" [class]="stampClass(loan.status)">{{ loan.status }}</span></span>
              </div>
            }
          </div>
          <a routerLink="/loans" class="see-all">See the full register →</a>
        }
      </section>
    }
  `,
  styles: [`
    .ledger-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--ink-navy);
    }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--brass);
    }
    h1 { font-size: 34px; margin-top: 4px; }
    .lede { color: var(--text-ink-soft); margin-top: 6px; max-width: 46ch; }
    .head-actions { display: flex; gap: 10px; }

    .btn {
      display: inline-block;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      padding: 10px 16px;
      border-radius: var(--radius);
      border: 1.5px solid var(--ink-navy);
      transition: transform 0.12s ease, background 0.12s ease;
    }
    .btn:hover { transform: translateY(-1px); }
    .btn-ghost { color: var(--ink-navy); background: transparent; }
    .btn-ghost:hover { background: rgba(16,27,45,0.06); }
    .btn-brass { color: #211505; background: var(--brass); border-color: var(--brass); }
    .btn-brass:hover { background: #9c7a3f; }

    .loading-line { font-family: var(--font-mono); color: var(--text-ink-soft); }

    .error-slip {
      background: #fff;
      border-left: 4px solid var(--stamp-red);
      box-shadow: var(--shadow-card);
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-radius: var(--radius);
    }
    .error-slip .hint { color: var(--text-ink-soft); font-size: 13px; margin-top: 4px; }

    .stat-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: #fff;
      border: 1px solid var(--paper-line);
      border-top: 3px solid var(--brass);
      border-radius: var(--radius);
      padding: 16px 18px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .stat-label {
      font-size: 11.5px;
      color: var(--text-ink-soft);
      letter-spacing: 0.02em;
    }
    .stat-value {
      font-family: var(--font-display);
      font-size: 28px;
      color: var(--ink-navy);
    }
    .stat-value--mono { font-family: var(--font-mono); font-size: 22px; }

    .recent h2 {
      font-size: 19px;
      margin-bottom: 14px;
    }
    .empty-slip {
      background: #fff;
      border: 1px dashed var(--paper-line);
      border-radius: var(--radius);
      padding: 32px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      color: var(--text-ink-soft);
    }

    .ledger-table {
      background: #fff;
      border: 1px solid var(--paper-line);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .ledger-row {
      display: grid;
      grid-template-columns: 2fr 1.4fr 1fr 1fr;
      gap: 12px;
      padding: 13px 18px;
      align-items: center;
      border-bottom: 1px solid var(--paper-line);
      font-size: 14px;
    }
    .ledger-row:last-child { border-bottom: none; }
    .ledger-row--head {
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-ink-soft);
      background: var(--paper);
    }
    .num { text-align: right; }
    .mono { font-family: var(--font-mono); }
    .muted { color: var(--text-ink-soft); }

    .see-all {
      display: inline-block;
      margin-top: 12px;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--stamp-blue);
      text-decoration: none;
    }
    .see-all:hover { text-decoration: underline; }

    @media (max-width: 720px) {
      .stat-row { grid-template-columns: repeat(2, 1fr); }
      .ledger-row { grid-template-columns: 1.6fr 1fr 1fr; }
      .ledger-row span:nth-child(2) { display: none; }
      .ledger-row--head span:nth-child(2) { display: none; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  customers: Customer[] = [];
  loans: LoanApplication[] = [];
  loading = true;
  error = '';

  constructor(private customerService: CustomerService, private loanService: LoanService) {}

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll(),
      loans: this.loanService.getAll(),
    }).subscribe({
      next: ({ customers, loans }) => {
        this.customers = customers;
        this.loans = loans;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Unknown error';
        this.loading = false;
      },
    });
  }

  get pendingCount(): number {
    return this.loans.filter((l) => l.status === 'PENDING' || l.status === 'UNDER_REVIEW').length;
  }

  get disbursedTotal(): number {
    return this.loans
      .filter((l) => l.status === 'DISBURSED' || l.status === 'CLOSED')
      .reduce((sum, l) => sum + (l.loanAmount || 0), 0);
  }

  get recentLoans(): LoanApplication[] {
    return [...this.loans].reverse().slice(0, 6);
  }

  formatType(type: string): string {
    return type?.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  stampClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'stamp--pending',
      UNDER_REVIEW: 'stamp--review',
      APPROVED: 'stamp--approved',
      REJECTED: 'stamp--rejected',
      DISBURSED: 'stamp--disbursed',
      CLOSED: 'stamp--closed',
    };
    return map[status] || 'stamp--pending';
  }
}
