import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";
import { Toolbar } from "@/components/dashboard/toolbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className='flex min-h-screen flex-col'>
      <DashboardNav user={session.user} />
      <Toolbar />
      <main className='container mx-auto px-4'>{children}</main>
    </div>
  );
}
