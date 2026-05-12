import {
  Bot,
  LogOut,
  Moon,
  Shield,
  User2,
} from "lucide-react";

import { authOptions } from "../../lib/auth";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { signOut } from "next-auth/react";

import { LogoutButton } from "@/components/ui/logout-button";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main
      className="
        max-w-3xl
        mx-auto
        space-y-6
      "
    >
      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Manage your account and app
          preferences
        </p>
      </div>

      {/* PROFILE */}

      <Card
        className="
          rounded-3xl
          border
          bg-background/70
          backdrop-blur-xl
          p-6
          space-y-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              size-12
              rounded-2xl
              bg-primary/10
              flex
              items-center
              justify-center
            "
          >
            <User2 className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Profile
            </h2>

            <p className="text-sm text-muted-foreground">
              Your account information
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Name
            </p>

            <p className="font-medium">
              {session.user?.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="font-medium">
              {session.user?.email}
            </p>
          </div>
        </div>
      </Card>

      {/* AI SETTINGS */}

      <Card
        className="
          rounded-3xl
          border
          bg-background/70
          backdrop-blur-xl
          p-6
          space-y-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              size-12
              rounded-2xl
              bg-emerald-500/10
              flex
              items-center
              justify-center
            "
          >
            <Bot className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              AI Preferences
            </h2>

            <p className="text-sm text-muted-foreground">
              Customize your AI assistant
            </p>
          </div>
        </div>

        <Separator />

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <p className="font-medium">
              AI Assistant
            </p>

            <p className="text-sm text-muted-foreground">
              Enable smart financial
              assistance
            </p>
          </div>

          <div
            className="
              h-6
              w-11
              rounded-full
              bg-emerald-500
              relative
            "
          >
            <div
              className="
                absolute
                right-1
                top-1
                size-4
                rounded-full
                bg-white
              "
            />
          </div>
        </div>
      </Card>

      {/* APPEARANCE */}

      <Card
        className="
          rounded-3xl
          border
          bg-background/70
          backdrop-blur-xl
          p-6
          space-y-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              size-12
              rounded-2xl
              bg-cyan-500/10
              flex
              items-center
              justify-center
            "
          >
            <Moon className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Appearance
            </h2>

            <p className="text-sm text-muted-foreground">
              Customize app appearance
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="font-medium">
            Theme
          </p>

          <p className="text-sm text-muted-foreground">
            System
          </p>
        </div>
      </Card>

      {/* SECURITY */}

      <Card
        className="
          rounded-3xl
          border
          bg-background/70
          backdrop-blur-xl
          p-6
          space-y-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              size-12
              rounded-2xl
              bg-orange-500/10
              flex
              items-center
              justify-center
            "
          >
            <Shield className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Security
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage account security
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Button
            variant="outline"
            className="
              w-full
              justify-start
              rounded-2xl
              h-11
            "
          >
            Change Password
          </Button>
        </div>
      </Card>

      {/* DANGER ZONE */}

      <Card
        className="
          rounded-3xl
          border-red-500/20
          bg-red-500/5
          backdrop-blur-xl
          p-6
          space-y-6
        "
      >
        <div>
          <h2 className="font-semibold text-red-500">
            Danger Zone
          </h2>

          <p className="text-sm text-muted-foreground">
            Logout from your account
          </p>
        </div>

        <LogoutButton />
      </Card>
    </main>
  );
}