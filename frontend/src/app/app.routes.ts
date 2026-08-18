import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerListComponent } from './components/customers/customer-list.component';
import { CustomerFormComponent } from './components/customers/customer-form.component';
import { LoanListComponent } from './components/loans/loan-list.component';
import { LoanApplyComponent } from './components/loans/loan-apply.component';
import { EmiCalculatorComponent } from './components/emi/emi-calculator.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'loans', component: LoanListComponent },
  { path: 'loans/apply', component: LoanApplyComponent },
  { path: 'emi-calculator', component: EmiCalculatorComponent },
  { path: '**', redirectTo: '' },
];
