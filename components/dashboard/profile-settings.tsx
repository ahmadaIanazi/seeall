"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardStore } from "@/lib/store/dashboard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ImageUpload } from "@/components/ui/image-upload";

interface ProfileSettingsProps {
  initialData: {
    displayName: string | null;
    bio: string | null;
    profileImage: string | null;
    page: {
      controls: {
        alignment: string;
      } | null;
    } | null;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  };
}

// Add type for social platforms
type SocialPlatform = "twitter" | "github" | "linkedin" | "instagram" | "youtube";

const SOCIAL_PLATFORMS: Record<SocialPlatform, { label: string; placeholder: string }> = {
  twitter: { label: "Twitter", placeholder: "https://twitter.com/username" },
  github: { label: "GitHub", placeholder: "https://github.com/username" },
  linkedin: { label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  instagram: { label: "Instagram", placeholder: "https://instagram.com/username" },
  youtube: { label: "YouTube", placeholder: "https://youtube.com/@username" },
} as const;

export function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const { setProfile, setSocialLinks } = useDashboardStore();
  const [displayName, setDisplayName] = useState(initialData.displayName);
  const [bio, setBio] = useState(initialData.bio);
  const [profileImage, setProfileImage] = useState(initialData.profileImage);
  const [socialLinks, setSocialLinksLocal] = useState(initialData.socialLinks);
  const [newPlatform, setNewPlatform] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [showSocialForm, setShowSocialForm] = useState(false);
  const alignment = initialData.page?.controls?.alignment || "center";

  // Initialize store with initial data
  useEffect(() => {
    setProfile({
      displayName: initialData.displayName,
      bio: initialData.bio,
      profileImage: initialData.profileImage,
      alignment,
    });
    setSocialLinks(initialData.socialLinks);
  }, [initialData, setProfile, setSocialLinks, alignment]);

  // Update store when local state changes
  useEffect(() => {
    setProfile({
      displayName,
      bio,
      profileImage,
      alignment,
    });
  }, [displayName, bio, profileImage, setProfile, alignment]);

  useEffect(() => {
    setSocialLinks(socialLinks);
  }, [socialLinks, setSocialLinks]);

  function addSocialLink() {
    if (!newPlatform || !newUrl) return;
    setSocialLinksLocal([...socialLinks, { platform: newPlatform, url: newUrl }]);
    setNewPlatform(null);
    setNewUrl("");
  }

  function removeSocialLink(id: string) {
    setSocialLinksLocal(socialLinks.filter((link) => link.platform !== id));
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {/* Profile Image Upload */}
        <div>
          <p className='text-sm font-medium mb-2'>Profile Image</p>
          <ImageUpload value={profileImage} onChange={(value) => setProfileImage(value)} className='w-32 h-32 mx-auto' />
          <p className='text-sm text-muted-foreground mt-1 text-center'>Upload your profile image (optional)</p>
        </div>

        <div>
          <Input value={displayName || ""} onChange={(e) => setDisplayName(e.target.value)} placeholder='Display Name (optional)' />
          <p className='text-sm text-muted-foreground mt-1'>This will be shown instead of your username</p>
        </div>

        <div>
          <Textarea value={bio || ""} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' rows={3} />
        </div>

        {/* Social Links Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Social Links</h3>
            <Button type='button' variant='ghost' size='sm' onClick={() => setShowSocialForm(true)}>
              <PlusCircle className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            {socialLinks.map((link) => (
              <div key={link.platform} className='flex items-center gap-2 bg-muted rounded-lg px-3 py-2'>
                <span className='text-sm'>{SOCIAL_PLATFORMS[link.platform].label}</span>
                <Button type='button' variant='ghost' size='icon' className='h-4 w-4' onClick={() => removeSocialLink(link.platform)}>
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={showSocialForm} onOpenChange={setShowSocialForm}>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Add Social Link</SheetTitle>
          </SheetHeader>
          <div className='p-6 space-y-4'>
            <div className='flex flex-col gap-4'>
              <Select value={newPlatform || ""} onValueChange={(value) => setNewPlatform(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select platform' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SOCIAL_PLATFORMS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder={newPlatform ? SOCIAL_PLATFORMS[newPlatform].placeholder : "Enter URL"} />

              <Button
                onClick={() => {
                  addSocialLink();
                  setShowSocialForm(false);
                }}
                disabled={!newPlatform || !newUrl}
              >
                Add Social Link
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
