"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Mail, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit request. Please try again.");
      } else {
        setSuccess(data.message || "A password reset link has been dispatched to your email (if registered).");
        setEmail("");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "440px" }} id="forgot-password-card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", width: "48px", height: "48px", border: "1px solid var(--border-color)", borderRadius: "50%", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "16px" }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }} id="forgot-header">
            Reset Request
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }} id="forgot-subheader">
            Enter your email to receive a secure token to reset your password.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" id="forgot-alert-error">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" id="forgot-alert-success">
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} id="forgot-form">
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

            <button
              type="submit"
              className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
              style={{ width: "100%", marginTop: "12px" }}
              disabled={loading}
              id="forgot-submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ marginRight: "8px" }} />
                  Sending...
                </>
              ) : (
                "Dispatch Reset Link"
              )}
            </button>
          </form>
        )}

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }} id="forgot-footer">
          Remember credentials?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }} id="login-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
