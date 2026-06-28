import { z } from 'zod';

// ─── Shared helpers ───────────────────────────────────────────────────────────

// Accepts a valid URL or an empty string (clear intent from admin UI).
// Transforms "" → null so the DB stores NULL, not an empty string.
const optionalUrl = (msg: string) =>
  z.string().url(msg).or(z.literal('')).optional().transform((v) => (v === '' ? null : v));

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
  image: optionalUrl('Invalid image URL'),
  gradient: z.string().trim().max(200).default('from-violet-600 to-blue-600'),
  // Per-item cap prevents oversized tag strings; array cap bounds total storage
  tech_stack: z.array(z.string().trim().max(100)).max(50).default([]),
  github_url: optionalUrl('Invalid GitHub URL'),
  live_url: optionalUrl('Invalid live URL'),
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
  // Unbounded content is a DoS vector — 200k chars is generous for any blog post
  content: z.string().max(200_000).optional(),
  thumbnail: optionalUrl('Invalid thumbnail URL'),
  gradient: z.string().trim().max(200).default('from-violet-600 to-blue-600'),
  tags: z.array(z.string().trim().max(100)).max(50).default([]),
  read_time: z.string().trim().max(50).optional(),
  published: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogSchema>;

// ─── Certification ────────────────────────────────────────────────────────────

export const certificationSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  issuer: z.string().trim().min(1, 'Issuer is required').max(200),
  image: optionalUrl('Invalid image URL'),
  icon: z.string().max(10).default('🏆'),
  // Require ISO 8601 (YYYY-MM-DD) so Postgres date columns never see garbage input
  issued_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  credential_url: optionalUrl('Invalid credential URL'),
  order_index: z.number().int().default(0),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  role: z.string().trim().min(1, 'Role is required').max(200),
  feedback: z.string().trim().min(10, 'Feedback too short').max(2000),
  avatar: z.string().max(10).optional(),
  avatar_url: optionalUrl('Invalid avatar URL'),
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
  // Public endpoint: cap key count and key length to limit payload abuse
  metadata: z
    .record(z.string().max(100), z.unknown())
    .refine((m) => Object.keys(m).length <= 20, 'Too many metadata keys')
    .default({}),
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
  // SVG intentionally excluded: SVG files can contain <script> tags and event
  // handlers that execute in-browser when served directly or embedded, creating
  // a stored XSS vector.
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
