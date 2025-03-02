import { DefaultSession } from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      displayName: string | null;
      bio: string | null;
      socialLinks: Array<{
        platform: string;
        url: string;
      }>;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  }
}
