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
        contents: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });
    return NextResponse.json(page.contents);
  } catch {
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

    await db.content.deleteMany({ where: { pageId: page.id } });
    const updatedContents = await db.content.createMany({
      data: body.map((item) => ({
        id: item.id,
        type: item.type || "BLANK",
        title: item.title || "",
        url: item.url || "",
        image: item.image || "",
        icon: item.icon || "",
        description: item.description || "",
        name: item.name || "",
        price: item.price || 0,
        currency: item.currency || "",
        calories: item.calories || 0,
        allergies: item.allergies || "",
        allergiesIcons: item.allergiesIcons || {},
        additionalPrices: item.additionalPrices || {},
        multiLanguage: item.multiLanguage || {},
        parentContentId: item.parentContentId || null,
        visible: item.visible === false ? false : true,
        order: item.order || 0,
        pageId: page.id,
      })),
    });

    return NextResponse.json(updatedContents);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    if (!body.title) return new NextResponse("Invalid request body", { status: 400 });

    const page = await db.page.findFirst({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    const newContent = await db.content.create({
      data: {
        type: body.type || "LINK",
        title: body.title,
        url: body.url || "",
        image: body.image || "",
        icon: body.icon || "",
        description: body.description || "",
        name: body.name || "",
        price: body.price || 0,
        currency: body.currency || "",
        calories: body.calories || 0,
        allergies: body.allergies || "",
        allergiesIcons: body.allergiesIcons || {},
        additionalPrices: body.additionalPrices || {},
        multiLanguage: body.multiLanguage || {},
        parentContentId: body.parentContentId || null,
        visible: body.visible === false ? false : true,
        order: body.order || 0,
        pageId: page.id,
      },
    });

    return NextResponse.json(newContent);
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

    await db.content.delete({ where: { id } });
    return new NextResponse("Content deleted successfully", { status: 200 });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
