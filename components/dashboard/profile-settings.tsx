"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlusCircle, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileSettingsProps {
  initialData: {
    displayName: string | null;
    bio: string | null;
    socialLinks: Array<{
      id: string;
      platform: string;
      url: string;
    }>;
  };
}

const SOCIAL_PLATFORMS = {
  twitter: { label: "Twitter", placeholder: "https://twitter.com/username" },
  github: { label: "GitHub", placeholder: "https://github.com/username" },
  linkedin: { label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  instagram: { label: "Instagram", placeholder: "https://instagram.com/username" },
  youtube: { label: "YouTube", placeholder: "https://youtube.com/@username" },
};

export function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(initialData.displayName || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [socialLinks, setSocialLinks] = useState(initialData.socialLinks);
  const [newPlatform, setNewPlatform] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName,
        bio,
        socialLinks,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      const error = await response.json();
      return toast.error(error.message || "Something went wrong");
    }

    toast.success("Profile updated successfully");
  }

  function addSocialLink() {
    if (!newPlatform || !newUrl) return;

    setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: newPlatform, url: newUrl }]);
    setNewPlatform(null);
    setNewUrl("");
  }

  function removeSocialLink(id: string) {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder='Display Name (optional)' disabled={isLoading} />
          <p className='text-sm text-muted-foreground mt-1'>This will be shown instead of your username</p>
        </div>

        <div>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' disabled={isLoading} rows={3} />
        </div>

        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Select value={newPlatform || ""} onValueChange={setNewPlatform}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select Platform' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOCIAL_PLATFORMS).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={newPlatform ? SOCIAL_PLATFORMS[newPlatform as keyof typeof SOCIAL_PLATFORMS]?.placeholder : "URL"}
              type='url'
              className='flex-1'
            />
            <Button type='button' variant='outline' onClick={addSocialLink} disabled={!newPlatform || !newUrl}>
              <PlusCircle className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-2'>
            {socialLinks.map((link) => (
              <div key={link.id} className='flex items-center gap-2'>
                <div className='bg-muted rounded px-2 py-1 text-sm'>{SOCIAL_PLATFORMS[link.platform as keyof typeof SOCIAL_PLATFORMS]?.label}</div>
                <div className='flex-1 truncate text-sm text-muted-foreground'>{link.url}</div>
                <Button type='button' variant='ghost' size='icon' onClick={() => removeSocialLink(link.id)}>
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type='submit' disabled={isLoading} className='w-full'>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
