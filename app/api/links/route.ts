import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createLink } from "@/lib/data/links";
import { NextResponse } from "next/server";
import { z } from "zod";

const linkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = linkSchema.parse(json);

    const link = await createLink({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json(link);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
