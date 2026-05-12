import { AuthCard } from "../../features/auth/components/auth-card";
import { RegisterForm } from "../../features/auth/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
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
            <div className="text-2xl mb-3">🚀</div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground text-sm">Start your financial journey today</p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}