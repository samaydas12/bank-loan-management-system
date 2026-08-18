import { Customer } from './customer.model';

export type LoanType =
  | 'HOME_LOAN'
  | 'PERSONAL_LOAN'
  | 'CAR_LOAN'
  | 'EDUCATION_LOAN'
  | 'AGRICULTURE_LOAN'
  | 'BUSINESS_LOAN';

export type LoanStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISBURSED'
  | 'CLOSED';

export interface LoanApplication {
  id?: number;
  customer: Customer;
  loanType: LoanType;
  loanAmount: number;
  interestRate: number;
  tenureInMonths: number;
  status: LoanStatus;
  emiAmount?: number;
  applicationDate?: string;
  approvalDate?: string;
  remarks?: string;
}

export const LOAN_TYPES: { value: LoanType; label: string }[] = [
  { value: 'HOME_LOAN', label: 'Home Loan' },
  { value: 'PERSONAL_LOAN', label: 'Personal Loan' },
  { value: 'CAR_LOAN', label: 'Car Loan' },
  { value: 'EDUCATION_LOAN', label: 'Education Loan' },
  { value: 'AGRICULTURE_LOAN', label: 'Agriculture Loan' },
  { value: 'BUSINESS_LOAN', label: 'Business Loan' },
];
