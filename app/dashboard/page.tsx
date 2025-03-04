import { PageContentManager } from "@/components/dashboard/page-content-manager";
import PageFooterManager from "@/components/dashboard/page-footer-manager";
import { PageHeaderManager } from "@/components/dashboard/page-header-manager";
import { PageLoading } from "@/components/dashboard/page-loading";
import { PageToolbar } from "@/components/dashboard/toolbar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  // Fetch Page data instead of User
  const page = await db.page.findUnique({
    where: { userId: session.user.id },
  });

  console.log("PAGE ITEMS:", page);
  if (!page) return null;

  return (
    <div className='flex min-h-screen flex-col'>
      <PageLoading pageId={page.id} />
      <PageToolbar pageId={page.id} />
      <main className='flex-1 container py-8 px-4 space-y-4 sm:px-8'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-muted-foreground'>seeall.info/</span>
          <span className='text-xs font-medium'>{session.user.username}</span>
        </div>
        <PageHeaderManager pageId={page.id} />
        <PageContentManager pageId={page.id} />
        <PageFooterManager pageId={page.id} />
      </main>
    </div>
  );
}
