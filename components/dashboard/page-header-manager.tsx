"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useEffect, useState } from "react";
import { ImageUpload } from "../images/image-upload";
import SectionsList from "./sections-list";

export function PageHeaderManager({ pageId }: { pageId: string }) {
  const { page, setPage } = useDashboardStore();
  const [pageName, setPageName] = useState("");
  const [bio, setBio] = useState("");
  const [pageImage, setPageImage] = useState("");

  const alignment = page?.alignment ? page.alignment : "center";

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
        <div className={`items-${alignment}`}>
          <ImageUpload value={pageImage} onChange={setPageImage} />
        </div>
        <Input className={`text-2xl text-${alignment} border-dashed`} value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder='Page Name (optional)' />
        <Textarea className={`text-${alignment} border-dashed`} value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' rows={3} />
        {/* <SectionsList /> */}
      </div>
    </div>
  );
}
