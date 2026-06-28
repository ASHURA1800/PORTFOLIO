import { z } from 'zod';

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(200, 'Email too long'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject too long'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  // Honeypot — bots fill this in, humans don't
  website: z.string().max(0, 'Bot detected').optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  subtitle: z.string().trim().max(300).optional(),
  description: z.string().trim().max(2000).optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  gradient: z.string().trim().default('from-violet-600 to-blue-600'),
  tech_stack: z.array(z.string().trim()).default([]),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  live_url: z.string().url('Invalid live URL').optional().or(z.literal('')),
  category: z.string().trim().max(100).optional(),
  featured: z.boolean().default(false),
  order_index: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const blogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(300),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  gradient: z.string().trim().default('from-violet-600 to-blue-600'),
  tags: z.array(z.string().trim()).default([]),
  read_time: z.string().trim().max(50).optional(),
  published: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogSchema>;

// ─── Certification ────────────────────────────────────────────────────────────

export const certificationSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  issuer: z.string().trim().min(1, 'Issuer is required').max(200),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  icon: z.string().max(10).default('🏆'),
  issued_date: z.string().optional(),
  expiry_date: z.string().optional(),
  credential_url: z.string().url('Invalid credential URL').optional().or(z.literal('')),
  order_index: z.number().int().default(0),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  role: z.string().trim().min(1, 'Role is required').max(200),
  feedback: z.string().trim().min(10, 'Feedback too short').max(2000),
  avatar: z.string().max(10).optional(),
  avatar_url: z
    .string()
    .url('Invalid avatar URL')
    .optional()
    .or(z.literal('')),
  rating: z.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(true),
  order_index: z.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analyticsSchema = z.object({
  event_type: z.enum([
    'page_view',
    'project_click',
    'resume_download',
    'contact_submit',
    'blog_view',
    'github_click',
    'live_url_click',
  ]),
  metadata: z.record(z.string(), z.unknown()).default({}),
  referrer: z.string().max(500).optional(),
});

export type AnalyticsInput = z.infer<typeof analyticsSchema>;

// ─── Pagination query ─────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  orderBy: z.string().trim().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Storage upload ───────────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const STORAGE_BUCKETS = [
  'projects',
  'blogs',
  'certifications',
  'avatars',
  'resume',
] as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[number];
