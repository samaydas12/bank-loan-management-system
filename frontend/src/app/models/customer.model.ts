export interface Customer {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  panNumber: string;
  dateOfBirth: string;
  address: string;
  monthlyIncome: number;
  creditScore?: number;
}
