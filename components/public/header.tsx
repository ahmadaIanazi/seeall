import { ContentType, Page } from "@prisma/client";
import { CategoriesListComponent, ContentRenderer, CoreImageComponent } from "../components";
import { ThemeConfig } from "@/types";

export default function Header({ page, themeConfig }: { page: Page; themeConfig: ThemeConfig }) {
  const categories = page.contents?.filter((item) => item.anchor === true);

  const titleContent = {
    type: ContentType.PAGE_TITLE,
    title: page.pageName,
  };

  const bioContent = {
    type: ContentType.PAGE_BIO,
    description: page.bio,
  };

  const imageContent = {
    type: ContentType.PAGE_AVATAR,
    image: page.pageImage,
  };

  const sections = { ...categories };

  return (
    <div>
      <div className='space-y-4 p-4'>
        <CoreImageComponent images={imageContent.image} contentType={imageContent.type} themeConfig={themeConfig} />
        <ContentRenderer content={titleContent} themeConfig={themeConfig} />
        <ContentRenderer content={bioContent} themeConfig={themeConfig} />
      </div>
      <CategoriesListComponent content={sections} themeConfig={themeConfig} />
      {/* <SectionsList /> */}
    </div>
  );
}
