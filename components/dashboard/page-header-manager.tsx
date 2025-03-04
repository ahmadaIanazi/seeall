"use client";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useEffect, useState } from "react";

export function PageHeaderManager({ pageId }: { pageId: string }) {
  const { setPage } = useDashboardStore();
  const [pageName, setPageName] = useState("");
  const [bio, setBio] = useState("");
  const [pageImage, setPageImage] = useState("");

  useEffect(() => {
    async function fetchHeader() {
      try {
        const res = await fetch(`/api/page/${pageId}`);
        if (!res.ok) throw new Error("Failed to fetch page header");
        const data = await res.json();
        console.log("~FETCHED PAGE HEADER AND STUFF:", data);
        setPageName(data.pageName || "");
        setBio(data.bio || "");
        setPageImage(data.pageImage || "");
      } catch (error) {
        console.error(error);
      }
    }
    fetchHeader();
  }, [pageId]);

  useEffect(() => {
    setPage({ pageName, bio, pageImage });
  }, [pageName, bio, pageImage, setPage]);

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <p className='text-sm font-medium mb-2'>Page Image</p>
          <ImageUpload value={pageImage} onChange={setPageImage} className='w-32 h-32 mx-auto' />
          <p className='text-sm text-muted-foreground mt-1 text-center'>Upload a page image (optional)</p>
        </div>

        <div>
          <Input value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder='Page Name (optional)' />
          <p className='text-sm text-muted-foreground mt-1'>This will be the name displayed on your page</p>
        </div>

        <div>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' rows={3} />
        </div>
      </div>
    </div>
  );
}
