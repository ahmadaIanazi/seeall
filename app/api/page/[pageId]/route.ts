// File: app/api/page/[pageId]/route.ts

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
    });

    if (!page) return new NextResponse("Page not found", { status: 404 });

    return NextResponse.json(page);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const existingPage = await db.page.findFirst({
      where: {
        id: params.pageId,
        userId: session.user.id,
      },
    });

    if (!existingPage) return new NextResponse("Page not found", { status: 404 });

    // Strip out fields you don’t want to allow updates to (like id, userId, etc.)
    // eslint-disable-next-line
    const { id, userId, createdAt, ...updates } = body;

    const updatedPage = await db.page.update({
      where: { id: existingPage.id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPage);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
