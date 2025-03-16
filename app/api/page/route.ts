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
        contents: {
          orderBy: { order: "asc" },
          // where: { visible: true },
        },
        pageStats: true,
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

    // Extract featured content IDs if present
    const data = { ...body };

    // Ensure pageImage is an array or null
    if (data.pageImage !== undefined) {
      try {
        data.pageImage = Array.isArray(data.pageImage) ? data.pageImage : JSON.parse(data.pageImage);
        if (!Array.isArray(data.pageImage)) throw new Error();
      } catch {
        data.pageImage = null;
      }
    }

    // Ensure socialLinks is an array or null
    if (data.socialLinks !== undefined) {
      try {
        data.socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : JSON.parse(data.socialLinks);
        if (!Array.isArray(data.socialLinks)) throw new Error();
      } catch {
        data.socialLinks = null;
      }
    }

    // Ensure featuredContentIds is an array
    if (data.featuredContentIds) {
      try {
        data.featuredContentIds = Array.isArray(data.featuredContentIds) ? data.featuredContentIds : JSON.parse(data.featuredContentIds);
        if (!Array.isArray(data.featuredContentIds)) throw new Error();
      } catch {
        data.featuredContentIds = [];
      }
    }

    const updatedPage = await db.page.update({
      where: { userId: session.user.id },
      data: data,
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Failed to update page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Create a new page (if the user doesn't have one)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const existingPage = await db.page.findUnique({
      where: { userId: session.user.id },
    });

    if (existingPage) {
      return new NextResponse("User already has a page", { status: 400 });
    }

    const body = await req.json();

    const newPage = await db.page.create({
      data: {
        ...body,
        userId: session.user.id,
        // Initialize default values if not provided
        alignment: body.alignment || "center",
        backgroundColor: body.backgroundColor || "#FFFFFF",
        brandColor: body.brandColor || "#000000",
        font: body.font || "default",
        language: body.language || "en",
        multipleLanguage: body.multipleLanguage || false,
        live: body.live !== undefined ? body.live : true,
        showCategories: body.showCategories !== undefined ? body.showCategories : true,
        featuredContentIds: body.featuredContentIds || [],
        // Create default page stats
        pageStats: {
          create: {
            visits: 0,
            clicks: 0,
          },
        },
      },
    });

    return NextResponse.json(newPage);
  } catch (error) {
    console.error("Failed to create page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Delete the user's page
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    await db.page.delete({
      where: { userId: session.user.id },
    });

    return new NextResponse("Page deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to delete page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
