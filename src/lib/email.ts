import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");
const senderEmail = process.env.SENDER_EMAIL || "SecureGate <security@yourdomain.com>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${appUrl}/verify-email/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Verify your email address - SecureGate",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Verify Your Identity</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">Thank you for registering at SecureGate. To complete your setup, please verify your email address by clicking the link below. This link will expire in 15 minutes.</p>
          <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Verify Email Address</a>
          <p style="color: #64748b; font-size: 13px; margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    if (error) {
      console.error("Resend error: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email send exception: ", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${appUrl}/reset-password/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Reset your password - SecureGate",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Reset Password Request</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">We received a request to reset your password. Click the link below to set a new password. This link will expire in 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Reset Password</a>
          <p style="color: #64748b; font-size: 13px; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });
    if (error) {
      console.error("Resend error: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email send exception: ", error);
    return { success: false, error };
  }
}

export async function sendExistingUserSignUpNotification(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Attempted registration - SecureGate",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Attempted Registration</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">Someone tried to register an account on SecureGate with this email address. However, this email is already registered.</p>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">If this was you, please sign in or reset your password if you forgot it. If this wasn't you, you can safely ignore this email.</p>
          <a href="${appUrl}/auth/login" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Go to Login</a>
        </div>
      `,
    });
    if (error) {
      console.error("Resend error: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email send exception: ", error);
    return { success: false, error };
  }
}

export async function sendAlreadyVerifiedEmail(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Email verification request - SecureGate",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Already Verified</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">We received a request to send a verification link for this email address. However, this email is already verified.</p>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">You can sign in to your account directly using the link below.</p>
          <a href="${appUrl}/auth/login" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px;">Go to Login</a>
        </div>
      `,
    });
    if (error) {
      console.error("Resend error: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email send exception: ", error);
    return { success: false, error };
  }
}
