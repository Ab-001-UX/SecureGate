"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#faf8f5", padding: "40px 24px" }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e5e0",
        borderRadius: "16px",
        padding: "36px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)"
      }}>
        <div style={{
          display: "inline-flex",
          width: "56px",
          height: "56px",
          backgroundColor: "#f5f3ef",
          border: "1px solid #e5e5e0",
          borderRadius: "50%",
          alignItems: "center",
          justifyContent: "center",
          color: "#111111",
          marginBottom: "20px"
        }}>
          <Shield size={28} />
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>
          Page Not Available
        </h1>

        <p style={{ color: "#666660", fontSize: "14.5px", lineHeight: "1.6", marginBottom: "28px" }}>
          We couldn't display the page you requested. This can happen if the link is expired, mistyped, or deactivated for security reasons.
        </p>

        <Link href="/auth/login" style={{
          display: "inline-block",
          width: "100%",
          padding: "12px 24px",
          backgroundColor: "#111111",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "14px",
          transition: "background-color 0.2s ease"
        }}>
          Return to Gate Gateway
        </Link>
      </div>
    </div>
  );
}
