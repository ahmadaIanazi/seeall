import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data/user";
import { getUserLinks } from "@/lib/data/links";
import { LinkList } from "@/components/links/link-list";
import { Metadata } from "next";
import { getSocialIcon } from "@/components/social-icons";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUserByUsername(params.username);
  if (!user) return { title: "Not Found" };

  return {
    title: user.displayName ? `${user.displayName} (@${user.username})` : `@${user.username}`,
    description: user.bio || `Check out ${user.username}'s links on SeeAll.info`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const user = await getUserByUsername(params.username);
  if (!user) notFound();

  const links = await getUserLinks(user.id);

  return (
    <div className='flex flex-col items-center min-h-screen p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center space-y-3'>
          <h1 className='text-2xl font-bold'>{user.displayName || `@${user.username}`}</h1>
          {user.displayName && <p className='text-muted-foreground'>@{user.username}</p>}
          {user.bio && <p className='text-muted-foreground'>{user.bio}</p>}

          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className='flex justify-center gap-4 pt-2'>
              {user.socialLinks.map((link) => (
                <a key={link.id} href={link.url} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-foreground transition-colors'>
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
        <LinkList links={links} />
      </div>
    </div>
  );
}
