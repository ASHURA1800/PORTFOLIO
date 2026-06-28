import { NextRequest } from 'next/server';
import { uploadFile, deleteFile, extractPathFromUrl } from '@/lib/storage/upload';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/validation/schemas';
import { ok, err } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ bucket: string }> };

// ── POST /api/storage/:bucket — upload a file ─────────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { bucket } = await params;

  if (!STORAGE_BUCKETS.includes(bucket as StorageBucket)) {
    return err(`Invalid bucket. Must be one of: ${STORAGE_BUCKETS.join(', ')}`, 400);
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return err('Expected multipart/form-data');
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return err('No file provided — include a "file" field in the form data');
  }

  const folder = (formData.get('folder') as string | null) ?? '';

  try {
    const result = await uploadFile(file, bucket as StorageBucket, folder);
    return ok(result, 'File uploaded successfully');
  } catch (e) {
    return err((e as Error).message, 400);
  }
}

// ── DELETE /api/storage/:bucket — delete a file by path or URL ────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (isAuthError(auth)) return auth;

  const { bucket } = await params;

  if (!STORAGE_BUCKETS.includes(bucket as StorageBucket)) {
    return err(`Invalid bucket`, 400);
  }

  const url = new URL(req.url);
  const pathParam = url.searchParams.get('path');
  const urlParam = url.searchParams.get('url');

  if (!pathParam && !urlParam) {
    return err('Provide either ?path= (storage path) or ?url= (public URL)');
  }

  const filePath = pathParam ?? extractPathFromUrl(urlParam!, bucket as StorageBucket);

  try {
    await deleteFile(bucket as StorageBucket, filePath);
    return ok(null, 'File deleted');
  } catch (e) {
    return err((e as Error).message, 400);
  }
}
