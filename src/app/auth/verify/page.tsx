"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Loader2, LogOut, Mail } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data: session, status } = useSession();
  
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  // Handle manual log out for unverified logged-in users redirected here by middleware
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "480px", textAlign: "center" }} id="verify-card">
        {token ? (
          // Case 1: Verifying token from email link click
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
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} id="verify-action-buttons">
                <Link href="/auth/login" className="btn btn-primary" id="verify-to-login">
                  Return to Sign In
                </Link>
                <Link href="/auth/register" className="btn btn-secondary" id="verify-to-register">
                  Register New Profile
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Case 2: User landed here or was redirected here because their email is not verified
          <div>
            <div style={{ display: "inline-flex", width: "48px", height: "48px", border: "1px solid var(--border-color)", borderRadius: "50%", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "20px" }}>
              <Mail size={24} />
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }} id="unverified-header">
              Verification Required
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }} id="unverified-subheader">
              Your account email <strong>{session?.user?.email}</strong> is currently unverified. 
              We have dispatched a verification email to this address. Please locate the link to continue.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} id="unverified-actions">
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} id="unverified-logout-btn">
                <LogOut size={16} /> Sign Out of Directory
              </button>
            </div>
          </div>
        )}
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
