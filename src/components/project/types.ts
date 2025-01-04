export interface TimelineEvent {
  id: number;
  time: string;
  endTime: string;
  duration: string;
  title: string;
  description?: string;
  category: string;
}

export interface Project {
  id: number;
  name: string;
  events: TimelineEvent[];
  categories: string[];
}