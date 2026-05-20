"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import React from "react";

interface SignOutButtonProps {
  id?: string;
  className?: string;
}

export function SignOutButton({ id = "dashboard-logout-btn", className = "btn btn-secondary" }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className={className}
      style={{ display: "inline-flex", alignItems: "center" }}
      id={id}
    >
      <LogOut size={16} style={{ marginRight: "8px" }} /> Sign Out
    </button>
  );
}
