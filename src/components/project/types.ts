export interface TimelineEvent {
  id: number;
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  location?: string;
}

export interface Project {
  id: number;
  name: string;
  events: TimelineEvent[];
  vendors: Vendor[];
}

export interface Vendor {
  id: number;
  name: string;
  role: string;
  contactNumber: string;
  serviceDetails: string;
}

export interface BudgetItem {
  id: number;
  category: string;
  title: string;
  amount: number;
}

export interface BudgetCategory {
  id: number;
  name: string;
  items: BudgetItem[];
}

export interface Guest {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  dietaryRestrictions?: string;
  tableId?: number;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  guests: Guest[];
}