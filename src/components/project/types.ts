export interface TimelineEvent {
  id: number;
  time: string;
  end_time: string;
  duration: string;
  title: string;
  description?: string;
  location?: string;
  project_id: number;
  user_id: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  created_at?: string;
  user_id?: string;
  events: TimelineEvent[];
  vendors: Vendor[];
}

export interface Vendor {
  id: number;
  name: string;
  role: string;
  contactNumber: string;
  serviceDetails: string;
  socialMedia?: string;
  address?: string;
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
  category: string;
  category_id: number;  // Added this field
  tableId?: number;
}

export interface GuestCategory {
  id: number;
  name: string;
  created_at?: string;
  user_id?: string;
}

export interface Table {
  id: number;
  name: string;
  created_at: string;
  user_id: string;
}