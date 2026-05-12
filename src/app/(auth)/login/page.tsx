import { AuthCard } from "../../features/auth/components/auth-card";

import { LoginForm } from "../../features/auth/components/login-form";

export default function LoginPage() {
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
              Welcome Back
            </h1>

            <p className="text-muted-foreground">
              Login to continue
            </p>
          </div>

          <LoginForm />
        </div>
      </AuthCard>
    </div>
  );
}