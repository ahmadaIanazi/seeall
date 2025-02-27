import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className='flex min-h-screen flex-col space-y-6'>
      <DashboardNav user={session.user} />
      <main className='container max-w-7xl mx-auto space-y-6 px-4'>{children}</main>
    </div>
  );
}
