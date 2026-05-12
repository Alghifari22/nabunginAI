"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/auth/session");

      const session = await response.json();

      setTimeout(() => {
        if (session?.user) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }, 2500);
    };

    checkSession();
  }, [router]);

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-background
        overflow-hidden
      "
    >
      <div className="text-center space-y-6">
        <div
          className="
            mx-auto
            size-24
            rounded-3xl
            overflow-hidden
            shadow-2xl
            animate-[pulse_2s_infinite]
          "
        >
          <Image
            src="/icons/app-icon.png"
            alt="Nabungin AI"
            width={96}
            height={96}
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-2">
          <h1
            className="
              text-4xl
              font-bold
              bg-gradient-to-r
              from-emerald-400
              to-cyan-400
              bg-clip-text
              text-transparent
            "
          >
            Nabungin.AI
          </h1>

          <p className="text-muted-foreground">Smart Financial Goal Tracker</p>
        </div>
      </div>
    </main>
  );
}
