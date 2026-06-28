import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/session';
import AdminSidebar from '../_components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defence-in-depth: middleware already guards this route group,
  // but we re-verify server-side in case the edge layer is bypassed.
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
