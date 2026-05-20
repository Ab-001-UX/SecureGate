import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export async function POST(request: NextRequest, context: any) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";
  const pathname = request.nextUrl.pathname;

  // Intercept and rate limit credentials authentication requests
  if (pathname.includes("/signin") || pathname.includes("/callback/credentials")) {
    const limited = await isRateLimited(ip, "login");
    if (limited) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in 10 minutes." },
        { status: 429 }
      );
    }
  }

  return handler(request, context);
}

export async function GET(request: NextRequest, context: any) {
  return handler(request, context);
}
