import { put, del } from '@vercel/blob';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  type StorageBucket,
} from '@/lib/validation/schemas';

// Vercel Blob is a single flat store, so the legacy "bucket" concept is mapped
// to a top-level pathname prefix (e.g. `projects/abc-123.png`). This keeps the
// existing API surface (`/api/storage/:bucket`) and the `UploadResult` contract
// unchanged while swapping Supabase Storage for Vercel Blob underneath.

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export interface UploadResult {
  url: string;
  path: string;
  bucket: StorageBucket;
}

/** Build the blob pathname (`bucket/[folder/]filename`) for a file. */
function buildPath(bucket: StorageBucket, folder: string, fileName: string): string {
  const ext = fileName.split('.').pop() ?? 'bin';
  const safeName = `${generateId()}-${Date.now()}.${ext}`;
  return [bucket, folder, safeName].filter(Boolean).join('/');
}

/**
 * Upload a file to Vercel Blob under the given bucket prefix.
 * Returns the public URL and blob pathname.
 */
export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  folder = ''
): Promise<UploadResult> {
  // ── Validation ────────────────────────────────────────────
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024} MB`);
  }

  // Allow all types for resume bucket (PDF)
  if (bucket !== 'resume' && !ALLOWED_IMAGE_TYPES.includes(file.type as never)) {
    throw new Error(`File type "${file.type}" is not allowed`);
  }

  // ── Upload ────────────────────────────────────────────────
  const pathname = buildPath(bucket, folder, file.name);

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type || undefined,
  });

  return { url: blob.url, path: blob.pathname, bucket };
}

/** Delete a file from Vercel Blob by its pathname or URL. */
export async function deleteFile(pathOrUrl: string): Promise<void> {
  await del(pathOrUrl);
}

/**
 * Replace an existing file — deletes old, uploads new.
 * Returns the new public URL.
 */
export async function replaceFile(
  newFile: File,
  bucket: StorageBucket,
  oldPath: string,
  folder = ''
): Promise<UploadResult> {
  await deleteFile(oldPath).catch(() => {
    // Non-fatal: old file may already be gone
  });
  return uploadFile(newFile, bucket, folder);
}

/** Extract the blob pathname from a Vercel Blob public URL. */
export function extractPathFromUrl(url: string): string {
  try {
    // Blob URLs look like https://<id>.public.blob.vercel-storage.com/<pathname>
    return new URL(url).pathname.replace(/^\/+/, '');
  } catch {
    return url;
  }
}
