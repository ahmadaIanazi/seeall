"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useStyles } from "@/lib/store/styles";
import { useEffect, useState } from "react";
import SectionsList from "./sections-list";
import { useTheme } from "@/lib/store/theme";
import { ContentType } from "@/types";
import { Page } from "@prisma/client";
import { CategoriesListComponent, ContentRenderer, CoreImageComponent } from "../components";
import { ImageUploadMulti } from "../images/image-upload-multi";

export function PageHeaderManager({ page }: { page: Partial<Page> }) {
  const { setPage, edit, contents } = useDashboardStore();
  const [pageName, setPageName] = useState(page?.pageName || "");
  const [bio, setBio] = useState(page?.bio || "");
  const [pageImage, setPageImage] = useState(page?.pageImage || []);
  const { styles } = useStyles();
  const { themeConfig } = useTheme();

  const categories = contents?.filter((item) => item.anchor === true);

  useEffect(() => {
    console.log("PAGE NAME:", pageName, bio, pageImage);
    setPage({ pageName, bio, pageImage });
  }, [pageName, bio, pageImage, setPage]);

  const titleContent = {
    type: ContentType.PAGE_TITLE,
    title: pageName,
  };

  const bioContent = {
    type: ContentType.PAGE_BIO,
    description: bio,
  };

  const imageContent = {
    type: ContentType.PAGE_AVATAR,
    image: pageImage,
  };

  const sections = { ...categories };

  // Edit mode (with inputs)
  if (edit) {
    return (
      <div className={`${styles.alignment}`}>
        <div className='space-y-4'>
          <div className={`flex ${styles.alignment}`}>
            <ImageUploadMulti multiple={false} value={pageImage} onChange={setPageImage} />
          </div>
          <Input className={`text-2xl border-dashed`} value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder='Page Name (optional)' />
          <Textarea className={`border-dashed`} value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Bio (optional)' rows={3} />
        </div>
        <SectionsList />
      </div>
    );
  }

  // Public View
  return (
    <div className={`${styles.alignment}`}>
      <div className='space-y-4'>
        <CoreImageComponent images={imageContent.image} contentType={imageContent.type} themeConfig={themeConfig} />
        <ContentRenderer content={titleContent} themeConfig={themeConfig} />
        <ContentRenderer content={bioContent} themeConfig={themeConfig} />
      </div>
      <CategoriesListComponent content={sections} themeConfig={themeConfig} />
      <SectionsList />
    </div>
  );
}
