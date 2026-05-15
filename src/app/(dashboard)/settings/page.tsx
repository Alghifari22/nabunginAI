import { Bot, Moon, Shield, User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "../../components/shared/page-container";
import { SectionHeader } from "../../components/shared/section-header";
import { ProfileForm } from "../../features/settings/components/profile-form";
import { PasswordForm } from "../../features/settings/components/password-form";
import { ThemeToggle } from "../../features/settings/components/theme-toggle";
import { LogoutButton } from "@/components/ui/logout-button";

function SettingsCard({
  icon,
  iconBg,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border bg-background/70 backdrop-blur-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className={`size-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Separator />
      {children}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <PageContainer className="max-w-2xl">
      <SectionHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {/* Profile */}
      <SettingsCard
        icon={<User2 className="size-5" />}
        iconBg="bg-primary/10"
        title="Profile"
        description="Update your account information"
      >
        <ProfileForm
          initialName={session.user?.name ?? ""}
          email={session.user?.email ?? ""}
        />
      </SettingsCard>

      {/* Appearance */}
      <SettingsCard
        icon={<Moon className="size-5" />}
        iconBg="bg-cyan-500/10"
        title="Appearance"
        description="Choose your preferred theme"
      >
        <div className="space-y-3">
          <p className="text-sm font-medium">Theme</p>
          <ThemeToggle />
        </div>
      </SettingsCard>

      {/* AI Preferences */}
      <SettingsCard
        icon={<Bot className="size-5" />}
        iconBg="bg-emerald-500/10"
        title="AI Preferences"
        description="Customize your AI assistant"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">AI Financial Assistant</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get smart insights and chat with your financial AI
            </p>
          </div>
          {/* Static toggle — AI is always enabled in current architecture */}
          <div className="h-6 w-11 rounded-full bg-emerald-500 relative shrink-0">
            <div className="absolute right-1 top-1 size-4 rounded-full bg-white" />
          </div>
        </div>
      </SettingsCard>

      {/* Security */}
      <SettingsCard
        icon={<Shield className="size-5" />}
        iconBg="bg-orange-500/10"
        title="Security"
        description="Manage your account security"
      >
        <PasswordForm />
      </SettingsCard>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sign out from your account on this device
          </p>
        </div>
        <LogoutButton />
      </div>
    </PageContainer>
  );
}
