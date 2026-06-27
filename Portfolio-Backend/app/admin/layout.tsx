import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from './_components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar userEmail={user.email!} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
