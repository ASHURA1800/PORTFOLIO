import { createAdminClient } from '@/lib/supabase/admin';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  type StorageBucket,
} from '@/lib/validation/schemas';
import { nanoid } from 'crypto'; // Node 21+; fallback below

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export interface UploadResult {
  url: string;
  path: string;
  bucket: StorageBucket;
}

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL and storage path.
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

  // ── Build path ────────────────────────────────────────────
  const ext = file.name.split('.').pop() ?? 'bin';
  const safeName = `${generateId()}-${Date.now()}.${ext}`;
  const filePath = folder ? `${folder}/${safeName}` : safeName;

  // ── Upload ────────────────────────────────────────────────
  const supabase = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // ── Public URL ────────────────────────────────────────────
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { url: publicUrl, path: filePath, bucket };
}

/** Delete a file from Supabase Storage by its path */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
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
  await deleteFile(bucket, oldPath).catch(() => {
    // Non-fatal: old file may already be gone
  });
  return uploadFile(newFile, bucket, folder);
}

/** Extract the storage path from a Supabase public URL */
export function extractPathFromUrl(
  url: string,
  bucket: StorageBucket
): string {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  return url.slice(idx + marker.length);
}
