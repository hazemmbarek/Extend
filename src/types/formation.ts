export interface Formation {
  id: number;
  title: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  status: 'not_enrolled' | 'pending' | 'in_progress' | 'completed';
  progress: number;
  purchase_date?: string;
  category: string;
  level: string;
  thumbnail_image: string;
  is_enrolled: boolean;
} 