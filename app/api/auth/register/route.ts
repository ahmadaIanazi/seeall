import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = registerSchema.parse(json);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { username: body.username },
    });

    if (existingUser) {
      return new NextResponse("Username already taken", { status: 409 });
    }

    const hashedPassword = await hash(body.password, 10);

    // Create user without email
    const user = await db.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
        // Don't include email field if it's not provided
      },
    });

    return NextResponse.json({
      user: {
        username: user.username,
        id: user.id,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
