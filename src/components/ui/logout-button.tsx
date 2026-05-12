"use client";

import { LogOut } from "lucide-react";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="destructive"
      className="
        w-full
        rounded-2xl
        h-11
      "
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
    >
      <LogOut className="size-4 mr-2" />

      Logout
    </Button>
  );
}