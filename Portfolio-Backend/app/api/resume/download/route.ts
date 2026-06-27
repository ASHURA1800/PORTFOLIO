import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { err } from '@/lib/services/response';

/**
 * GET /api/resume/download
 * Serves the resume PDF from Supabase Storage and tracks the download event.
 * Redirects to a signed URL so the file can be public or private.
 */
export async function GET(req: NextRequest) {
  const ip = getIP(req);
  const rl = rateLimit({ key: `resume:${ip}`, limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return err('Too many requests', 429);

  try {
    const supabase = createAdminClient();

    // Generate a signed URL for the resume (valid for 60s)
    const { data, error } = await supabase.storage
      .from('resume')
      .createSignedUrl('resume.pdf', 60);

    if (error || !data?.signedUrl) {
      // Fallback: redirect to public URL if bucket is public
      const { data: publicData } = supabase.storage
        .from('resume')
        .getPublicUrl('resume.pdf');

      if (publicData?.publicUrl) {
        await trackDownload(supabase, ip, req);
        return Response.redirect(publicData.publicUrl, 302);
      }

      return err('Resume not found. Please upload resume.pdf to the resume storage bucket.', 404);
    }

    // Track the download (non-blocking)
    trackDownload(supabase, ip, req).catch(console.error);

    return Response.redirect(data.signedUrl, 302);
  } catch (e) {
    console.error('[Resume Download]', e);
    return err('Failed to process download', 500);
  }
}

async function trackDownload(
  supabase: ReturnType<typeof createAdminClient>,
  ip: string,
  req: NextRequest
) {
  await supabase.from('analytics').insert({
    event_type: 'resume_download',
    metadata: {},
    ip_address: ip,
    user_agent: req.headers.get('user-agent') ?? undefined,
    referrer: req.headers.get('referer') ?? undefined,
  });
}
