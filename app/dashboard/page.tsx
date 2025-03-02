import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LinkManager } from "@/components/dashboard/link-manager";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  // Fetch complete user data including links and social links
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      links: {
        orderBy: { order: "asc" },
      },
      socialLinks: true,
    },
  });

  if (!user) return null;

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1 container py-8 px-4 space-y-4 sm:px-8'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-muted-foreground'>seeall.info/</span>
          <span className='text-xs font-medium'>{session.user.username}</span>
        </div>

        <ProfileSettings
          initialData={{
            displayName: user.displayName || "",
            bio: user.bio || "",
            socialLinks: user.socialLinks,
          }}
        />
        <LinkManager initialLinks={user.links} userId={user.id} />
      </main>
    </div>
  );
}
