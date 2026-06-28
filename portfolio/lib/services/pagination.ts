import type { PaginatedResponse, PaginationQuery } from '@/types';

/**
 * Apply pagination and optional full-text search to any Supabase query builder.
 * Takes an `any` query to avoid the complex generic signature of PostgrestFilterBuilder.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function paginate<T>(query: any, opts: PaginationQuery, searchColumns?: string[]): Promise<PaginatedResponse<T>> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 10));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = query;

  if (opts.search && searchColumns?.length) {
    const term = `%${opts.search.trim()}%`;
    const filter = searchColumns.map((col) => `${col}.ilike.${term}`).join(',');
    q = q.or(filter);
  }

  const col = opts.orderBy ?? 'created_at';
  const ascending = opts.order === 'asc';
  q = q.order(col, { ascending });
  q = q.range(from, to);

  const countQ = query.select('*', { count: 'exact', head: true });

  const [{ data, error }, { count, error: countError }] = await Promise.all([q, countQ]);

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
