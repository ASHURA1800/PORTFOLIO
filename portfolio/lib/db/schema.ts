import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  date,
  timestamp,
  jsonb,
  index,
  check,
} from 'drizzle-orm/pg-core';

// Note: JS property names are kept snake_case to match the existing API
// contracts, Zod schemas, types/index.ts, and React components — so query
// results need no key remapping anywhere in the app.

// ─── contacts ─────────────────────────────────────────────────
export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_contacts_created_at').on(t.created_at.desc())]
);

// ─── projects ─────────────────────────────────────────────────
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    description: text('description'),
    image: text('image'),
    gradient: text('gradient').notNull().default('from-violet-600 to-blue-600'),
    tech_stack: text('tech_stack').array().notNull().default(sql`'{}'`),
    github_url: text('github_url'),
    live_url: text('live_url'),
    category: text('category'),
    featured: boolean('featured').notNull().default(false),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('idx_projects_featured').on(t.featured),
    index('idx_projects_order').on(t.order_index),
  ]
);

// ─── blogs ────────────────────────────────────────────────────
export const blogs = pgTable(
  'blogs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content'),
    thumbnail: text('thumbnail'),
    gradient: text('gradient').notNull().default('from-violet-600 to-blue-600'),
    tags: text('tags').array().notNull().default(sql`'{}'`),
    read_time: text('read_time'),
    published: boolean('published').notNull().default(false),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // idx_blogs_slug omitted: .unique() above already creates an index on slug
    index('idx_blogs_published').on(t.published),
  ]
);

// ─── certifications ───────────────────────────────────────────
export const certifications = pgTable(
  'certifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    issuer: text('issuer').notNull(),
    image: text('image'),
    icon: text('icon').notNull().default('🏆'),
    issued_date: date('issued_date'),
    expiry_date: date('expiry_date'),
    credential_url: text('credential_url'),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('idx_certifications_order').on(t.order_index)]
);

// ─── testimonials ─────────────────────────────────────────────
export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    feedback: text('feedback').notNull(),
    avatar: text('avatar'),
    avatar_url: text('avatar_url'),
    // notNull() is required here: the CHECK constraint uses SQL comparison
    // which evaluates to NULL (not false) when rating IS NULL, bypassing it.
    rating: integer('rating').notNull().default(5),
    featured: boolean('featured').notNull().default(true),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check('testimonials_rating_check', sql`${t.rating} >= 1 and ${t.rating} <= 5`),
    index('idx_testimonials_order').on(t.order_index),
  ]
);

// ─── analytics ────────────────────────────────────────────────
export const analytics = pgTable(
  'analytics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    event_type: text('event_type').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    referrer: text('referrer'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_analytics_event_type').on(t.event_type),
    index('idx_analytics_created_at').on(t.created_at.desc()),
  ]
);
