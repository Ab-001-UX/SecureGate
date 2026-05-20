import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { forgotPasswordSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limiter";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";

  // 1. Upstash Redis Rate Limiting (max 5 per 10 mins)
  const limited = await isRateLimited(ip, "forgot-password");
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in 10 minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // 2. Zod validation
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    // 3. Check user existence
    const user = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    // Security Rule: If email is not found, still return a success message
    if (!user) {
      // Mitigate timing attacks by simulating database transaction and email sending latency
      const delayMs = 400 + Math.floor(Math.random() * 200); // 400ms to 600ms
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      return NextResponse.json(
        { message: "A password reset link has been sent to your email address." },
        { status: 200 }
      );
    }

    // 4. Create password reset token with 1 hour expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Clean up any existing tokens for this email first, then create a new one
    await db.$transaction([
      db.passwordResetToken.deleteMany({
        where: { email: lowerEmail },
      }),
      db.passwordResetToken.create({
        data: {
          email: lowerEmail,
          token: resetToken,
          expires,
        },
      }),
    ]);

    // 5. Send reset email
    await sendPasswordResetEmail(lowerEmail, resetToken);

    return NextResponse.json(
      { message: "A password reset link has been sent to your email address." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password endpoint error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
