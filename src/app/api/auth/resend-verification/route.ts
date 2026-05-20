import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendVerificationEmail, sendAlreadyVerifiedEmail } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const xForwardedFor = request.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";
    const limited = await isRateLimited(ip, "forgot-password");
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const lowerEmail = email.toLowerCase().trim();

    // Find user in database
    const user = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    // To prevent user enumeration, return a success message if the user does not exist
    if (!user) {
      return NextResponse.json(
        { message: "If your email is registered and unverified, a verification link has been sent." },
        { status: 200 }
      );
    }

    // If already verified, return the generic success message and send an email notifying them in the background
    if (user.emailVerified) {
      await sendAlreadyVerifiedEmail(lowerEmail);
      return NextResponse.json(
        { message: "If your email is registered and unverified, a verification link has been sent." },
        { status: 200 }
      );
    }

    // Generate a new verification token and expiration
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token inside transaction
    await db.$transaction([
      db.verificationToken.deleteMany({
        where: { identifier: lowerEmail },
      }),
      db.verificationToken.create({
        data: {
          identifier: lowerEmail,
          token: verificationToken,
          expires,
        },
      }),
    ]);

    // Send the email
    await sendVerificationEmail(lowerEmail, verificationToken);

    return NextResponse.json(
      { message: "If your email is registered and unverified, a verification link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
