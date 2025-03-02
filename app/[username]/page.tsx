import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data/user";
import type { Metadata } from "next";
import { LinkList } from "@/components/links/link-list";
import { getSocialIcon } from "@/components/social-icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  const alignment = user.page?.controls?.alignment || "center";

  return (
    <div className='min-h-screen py-12 px-4'>
      <div className='max-w-xl mx-auto space-y-8'>
        {/* Profile Image */}
        {user.profileImage && (
          <div className='flex justify-center'>
            <div className='relative w-32 h-32'>
              <Image src={user.profileImage} alt={user.displayName || user.username} fill className='rounded-full object-cover' sizes='(max-width: 128px) 100vw, 128px' priority />
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div
          className={cn("space-y-4", {
            "text-left": alignment === "left",
            "text-center": alignment === "center",
            "text-right": alignment === "right",
          })}
        >
          <h1 className='text-2xl font-bold'>{user.displayName || user.username}</h1>
          {user.bio && <p className='text-muted-foreground'>{user.bio}</p>}

          {/* Social Links */}
          {user.socialLinks.length > 0 && (
            <div
              className={cn("flex gap-4", {
                "justify-start": alignment === "left",
                "justify-center": alignment === "center",
                "justify-end": alignment === "right",
              })}
            >
              {user.socialLinks.map((link) => (
                <a key={link.id} href={link.url} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-primary transition-colors'>
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <LinkList links={user.links} alignment={alignment} />
      </div>
    </div>
  );
}
