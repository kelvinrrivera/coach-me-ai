export interface Coach {
  id: string;
  user_id: string;
  goal_id: string;
  assistant_id: string;
  name: string;
  expertise: string[];
  personality: string;
  coaching_style: string;
  created_at: string;
}

export interface CoachMessage {
  id: string;
  coach_id: string;
  content: string;
  role: 'user' | 'coach';
  created_at: string;
}