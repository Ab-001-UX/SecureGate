"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, CheckCircle, Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if there are error parameters or redirect messages from URL (NextAuth redirection)
    const err = searchParams.get("error");
    const verified = searchParams.get("verified");

    if (err === "RATE_LIMIT_EXCEEDED") {
      setError("Too many login attempts. Please try again in 10 minutes.");
    } else if (err === "EMAIL_UNVERIFIED") {
      setError("Your email address is unverified. Please check your inbox for a verification link.");
    } else if (err === "EMAIL_NOT_FOUND") {
      setError("No account found with this email address.");
    } else if (err === "INCORRECT_PASSWORD") {
      setError("Incorrect password. Please try again.");
    } else if (err === "CredentialsSignin" || err === "INVALID_CREDENTIALS" || err === "Invalid credentials") {
      setError("Invalid email or password. Please try again.");
    } else if (err) {
      setError("Authentication failed. Please try again.");
    }

    if (verified === "true") {
      setSuccess("Email successfully verified! You may now sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (result?.error) {
        if (result.error.includes("RATE_LIMIT_EXCEEDED")) {
          setError("Too many login attempts. Please try again in 10 minutes.");
        } else if (result.error.includes("EMAIL_UNVERIFIED")) {
          setError("Your email address is unverified. Please check your inbox for a verification link.");
        } else if (result.error.includes("EMAIL_NOT_FOUND")) {
          setError("No account found with this email address.");
        } else if (result.error.includes("INCORRECT_PASSWORD")) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "440px" }} id="login-card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", width: "48px", height: "48px", border: "1px solid var(--border-color)", borderRadius: "50%", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "16px" }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }} id="login-header">
            Gateway Access
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }} id="login-subheader">
            Sign in to verify your identity and enter the gate.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" id="login-alert-error">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" id="login-alert-success">
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="input-group">
            <label className="input-label" htmlFor="email-input">
              Email Address
            </label>
            <input
              type="email"
              id="email-input"
              className="input-field"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="input-label" htmlFor="password-input">
                Password
              </label>
              <Link href="/auth/forgot-password" style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none" }} id="forgot-password-link">
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password-input"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                style={{ width: "100%", paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
                id="toggle-password-btn"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
            style={{ width: "100%", marginTop: "12px" }}
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: "8px" }} />
                Verifying...
              </>
            ) : (
              "Authenticate"
            )}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }} id="login-footer">
          New to SecureGate?{" "}
          <Link href="/auth/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }} id="register-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
