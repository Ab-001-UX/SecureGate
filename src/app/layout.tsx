import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Shield } from "lucide-react";
import React from "react";

export const metadata: Metadata = {
  title: "SecureGate - Focused Authentication & Security Portal",
  description: "A secure, resilient entry gate for your applications. Features robust multi-factor checking, rate limiting, and session logs.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="header">
            <div className="container nav">
              <Link href="/" className="logo" id="nav-logo">
                <Shield size={22} />
                <span>Secure</span>Gate
              </Link>
              <nav className="nav-links">
                {session ? (
                  <>
                    <Link href="/dashboard" className="nav-link" id="nav-link-dashboard">
                      Dashboard
                    </Link>
                    {(session.user as any).role === "ADMIN" && (
                      <Link href="/admin" className="nav-link" id="nav-link-admin">
                        Admin Portal
                      </Link>
                    )}
                    <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                      {session.user?.email}
                    </span>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="nav-link" id="nav-link-login">
                      Login
                    </Link>
                    <Link href="/auth/register" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "14px" }} id="nav-btn-signup">
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </main>
          <footer style={{ borderTop: "1px solid var(--border-color)", padding: "24px 0", textAlign: "center", fontSize: "13px", color: "var(--text-muted)", backgroundColor: "var(--bg-color)" }}>
            <div className="container">
              <p>&copy; {new Date().getFullYear()} SecureGate. Designed for extreme resilience.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
