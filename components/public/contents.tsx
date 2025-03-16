import { Content } from "@prisma/client";
import { ContentRenderer } from "../components";
import { ThemeConfig } from "@/types";

export default function Contents({ contents, themeConfig }: { contents: Content[]; themeConfig: ThemeConfig }) {
  if (!contents) return null;

  return (
    <div className='space-y-4 p-4'>
      {contents.map((content) => (
        <ContentRenderer key={content.id} content={content} themeConfig={themeConfig} />
      ))}
    </div>
  );
}
