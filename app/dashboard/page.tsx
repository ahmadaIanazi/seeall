import { PageContentManager } from "@/components/dashboard/page-content-manager";
import PageFooterManager from "@/components/dashboard/page-footer-manager";
import { PageHeaderManager } from "@/components/dashboard/page-header-manager";
import { PageToolbar } from "@/components/dashboard/toolbar";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  // Fetch Page data instead of User
  const page = await db.page.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { orderBy: { order: "asc" } },
      socialLinks: true,
      stats: true,
    },
  });

  console.log("PAGE ITEMS:", page);
  if (!page) return null;

  return (
    <div className='flex min-h-screen flex-col'>
      <PageToolbar />
      <main className='flex-1 container py-8 px-4 space-y-4 sm:px-8'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-muted-foreground'>seeall.info/</span>
          <span className='text-xs font-medium'>{session.user.username}</span>
        </div>
        <PageHeaderManager
          headerData={{
            pageName: page.pageName || "",
            bio: page.bio || "",
            pageImage: page.pageImage || "",
            alignment: page.alignment,
            brandColor: page.brandColor,
            backgroundColor: page.backgroundColor,
            font: page.font,
            language: page.language,
            multipleLanguage: page.multipleLanguage,
            socialLinks: page.socialLinks,
          }}
          pageId={page.id}
          userId={session.user.id}
        />
        <PageContentManager initialLinks={page.links} pageId={page.id} userId={session.user.id} />
        <PageFooterManager initialFooter={{ footer: page.footer || "" }} pageId={page.id} userId={session.user.id} />
      </main>
    </div>
  );
}

const x = {
  id: "cm7uhxnuv00061ym1uut3jrry",
  userId: "cm7uhxno700041ym150sjiuy1",
  createdAt: "2025-03-04T12:59:55.783Z",
  updatedAt: "2025-03-04T12:59:55.783Z",
  alignment: "right",
  backgroundColor: "#FFFFFF",
  bio: "Hello",
  brandColor: "#000000",
  font: "default",
  footer: null,
  language: "en",
  multipleLanguage: false,
  pageImage: "",
  pageName: "bop",
  style: null,
  user: {
    id: "cm7uhxno700041ym150sjiuy1",
    username: "bop",
    password: "$2b$10$G6ZNn6mYwZtKATCqYdt9Cu6n.uiNo1alS5ZddogKEO2TnBQDwCsam",
    email: null,
    emailVerified: null,
    createdAt: "2025-03-04T12:59:55.544Z",
    updatedAt: "2025-03-04T12:59:55.544Z",
  },
  links: [
    {
      id: "b798ec4f-9634-4c8a-8916-ee4328b633d1",
      type: "header",
      title: "HEADER TITLE",
      url: "",
      image: "",
      description: "",
      order: 0,
      createdAt: "2025-03-04T13:17:09.603Z",
      updatedAt: "2025-03-04T13:17:09.603Z",
      pageId: "cm7uhxnuv00061ym1uut3jrry",
    },
  ],
  socialLinks: [
    {
      id: "cm7uijs7k00031yqx3d907ihw",
      platform: "github",
      url: "https://www",
      createdAt: "2025-03-04T13:17:07.857Z",
      updatedAt: "2025-03-04T13:17:07.857Z",
      pageId: "cm7uhxnuv00061ym1uut3jrry",
    },
    {
      id: "cm7uijs7k00041yqxqxsst4km",
      platform: "linkedin",
      url: "https://linked",
      createdAt: "2025-03-04T13:17:07.857Z",
      updatedAt: "2025-03-04T13:17:07.857Z",
      pageId: "cm7uhxnuv00061ym1uut3jrry",
    },
  ],
  stats: {
    id: "cm7uhxnuv00071ym12jvpyjbx",
    pageId: "cm7uhxnuv00061ym1uut3jrry",
    visits: 0,
    clicks: 0,
    createdAt: "2025-03-04T12:59:55.783Z",
    updatedAt: "2025-03-04T12:59:55.783Z",
  },
};
