import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signUpSchema } from "@/lib/validation";
import { sendVerificationEmail, sendExistingUserSignUpNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    // 2. Check if email already registered
    const existingUser = await db.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        // Send a notification email stating registration was attempted on an existing account
        await sendExistingUserSignUpNotification(lowerEmail);
      } else {
        // User is unverified; generate a new verification token and send verification email
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

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

        await sendVerificationEmail(lowerEmail, verificationToken);
      }

      // To prevent user enumeration, return the exact same success response
      return NextResponse.json(
        { message: "Registration successful. Please check your email to verify your account." },
        { status: 201 }
      );
    }

    // 3. Hash password (12 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create cryptographically secure token (15 min expiry)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 5. Database operations inside transaction
    await db.$transaction([
      db.user.create({
        data: {
          email: lowerEmail,
          password: hashedPassword,
        },
      }),
      db.verificationToken.create({
        data: {
          identifier: lowerEmail,
          token: verificationToken,
          expires,
        },
      }),
    ]);

    // 6. Send transactional email
    await sendVerificationEmail(lowerEmail, verificationToken);

    return NextResponse.json(
      { message: "Registration successful. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration endpoint error: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
