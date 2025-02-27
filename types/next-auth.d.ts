import { DefaultSession } from "next-auth";
import { SocialLink } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      displayName: string | null;
      bio: string | null;
      socialLinks: SocialLink[];
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    displayName: string | null;
    bio: string | null;
    socialLinks: SocialLink[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    socialLinks: SocialLink[];
  }
}
