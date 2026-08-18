import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoanApplication } from '../../models/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="ledger-head">
      <div>
        <span class="eyebrow">Folio No. 003</span>
        <h1>Loan Register</h1>
        <p class="lede">Every application, from first entry to closed account.</p>
      </div>
      <a routerLink="/loans/apply" class="btn btn-brass">+ New Loan Entry</a>
    </div>

    <div class="filter-row">
      @for (f of filters; track f.value) {
        <button
          class="filter-chip"
          [class.filter-chip--active]="activeFilter === f.value"
          (click)="activeFilter = f.value">
          {{ f.label }}
        </button>
      }
    </div>

    @if (loading) {
      <p class="loading-line">Turning the pages…</p>
    } @else if (error) {
      <div class="error-slip">
        <strong>Could not reach the register.</strong>
        <span>{{ error }}</span>
      </div>
    } @else if (filteredLoans.length === 0) {
      <div class="empty-slip">
        <p>No entries under this heading.</p>
        <a routerLink="/loans/apply" class="btn btn-brass">Make the first entry</a>
      </div>
    } @else {
      <div class="entries">
        @for (loan of filteredLoans; track loan.id) {
          <div class="entry-card">
            <div class="entry-top">
              <div>
                <strong class="applicant">{{ loan.customer?.fullName }}</strong>
                <span class="entry-sub">{{ formatType(loan.loanType) }} · {{ loan.tenureInMonths }} months · {{ loan.interestRate }}% p.a.</span>
              </div>
              <span class="stamp" [class]="stampClass(loan.status)">{{ loan.status.replace('_',' ') }}</span>
            </div>

            <div class="entry-figures ruled-paper">
              <div>
                <span class="fig-label">Principal</span>
                <span class="fig-value">₹{{ loan.loanAmount | number:'1.0-0' }}</span>
              </div>
              <div>
                <span class="fig-label">EMI</span>
                <span class="fig-value">₹{{ loan.emiAmount | number:'1.0-0' }}</span>
              </div>
              <div>
                <span class="fig-label">Applied</span>
                <span class="fig-value fig-value--sm">{{ loan.applicationDate }}</span>
              </div>
            </div>

            @if (loan.remarks) {
              <p class="remarks">"{{ loan.remarks }}"</p>
            }

            @if (actionError[loan.id!]) {
              <p class="action-error">{{ actionError[loan.id!] }}</p>
            }

            <div class="entry-actions">
              @if (loan.status === 'PENDING') {
                <button class="stamp-btn stamp-btn--review" (click)="doAction(loan, 'review')" [disabled]="busy[loan.id!]">Move to Review</button>
                <button class="stamp-btn stamp-btn--approve" (click)="doAction(loan, 'approve')" [disabled]="busy[loan.id!]">Approve</button>
                <button class="stamp-btn stamp-btn--reject" (click)="doAction(loan, 'reject')" [disabled]="busy[loan.id!]">Reject</button>
              }
              @if (loan.status === 'UNDER_REVIEW') {
                <button class="stamp-btn stamp-btn--approve" (click)="doAction(loan, 'approve')" [disabled]="busy[loan.id!]">Approve</button>
                <button class="stamp-btn stamp-btn--reject" (click)="doAction(loan, 'reject')" [disabled]="busy[loan.id!]">Reject</button>
              }
              @if (loan.status === 'APPROVED') {
                <button class="stamp-btn stamp-btn--approve" (click)="doAction(loan, 'disburse')" [disabled]="busy[loan.id!]">Disburse</button>
              }
              @if (loan.status === 'DISBURSED') {
                <button class="stamp-btn" (click)="doAction(loan, 'close')" [disabled]="busy[loan.id!]">Close Account</button>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .ledger-head {
      display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;
      margin-bottom: 20px; padding-bottom: 24px; border-bottom: 2px solid var(--ink-navy);
    }
    .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brass); }
    h1 { font-size: 30px; margin-top: 4px; }
    .lede { color: var(--text-ink-soft); margin-top: 6px; }

    .btn { display: inline-block; text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 10px 16px;
      border-radius: var(--radius); border: 1.5px solid var(--brass); color: #211505; background: var(--brass); }

    .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .filter-chip {
      font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.03em;
      padding: 7px 13px; border-radius: 999px; border: 1px solid var(--paper-line);
      background: #fff; color: var(--text-ink-soft);
    }
    .filter-chip--active { background: var(--ink-navy); border-color: var(--ink-navy); color: #fff; }

    .loading-line { font-family: var(--font-mono); color: var(--text-ink-soft); }
    .error-slip { background: #fff; border-left: 4px solid var(--stamp-red); box-shadow: var(--shadow-card); padding: 16px 18px; border-radius: var(--radius); }
    .empty-slip { background: #fff; border: 1px dashed var(--paper-line); border-radius: var(--radius); padding: 32px;
      text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; color: var(--text-ink-soft); }

    .entries { display: flex; flex-direction: column; gap: 14px; }
    .entry-card {
      background: #fff; border: 1px solid var(--paper-line); border-radius: var(--radius);
      box-shadow: var(--shadow-card); padding: 18px 20px;
    }
    .entry-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
    .applicant { font-family: var(--font-display); font-size: 18px; color: var(--ink-navy); display: block; }
    .entry-sub { font-size: 12.5px; color: var(--text-ink-soft); }

    .entry-figures {
      display: flex; gap: 28px; padding: 12px 4px; margin-bottom: 10px;
    }
    .entry-figures > div { display: flex; flex-direction: column; gap: 2px; }
    .fig-label { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-ink-soft); }
    .fig-value { font-family: var(--font-mono); font-size: 16px; color: var(--ink-navy); font-weight: 600; }
    .fig-value--sm { font-size: 13px; font-weight: 400; }

    .remarks { font-style: italic; color: var(--text-ink-soft); font-size: 13.5px; margin: 6px 0 10px; }
    .action-error { color: var(--stamp-red); font-size: 13px; margin: 6px 0; }

    .entry-actions { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 12px; border-top: 1px dashed var(--paper-line); }
    .stamp-btn {
      font-family: var(--font-mono); font-size: 11.5px; font-weight: 600; letter-spacing: 0.04em;
      padding: 7px 14px; border-radius: 999px; border: 1.5px solid var(--ink-navy); background: #fff; color: var(--ink-navy);
      transition: transform 0.12s ease;
    }
    .stamp-btn:hover:not(:disabled) { transform: translateY(-1px); }
    .stamp-btn:disabled { opacity: 0.5; cursor: default; }
    .stamp-btn--approve { border-color: var(--ledger-green); color: var(--ledger-green); }
    .stamp-btn--reject { border-color: var(--stamp-red); color: var(--stamp-red); }
    .stamp-btn--review { border-color: var(--stamp-blue); color: var(--stamp-blue); }
  `],
})
export class LoanListComponent implements OnInit {
  loans: LoanApplication[] = [];
  loading = true;
  error = '';
  busy: Record<number, boolean> = {};
  actionError: Record<number, string> = {};
  activeFilter = 'ALL';

  filters = [
    { value: 'ALL', label: 'All entries' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'UNDER_REVIEW', label: 'Under review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'DISBURSED', label: 'Disbursed' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loanService.getAll().subscribe({
      next: (data) => {
        this.loans = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Unknown error';
        this.loading = false;
      },
    });
  }

  get filteredLoans(): LoanApplication[] {
    const list = this.activeFilter === 'ALL' ? this.loans : this.loans.filter((l) => l.status === this.activeFilter);
    return [...list].reverse();
  }

  doAction(loan: LoanApplication, action: 'review' | 'approve' | 'reject' | 'disburse' | 'close'): void {
    if (!loan.id) return;
    this.busy[loan.id] = true;
    this.actionError[loan.id] = '';

    const call =
      action === 'review' ? this.loanService.moveToReview(loan.id) :
      action === 'approve' ? this.loanService.approve(loan.id) :
      action === 'reject' ? this.loanService.reject(loan.id) :
      action === 'disburse' ? this.loanService.disburse(loan.id) :
      this.loanService.close(loan.id);

    call.subscribe({
      next: (updated) => {
        const idx = this.loans.findIndex((l) => l.id === loan.id);
        if (idx > -1) this.loans[idx] = updated;
        this.busy[loan.id!] = false;
      },
      error: (err) => {
        this.actionError[loan.id!] = err?.error?.message || 'This entry could not be updated.';
        this.busy[loan.id!] = false;
      },
    });
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
