import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const page = await db.page.findFirst({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    return NextResponse.json(page.links);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    if (!Array.isArray(body)) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findFirst({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    await db.link.deleteMany({ where: { pageId: page.id } });
    const updatedLinks = await db.link.createMany({
      data: body.map((link) => ({
        id: link.id,
        type: link.type || "link",
        title: link.title,
        url: link.url || "",
        image: link.image || "",
        description: link.description || "",
        order: link.order || 0,
        pageId: page.id,
      })),
    });

    return NextResponse.json(updatedLinks);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { type, title, url, image, description, order } = await req.json();
    if (!title) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findFirst({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    const newLink = await db.link.create({
      data: {
        type: type || "link",
        title,
        url: url || "",
        image: image || "",
        description: description || "",
        order: order || 0,
        pageId: page.id,
      },
    });

    return NextResponse.json(newLink);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await req.json();
    if (!id) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findFirst({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    await db.link.delete({ where: { id } });
    return new NextResponse("Link deleted successfully", { status: 200 });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
