import { Resend } from "resend";
import {
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getExistingUserSignUpHtml,
  getAlreadyVerifiedEmailHtml,
} from "./email-templates";

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
      html: getVerificationEmailHtml(verifyLink),
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
      html: getPasswordResetEmailHtml(resetLink),
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
      html: getExistingUserSignUpHtml(`${appUrl}/auth/login`),
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
      html: getAlreadyVerifiedEmailHtml(`${appUrl}/auth/login`),
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
