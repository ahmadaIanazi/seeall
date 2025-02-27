import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LinkManager } from "@/components/dashboard/link-manager";
import { getUserLinks } from "@/lib/data/links";
import { ProfileSettings } from "@/components/dashboard/profile-settings";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const links = await getUserLinks(session!.user.id);

  return (
    <div className='flex flex-col items-center min-h-screen p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>@{session!.user.username}</h1>
          <p className='text-sm text-muted-foreground mt-1'>Manage your profile</p>
        </div>
        <div className='space-y-6'>
          <ProfileSettings
            initialData={{
              displayName: session!.user.displayName,
              bio: session!.user.bio,
              socialLinks: session!.user.socialLinks || [],
            }}
          />
          <div className='border-t pt-6'>
            <h2 className='text-lg font-semibold mb-4'>Your Links</h2>
            <LinkManager initialLinks={links} userId={session!.user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
