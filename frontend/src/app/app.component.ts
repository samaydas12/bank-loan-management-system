import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="cover">
      <div class="cover-inner">
        <a routerLink="/" class="brand">
          <span class="brand-mark">॥</span>
          <span class="brand-text">
            <span class="brand-title">KHATA</span>
            <span class="brand-sub">Bank Loan Ledger</span>
          </span>
        </a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/customers" routerLinkActive="active">Customers</a>
          <a routerLink="/loans" routerLinkActive="active">Loan Register</a>
          <a routerLink="/emi-calculator" routerLinkActive="active">EMI Calculator</a>
          @if (installPrompt) {
            <button class="install-btn" (click)="installApp()">⬇ Install App</button>
          }
        </nav>
      </div>
      <div class="brass-rule"></div>
    </header>

    <main class="page">
      <router-outlet />
    </main>

    <footer class="ledger-footer">
      <span>Khata — a ledger for customers, loan applications &amp; EMI schedules</span>
    </footer>
  `,
  styles: [`
    .cover {
      background: var(--ink-navy);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .cover-inner {
      max-width: 1080px;
      margin: 0 auto;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--brass-soft);
    }
    .brand-mark {
      font-size: 28px;
      color: var(--brass);
      line-height: 1;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }
    .brand-title {
      font-family: var(--font-display);
      font-size: 21px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #f4efe2;
    }
    .brand-sub {
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--brass-soft);
      opacity: 0.85;
    }
    .nav {
      display: flex;
      gap: 4px;
      align-items: center;
      flex-wrap: wrap;
    }
    .nav a {
      color: #d7dae3;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: var(--radius);
      transition: background 0.15s ease, color 0.15s ease;
    }
    .nav a:hover {
      background: var(--ink-navy-soft);
      color: #fff;
    }
    .nav a.active {
      background: var(--ink-navy-soft);
      color: var(--brass-soft);
    }
    .install-btn {
      font-family: var(--font-mono);
      font-size: 12.5px;
      font-weight: 600;
      color: #211505;
      background: var(--brass);
      border: none;
      border-radius: 999px;
      padding: 8px 15px;
      cursor: pointer;
      margin-left: 4px;
    }
    .install-btn:hover {
      background: #c9a55f;
    }
    .brass-rule {
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--brass) 15%, var(--brass) 85%, transparent);
      opacity: 0.85;
    }
    .page {
      max-width: 1080px;
      margin: 0 auto;
      padding: 32px 24px 64px;
      min-height: calc(100vh - 200px);
    }
    .ledger-footer {
      border-top: 1px solid var(--paper-line);
      padding: 20px 24px 32px;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: var(--text-ink-soft);
      letter-spacing: 0.02em;
    }
  `],
})
export class AppComponent {
  installPrompt: any = null;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: any) {
    event.preventDefault();
    this.installPrompt = event;
  }

  async installApp() {
    if (!this.installPrompt) return;
    this.installPrompt.prompt();
    await this.installPrompt.userChoice;
    this.installPrompt = null;
  }
}
