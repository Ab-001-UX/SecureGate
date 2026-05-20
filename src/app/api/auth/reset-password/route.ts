import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json({ error: "Reset token is missing." }, { status: 400 });
    }

    // 1. Zod input validation
    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { password: validPassword } = parsed.data;

    // 2. Find token record in database
    const tokenRecord = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    // 3. Check expiration
    if (new Date() > tokenRecord.expires) {
      // Clean up expired token
      await db.passwordResetToken.delete({
        where: { token },
      });
      return NextResponse.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    // 4. Hash new password (12 salt rounds)
    const hashedPassword = await bcrypt.hash(validPassword, 12);

    // 5. Update user and delete token inside a transaction
    await db.$transaction([
      db.user.update({
        where: { email: tokenRecord.email },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { token },
      }),
    ]);

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Reset password endpoint error: ", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
