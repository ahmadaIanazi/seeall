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
import { SocialLink } from "@prisma/client";

interface PageHeaderManagerProps {
  headerData: {
    pageName: string | null;
    bio: string | null;
    pageImage: string | null;
    socialLinks: SocialLink[];
  };
}

// Social Platforms
type SocialPlatform = "twitter" | "github" | "linkedin" | "instagram" | "youtube";

const SOCIAL_PLATFORMS: Record<SocialPlatform, { label: string; placeholder: string }> = {
  twitter: { label: "Twitter", placeholder: "https://twitter.com/username" },
  github: { label: "GitHub", placeholder: "https://github.com/username" },
  linkedin: { label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  instagram: { label: "Instagram", placeholder: "https://instagram.com/username" },
  youtube: { label: "YouTube", placeholder: "https://youtube.com/@username" },
};

export function PageHeaderManager({ headerData }: PageHeaderManagerProps) {
  const { setPage, setSocialLinks } = useDashboardStore();
  const [pageName, setPageName] = useState(headerData.pageName);
  const [bio, setBio] = useState(headerData.bio);
  const [pageImage, setPageImage] = useState(headerData.pageImage);
  const [socialLinks, setSocialLinksLocal] = useState<SocialLink[]>(headerData.socialLinks);
  const [newPlatform, setNewPlatform] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [showSocialForm, setShowSocialForm] = useState(false);

  // Initialize Zustand store with initial data
  useEffect(() => {
    setPage({ pageName, bio, pageImage });
    setSocialLinks(socialLinks);
  }, []);

  // Sync state changes to Zustand store
  useEffect(() => {
    setPage({ pageName, bio, pageImage });
  }, [pageName, bio, pageImage]);

  useEffect(() => {
    setSocialLinks(socialLinks);
  }, [socialLinks]);

  function addSocialLink() {
    if (!newPlatform || !newUrl) return;
    setSocialLinksLocal([...socialLinks, { id: crypto.randomUUID(), platform: newPlatform, url: newUrl, pageId: "", createdAt: new Date(), updatedAt: new Date() }]);
    setNewPlatform(null);
    setNewUrl("");
  }

  function removeSocialLink(id: string) {
    setSocialLinksLocal(socialLinks.filter((link) => link.id !== id));
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {/* Page Image Upload */}
        <div>
          <p className='text-sm font-medium mb-2'>Page Image</p>
          <ImageUpload value={pageImage} onChange={setPageImage} className='w-32 h-32 mx-auto' />
          <p className='text-sm text-muted-foreground mt-1 text-center'>Upload a page image (optional)</p>
        </div>

        {/* Page Name */}
        <div>
          <Input value={pageName || ""} onChange={(e) => setPageName(e.target.value)} placeholder='Page Name (optional)' />
          <p className='text-sm text-muted-foreground mt-1'>This will be the name displayed on your page</p>
        </div>

        {/* Bio */}
        <div>
          <Textarea value={bio || ""} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' rows={3} />
        </div>

        {/* Social Links */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Social Links</h3>
            <Button type='button' variant='ghost' size='sm' onClick={() => setShowSocialForm(true)}>
              <PlusCircle className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            {socialLinks.map((link) => (
              <div key={link.id} className='flex items-center gap-2 bg-muted rounded-lg px-3 py-2'>
                <span className='text-sm'>{SOCIAL_PLATFORMS[link.platform as SocialPlatform]?.label || link.platform}</span>
                <Button type='button' variant='ghost' size='icon' className='h-4 w-4' onClick={() => removeSocialLink(link.id)}>
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Social Link */}
      <Sheet open={showSocialForm} onOpenChange={setShowSocialForm}>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Add Social Link</SheetTitle>
          </SheetHeader>
          <div className='p-6 space-y-4'>
            <div className='flex flex-col gap-4'>
              <Select value={newPlatform || ""} onValueChange={setNewPlatform}>
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

              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={newPlatform ? SOCIAL_PLATFORMS[newPlatform as SocialPlatform]?.placeholder : "Enter URL"}
              />

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
