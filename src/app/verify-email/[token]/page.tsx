"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Loader2, Mail, ArrowRight } from "lucide-react";

interface PageProps {
  params: {
    token: string;
  };
}

export default function VerifyEmailPage({ params }: PageProps) {
  const router = useRouter();
  const token = params.token;
  
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Resend Verification Form State
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  
  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!token || verificationAttempted.current) return;
    
    const verifyToken = async () => {
      setVerifying(true);
      setError(null);
      verificationAttempted.current = true;

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setSuccess("Verification successful!");
          // Redirect to login page after 2 seconds with success status
          setTimeout(() => {
            router.push("/auth/login?verified=true");
          }, 2000);
        } else {
          setError(data.error || "Verification failed. The link may have expired or is invalid.");
        }
      } catch (err) {
        setError("A network error occurred. Please try again.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, router]);

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    setResendSuccess(null);
    setResendError(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        setResendSuccess(data.message || "A new verification link has been sent to your email.");
        setEmail("");
      } else {
        setResendError(data.error || "Failed to resend verification email.");
      }
    } catch (err) {
      setResendError("A network error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "480px", textAlign: "center" }} id="verify-card">
        <div>
          <div style={{ display: "inline-flex", width: "48px", height: "48px", border: "1px solid var(--border-color)", borderRadius: "50%", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "20px" }}>
            {verifying ? (
              <Loader2 size={24} style={{ animation: "spin 2s linear infinite" }} id="verify-spinner" />
            ) : error ? (
              <ShieldAlert size={24} style={{ color: "var(--danger)" }} />
            ) : (
              <ShieldCheck size={24} style={{ color: "var(--success)" }} />
            )}
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }} id="verify-header">
            {verifying ? "Validating Security Token" : error ? "Verification Failed" : "Access Approved"}
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }} id="verify-subheader">
            {verifying
              ? "Connecting to SecureGate directory to validate credentials..."
              : error
              ? error
              : "Your email address has been verified. Redirecting to the secure entrance..."}
          </p>

          {error && (
            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border-color)", textAlign: "left" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={18} /> Request New Verification Link
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
                Enter your registered email address below, and we will send you a new 15-minute token link.
              </p>

              {resendSuccess && (
                <div className="alert alert-success" style={{ fontSize: "13px", padding: "12px" }} id="resend-success-alert">
                  {resendSuccess}
                </div>
              )}

              {resendError && (
                <div className="alert alert-error" style={{ fontSize: "13px", padding: "12px" }} id="resend-error-alert">
                  {resendError}
                </div>
              )}

              <form onSubmit={handleResendSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="input-group" style={{ marginBottom: "0" }}>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={resendLoading}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${resendLoading ? "btn-disabled" : ""}`}
                  disabled={resendLoading}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {resendLoading ? (
                    <>
                      <span className="spinner" style={{ marginRight: "8px" }} />
                      Sending Link...
                    </>
                  ) : (
                    "Send Verification Email"
                  )}
                </button>
              </form>
            </div>
          )}

          {!verifying && !error && (
            <div style={{ marginTop: "16px" }}>
              <Link href="/auth/login" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} id="go-to-login">
                Proceed manually <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Inline styles for simple keyframe animations like spinner */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
