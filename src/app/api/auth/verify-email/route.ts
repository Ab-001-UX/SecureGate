import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Verification token is missing." }, { status: 400 });
    }

    // 1. Find token record in database
    const tokenRecord = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // 2. Check token expiration
    if (new Date() > tokenRecord.expires) {
      // Clean up expired token
      await db.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json({ error: "Verification link has expired. Please register again." }, { status: 400 });
    }

    // 3. Perform verification update inside database transaction
    await db.$transaction([
      db.user.update({
        where: { email: tokenRecord.identifier },
        data: { emailVerified: new Date() },
      }),
      db.verificationToken.delete({
        where: { token },
      }),
    ]);

    return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
  } catch (error) {
    console.error("Email verification error: ", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
