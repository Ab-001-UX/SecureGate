import Link from "next/link";
import { Shield, Key, Eye, ShieldCheck, Database, Zap } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 0" }}>
      <section className="container" style={{ textAlign: "center", marginBottom: "80px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", border: "1px solid var(--border-color)", borderRadius: "20px", fontSize: "14px", color: "var(--accent)", fontWeight: 500, marginBottom: "24px" }} id="hero-badge">
          <ShieldCheck size={16} /> Multi-Layer Authentication Gate Active
        </div>
        <h1 style={{ fontSize: "56px", lineHeight: "1.1", marginBottom: "24px", fontWeight: 800 }} id="landing-title">
          The Uncompromising <br />
          <span style={{ color: "var(--accent)" }}>Security Gateway</span> for App Access
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "18px", maxWidth: "600px", margin: "0 auto 40px auto", lineHeight: "1.6" }} id="landing-description">
          Protect your resources with absolute confidence. SecureGate implements enterprise-grade authentication with sub-second verification response times.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-primary" id="landing-btn-dashboard">
                Access Personal Dashboard <Shield size={18} />
              </Link>
              <SignOutButton id="landing-btn-logout" />
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-primary" id="landing-btn-login">
                Access Gateway
              </Link>
              <Link href="/auth/register" className="btn btn-secondary" id="landing-btn-register">
                Register Account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="container" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "48px" }} id="features-title">
          Engineered Security Architecture
        </h2>
        <div className="grid grid-cols-3" id="features-grid">
          <div className="card" id="feature-rate-limit">
            <div style={{ display: "flex", width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "rgba(17, 17, 17, 0.05)", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "20px" }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Rate Limiting Middleware</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Active brute-force protection guarding all core credential endpoints. Blocks suspicious IPs based on rolling database records.
            </p>
          </div>

          <div className="card" id="feature-tokens">
            <div style={{ display: "flex", width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "rgba(17, 17, 17, 0.05)", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "20px" }}>
              <Key size={24} />
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Strict Token Expirations</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Verification tokens expire in 24 hours, and forgot password reset tokens are tightly constrained to 1 hour, minimizing the window of vulnerability.
            </p>
          </div>

          <div className="card" id="feature-logs">
            <div style={{ display: "flex", width: "48px", height: "48px", borderRadius: "8px", backgroundColor: "rgba(17, 17, 17, 0.05)", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: "20px" }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Real-time Audit Logs</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Track logins, status changes, blocked requests, and geographical attempts. Instant security trails available to administrators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
