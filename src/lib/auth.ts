import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limiter";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // 1. IP Rate Limiting Check
        const xForwardedFor = req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"];
        const ip = Array.isArray(xForwardedFor)
          ? xForwardedFor[0]
          : typeof xForwardedFor === "string"
            ? xForwardedFor.split(",")[0].trim()
            : "127.0.0.1";

        const limited = await isRateLimited(ip, "login");
        if (limited) {
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        // 2. Zod schema validation
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("INVALID_INPUTS");
        }

        const { email, password } = parsed.data;

        // 3. Fetch user from DB
        const user = await db.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        // 4. Verify user and password
        if (!user || !user.password) {
          throw new Error("EMAIL_NOT_FOUND");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error("INCORRECT_PASSWORD");
        }

        // 5. Verification Check
        if (!user.emailVerified) {
          throw new Error("EMAIL_UNVERIFIED");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-vercel-build-purposes",
};
