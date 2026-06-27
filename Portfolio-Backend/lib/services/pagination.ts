import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { PaginatedResponse, PaginationQuery } from '@/types';

/**
 * Apply pagination and optional full-text search to any Supabase query.
 * Returns a PaginatedResponse.
 */
export async function paginate<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: PostgrestFilterBuilder<any, any, T[]>,
  opts: PaginationQuery,
  searchColumns?: string[]
): Promise<PaginatedResponse<T>> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 10));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Count query (same filters, no range)
  let countQuery = query;

  // Search (case-insensitive OR across searchColumns)
  if (opts.search && searchColumns?.length) {
    const term = `%${opts.search.trim()}%`;
    const filter = searchColumns.map((col) => `${col}.ilike.${term}`).join(',');
    countQuery = countQuery.or(filter);
    query = query.or(filter);
  }

  // Order
  const col = opts.orderBy ?? 'created_at';
  const ascending = opts.order === 'asc';
  query = query.order(col, { ascending });

  // Range (paginate)
  query = query.range(from, to);

  // Execute both queries
  const [{ data, error }, { count, error: countError }] = await Promise.all([
    query,
    countQuery.select('*', { count: 'exact', head: true }),
  ]);

  if (error) throw new Error(error.message);
  if (countError) throw new Error(countError.message);

  const total = count ?? 0;

  return {
    items: (data ?? []) as T[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
