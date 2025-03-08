"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useEffect, useState } from "react";
import { ImageUpload } from "../images/image-upload";
import SectionsList from "./sections-list";
import { getThemeStyles } from "@/lib/utils/style";

export function PageHeaderManager({ pageId }: { pageId: string }) {
  const { page, setPage, edit } = useDashboardStore();
  const [pageName, setPageName] = useState("");
  const [bio, setBio] = useState("");
  const [pageImage, setPageImage] = useState("");

  const theme = page?.style || "DEFAULT";
  const primaryColor = page?.brandColor || "#000000";
  const alignment = page?.alignment || "center";

  // Extract new theme-based styles
  const { borderRadius, borderStyle, headingWeight, textWeight, shadow, padding, alignmentClass, imageClasses, primaryColorStyles } = getThemeStyles(
    theme,
    alignment,
    primaryColor
  );

  useEffect(() => {
    async function fetchHeader() {
      try {
        const res = await fetch(`/api/page/${pageId}`);
        if (!res.ok) throw new Error("Failed to fetch page header");
        const data = await res.json();
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

  // Edit mode (with inputs)
  if (edit) {
    return (
      <div className='space-y-6'>
        <div className='space-y-4'>
          <div className={`flex ${alignmentClass}`}>
            <ImageUpload value={pageImage} onChange={setPageImage} />
          </div>
          <Input className={`text-2xl ${alignmentClass} border-dashed`} value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder='Page Name (optional)' />
          <Textarea className={`${alignmentClass} border-dashed`} value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' rows={3} />
        </div>
        <SectionsList theme={theme} edit />
      </div>
    );
  }

  // Public View
  return (
    <div className='space-y-6'>
      <div className={`space-y-4 ${borderRadius} ${borderStyle} ${shadow} ${padding}`}>
        {pageImage && (
          <div className={`flex ${alignmentClass}`}>
            <div className='overflow-hidden'>
              <img src={pageImage} alt={pageName} className={imageClasses} />
            </div>
          </div>
        )}
        {pageName && (
          <h1 className={`text-2xl ${headingWeight} ${alignmentClass}`} style={primaryColorStyles.title}>
            {pageName}
          </h1>
        )}
        {bio && <p className={`${textWeight} ${alignmentClass}`}>{bio}</p>}
      </div>
      <SectionsList theme={theme} />
    </div>
  );
}
