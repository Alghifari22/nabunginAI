import { AuthCard } from "../../features/auth/components/auth-card";
import { LoginForm } from "../../features/auth/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <AuthCard>
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <div className="text-2xl mb-3">💰</div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Nabungin.AI account</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground font-medium hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}