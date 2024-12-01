export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  category: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed';
  evidence_url?: string;
  created_at?: string;
}