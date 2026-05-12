"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      const target = session?.user ? "/dashboard" : "/login";

      // Mulai fade-out 400ms sebelum navigate
      setTimeout(() => {
        setDestination(target);
        setFadeOut(true);
      }, 2100);
    };

    checkSession();
  }, []);

  // Navigasi setelah animasi fade-out selesai
  useEffect(() => {
    if (fadeOut && destination) {
      const timer = setTimeout(() => {
        router.push(destination);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, destination, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Overlay fade-out */}
      <div
        className="fixed inset-0 bg-background z-50 pointer-events-none transition-opacity duration-400"
        style={{ opacity: fadeOut ? 1 : 0 }}
      />

      <div
        className="text-center space-y-6"
        style={{ animation: "splashFadeUp 0.6s ease-out forwards" }}
      >
        {/* Icon dengan animasi scale-in */}
        <div
          className="mx-auto size-24 rounded-3xl overflow-hidden shadow-2xl"
          style={{ animation: "splashScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
          <Image
            src="/icons/67e6b4f1-88fd-4de3-82b4-d316de92c5d1.jpg"
            alt="Nabungin AI"
            width={96}
            height={96}
            className="object-cover"
            priority
          />
        </div>

        {/* Teks dengan animasi fade-in delay */}
        <div
          className="space-y-2"
          style={{ animation: "splashFadeUp 0.6s ease-out 0.2s both" }}
        >
          <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Nabungin.AI
          </h1>
          <p className="text-muted-foreground">Smart Financial Goal Tracker</p>
        </div>

        {/* Loading dots */}
        <div
          className="flex items-center justify-center gap-1.5"
          style={{ animation: "splashFadeUp 0.6s ease-out 0.4s both" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-emerald-400"
              style={{
                animation: `splashDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
