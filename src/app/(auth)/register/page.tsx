import { AuthCard } from "../../features/auth/components/auth-card";

import { RegisterForm } from "../../features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-muted/40
        p-4
      "
    >
      <AuthCard>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Create Account
            </h1>

            <p className="text-muted-foreground">
              Start your financial journey
            </p>
          </div>

          <RegisterForm />
        </div>
      </AuthCard>
    </div>
  );
}