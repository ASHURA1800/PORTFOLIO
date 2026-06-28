// ─── Database row types (mirrors Supabase schema) ────────────────────────────

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  gradient: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  category?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  gradient: string;
  tags: string[];
  read_time?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  image?: string;
  icon: string;
  issued_date?: string;
  expiry_date?: string;
  credential_url?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar?: string;
  avatar_url?: string;
  rating: number;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  event_type: AnalyticsEventType;
  metadata: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'project_click'
  | 'resume_download'
  | 'contact_submit'
  | 'blog_view'
  | 'github_click'
  | 'live_url_click';

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
