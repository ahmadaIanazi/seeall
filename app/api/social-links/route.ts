import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all social links for the user's page
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const page = await db.page.findUnique({
      where: { userId: session.user.id },
      include: { socialLinks: true },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    return NextResponse.json(page.socialLinks);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT: Update multiple social links
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    if (!Array.isArray(body)) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findUnique({
      where: { userId: session.user.id },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    // Clear old links and insert new ones
    await db.socialLink.deleteMany({ where: { pageId: page.id } });
    const updatedLinks = await db.socialLink.createMany({
      data: body.map((link) => ({
        platform: link.platform,
        url: link.url,
        pageId: page.id,
      })),
    });

    return NextResponse.json(updatedLinks);
  } catch (error) {
    console.error("Failed to update social links:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Add a new social link
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { platform, url } = await req.json();
    if (!platform || !url) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findUnique({
      where: { userId: session.user.id },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    const newLink = await db.socialLink.create({
      data: {
        platform,
        url,
        pageId: page.id,
      },
    });

    return NextResponse.json(newLink);
  } catch (error) {
    console.error("Failed to add social link:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Remove a specific social link
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { platform } = await req.json();
    if (!platform) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findUnique({
      where: { userId: session.user.id },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    await db.socialLink.deleteMany({
      where: { pageId: page.id, platform },
    });

    return new NextResponse("Social link deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to delete social link:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
