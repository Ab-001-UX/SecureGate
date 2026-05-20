"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Check, X, Shield, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password criteria states
  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  const getStrengthLabel = () => {
    const metCount = Object.values(checks).filter(Boolean).length;
    if (password.length === 0) return { label: "None", color: "var(--border-color)", width: "0%" };
    if (metCount <= 2) return { label: "Weak Security", color: "var(--danger)", width: "33%" };
    if (metCount <= 4) return { label: "Medium Security", color: "var(--warning)", width: "66%" };
    return { label: "Strong Security", color: "var(--success)", width: "100%" };
  };

  const strength = getStrengthLabel();
  const allCriteriaMet = Object.values(checks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!allCriteriaMet) {
      setError("Please satisfy all password security criteria.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account. Please try again.");
      } else {
        setSuccess(data.message || "Account created! Please check your email to verify your account.");
        // Clear fields on success
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "480px" }} id="register-card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", width: "48px", height: "48px", border: "1px solid var(--border-color)", borderRadius: "50%", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "16px" }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }} id="register-header">
            Create Security Profile
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }} id="register-subheader">
            Register your credentials to configure your gate access.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" id="register-alert-error">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" id="register-alert-success">
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} id="register-form">
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
              <label className="input-label" htmlFor="password-input">
                Password
              </label>
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

            {/* Password Security Strength Bar */}
            {password.length > 0 && (
              <div style={{ marginBottom: "20px" }} id="password-strength-container">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Strength Assessment:</span>
                  <span style={{ fontWeight: 600, color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border-color)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: strength.width, height: "100%", backgroundColor: strength.color, transition: "width 0.3s ease" }}></div>
                </div>

                {/* Checklist */}
                <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} id="password-criteria-list">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: checks.length ? "var(--success)" : "var(--text-muted)" }}>
                    {checks.length ? <Check size={12} /> : <X size={12} />} At least 8 characters
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: checks.upper ? "var(--success)" : "var(--text-muted)" }}>
                    {checks.upper ? <Check size={12} /> : <X size={12} />} 1 Uppercase letter
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: checks.lower ? "var(--success)" : "var(--text-muted)" }}>
                    {checks.lower ? <Check size={12} /> : <X size={12} />} 1 Lowercase letter
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: checks.number ? "var(--success)" : "var(--text-muted)" }}>
                    {checks.number ? <Check size={12} /> : <X size={12} />} 1 Number
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: checks.special ? "var(--success)" : "var(--text-muted)" }}>
                    {checks.special ? <Check size={12} /> : <X size={12} />} 1 Special symbol (@$!%*?&)
                  </div>
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label" htmlFor="confirm-password-input">
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password-input"
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{ width: "100%", paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  id="toggle-confirm-password-btn"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${loading || !allCriteriaMet ? "btn-disabled" : ""}`}
              style={{ width: "100%", marginTop: "12px" }}
              disabled={loading || !allCriteriaMet}
              id="register-submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ marginRight: "8px" }} />
                  Creating Profile...
                </>
              ) : (
                "Establish Profile"
              )}
            </button>
          </form>
        )}

        {success && (
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <Link href="/auth/login" className="btn btn-primary" style={{ width: "100%" }} id="success-login-btn">
              Return to Login Gate
            </Link>
          </div>
        )}

        {!success && (
          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }} id="register-footer">
            Already registered?{" "}
            <Link href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }} id="login-link">
              Authenticate
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
