import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data/user";
import type { Metadata } from "next";
import { LinkList } from "@/components/links/link-list";
import { getSocialIcon } from "@/components/social-icons";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUserByUsername(params.username);
  if (!user) return { title: "Not Found" };

  return {
    title: user.displayName || user.username,
    description: user.bio || `Check out ${user.username}'s links`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const user = await getUserByUsername(params.username);
  if (!user) notFound();

  return (
    <main className='flex min-h-screen flex-col items-center py-8 px-4'>
      <div className='w-full max-w-md space-y-8'>
        {/* Profile Header */}
        <div className='text-center space-y-3'>
          <h1 className='text-2xl font-bold'>{user.displayName || user.username}</h1>
          {user.bio && <p className='text-muted-foreground'>{user.bio}</p>}

          {/* Social Links */}
          {user.socialLinks.length > 0 && (
            <div className='flex justify-center gap-4'>
              {user.socialLinks.map((link) => (
                <a key={link.id} href={link.url} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-primary transition-colors'>
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <LinkList links={user.links} />
      </div>
    </main>
  );
}
