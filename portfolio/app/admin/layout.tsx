import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import AdminSidebar from './_components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
