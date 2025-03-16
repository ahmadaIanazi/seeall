import Contents from "@/components/public/contents";
import Header from "@/components/public/header";
import { getPageByUsername, getPageMetaByUsername } from "@/lib/data/page";
import { ThemeConfig } from "@/types";
import { Page } from "@prisma/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = (await getPageMetaByUsername(params.username)) as Partial<Page>;
  if (!page) return { title: params.username };

  return {
    title: page.pageName || params.username || "Not Found",
    description: page.bio || `Check out ${params.username}'s links`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const page = (await getPageByUsername(params.username)) as Partial<Page>;
  if (!page) notFound();

  const themeConfig: ThemeConfig = {
    theme: page.style || "DEFAULT",
    alignment: page.alignment || "left",
    primaryColor: page.brandColor || "#000000",
  };

  return (
    <div>
      <Header page={page} themeConfig={themeConfig} />
      <Contents contents={page?.contents} themeConfig={themeConfig} />
    </div>
  );
}
