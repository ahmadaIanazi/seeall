import { DashboardNav } from "@/components/dashboard/nav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className='flex min-h-screen flex-col'>
      <DashboardNav user={session.user} />
      <main className='container mx-auto px-4'>{children}</main>
    </div>
  );
}
