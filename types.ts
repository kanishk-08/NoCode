export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
}

export interface User {
  name: string;
  email: string;
}

export type ViewState = 'landing' | 'auth' | 'dashboard';

export interface ChartDataPoint {
  name: string;
  value: number;
  fullMark?: number;
}