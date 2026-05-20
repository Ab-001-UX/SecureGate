import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { Shield, Key, CheckCircle, Mail } from "lucide-react";
import React from "react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "600px" }}>
      <div className="card animate-fade-in" style={{ textAlign: "center", padding: "40px" }} id="dashboard-card">
        <div style={{ display: "inline-flex", width: "56px", height: "56px", border: "1px solid var(--border-color)", borderRadius: "50%", alignItems: "center", justifyContent: "center", color: "var(--success)", marginBottom: "24px" }}>
          <Shield size={28} />
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }} id="dashboard-title">
          SecureGate Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "32px" }} id="dashboard-subtitle">
          Identity verified. You are successfully authenticated within the gateway.
        </p>

        <div style={{ textAlign: "left", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "20px", marginBottom: "32px", backgroundColor: "var(--card-bg, #1e2128)" }} id="profile-container">
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            Identity Profile
          </h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <Mail size={16} style={{ color: "var(--text-muted)" }} />
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Registered Email</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>{session.user.email}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle size={16} style={{ color: "var(--success)" }} />
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Gate Status</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--success)" }}>Verified Access Granted</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
