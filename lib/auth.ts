import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/lib/data/user";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Invalid credentials");
          }

          const user = await getUserByUsername(credentials.username);
          if (!user) throw new Error("User not found");

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) throw new Error("Invalid password");

          return {
            id: user.id,
            username: user.username,
            displayName: user.displayName ?? null,
            bio: user.bio ?? null,
            socialLinks: user.socialLinks ?? [],
            email: null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.displayName = token.displayName ?? null;
        session.user.bio = token.bio ?? null;
        session.user.socialLinks = token.socialLinks ?? [];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.displayName = user.displayName ?? null;
        token.bio = user.bio ?? null;
        token.socialLinks = user.socialLinks ?? [];
      }
      return token;
    },
  },
};
