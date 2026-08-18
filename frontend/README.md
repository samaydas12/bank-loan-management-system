# Khata — Bank Loan Ledger (Frontend)

An Angular UI for the Bank Loan Management System backend, styled as an Indian bank passbook / ledger — ruled paper, ledger-row tables, and rubber-stamped loan statuses.

## Tech Stack
- Angular 18 (standalone components, new control-flow syntax)
- Reactive Forms
- Plain CSS design system (no UI framework) — tokens in `src/styles.css`

## Pages
- **Dashboard** (`/`) — ledger overview: totals, pending count, disbursed amount, recent entries
- **Customer Roll** (`/customers`) — all registered customers
- **Open a New Account** (`/customers/new`) — customer registration form
- **Loan Register** (`/loans`) — all loan applications with filter chips and workflow action buttons (Move to Review, Approve, Reject, Disburse, Close)
- **Enter a Loan Application** (`/loans/apply`) — apply for a loan, with a live EMI estimate
- **EMI Calculator** (`/emi-calculator`) — standalone EMI/interest/total-repayment calculator

## Connecting to the backend

The API base URL is set in `src/app/environments/environment.ts`:
```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://bank-loan-management-system-a7ja.onrender.com/api',
};
```
Change this if your backend is deployed elsewhere, or point it to `http://localhost:8080/api` for local development against a locally-running backend.

> The backend's `CorsConfig` allows all origins for `/api/**`, so this frontend can call it from any host during development or after deployment.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & run locally
```bash
cd frontend
npm install
npm start
```
Opens on `http://localhost:4200`.

### Production build
```bash
npm run build
```
Output goes to `dist/bank-loan-management-ui/browser/`.

## Deploying (Render Static Site)
1. Render dashboard → **New +** → **Static Site**
2. Connect this repo, set **Root Directory** to `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist/bank-loan-management-ui/browser`
5. Deploy — Render gives a live `onrender.com` URL

Note: the free-tier backend spins down after inactivity, so the first API call after idle time can take up to a minute.
