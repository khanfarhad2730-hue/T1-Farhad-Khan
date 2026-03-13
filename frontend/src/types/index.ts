export interface User {
  id: number;
  email: string;
  name: string;
  photo_url: string;
  is_admin: boolean;
  created_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  question_count: number;
  created_by_name: string;
  created_at: string;
}

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer_index?: number;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface Attempt {
  id: number;
  quiz_id: number;
  quiz_title: string;
  user_email: string;
  answers: Record<string, number>;
  score: number;
  total_questions: number;
  submitted_at: string;
}

export interface AttemptDetail extends Attempt {
  questions: Question[];
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
