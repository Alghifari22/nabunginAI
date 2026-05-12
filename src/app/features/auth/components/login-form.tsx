"use client";

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  loginSchema,
  LoginSchema,
} from "../schemas/login-schema";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: LoginSchema
  ) => {
    const response = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (response?.error) {
      toast.error("Invalid credentials");

      return;
    }

    toast.success("Login success");

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label>Email</label>

        <Input
          {...form.register("email")}
          placeholder="john@mail.com"
        />
      </div>

      <div className="space-y-2">
        <label>Password</label>

        <Input
          type="password"
          {...form.register("password")}
          placeholder="******"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
}