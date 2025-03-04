import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch the current user's page
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const page = await db.page.findUnique({
      where: { userId: session.user.id },
      include: {
        links: { orderBy: { order: "asc" } },
        socialLinks: true,
        stats: true,
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT: Update the page
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    if (!body) return new NextResponse("Invalid request body", { status: 400 });

    const updatedPage = await db.page.update({
      where: { userId: session.user.id },
      data: body, // Directly updating based on incoming body
      include: {
        links: { orderBy: { order: "asc" } },
        socialLinks: true,
        stats: true,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Failed to update page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Create a new page (probably redundant if already created during user registration)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const existingPage = await db.page.findUnique({
      where: { userId: session.user.id },
    });

    if (existingPage) return new NextResponse("Page already exists", { status: 400 });

    const page = await db.page.create({
      data: {
        userId: session.user.id,
        pageName: session.user.username,
        bio: null,
        pageImage: null,
        alignment: "center",
        brandColor: "#000000",
        backgroundColor: "#FFFFFF",
        font: "default",
        language: "en",
        multipleLanguage: false,
        socialLinks: { create: [] },
        links: { create: [] },
        stats: { create: {} },
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to create page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
