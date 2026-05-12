"use client";

import { useRouter } from "next/navigation";

import axios from "axios";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterSchema,
} from "../schemas/register-schema";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: RegisterSchema
  ) => {
    try {
      await axios.post("/api/register", values);

      toast.success("Register success");

      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label>Name</label>

        <Input
          {...form.register("name")}
          placeholder="John Doe"
        />
      </div>

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
        Register
      </Button>
    </form>
  );
}