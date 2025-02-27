import { createUser, getUserByUsername } from "@/lib/data/user";
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

    const existingUser = await getUserByUsername(body.username);
    if (existingUser) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    await createUser(body);
    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
