// app/api/auth/register/route.ts
import { createUser } from "@/lib/data/user";
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

    // Check if the user exists
    const existingUser = await createUser({ username: body.username, password: body.password });

    if (!existingUser) {
      return new NextResponse("Username already taken", { status: 409 });
    }

    return NextResponse.json({
      user: {
        username: existingUser.username,
        id: existingUser.id,
      },
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
