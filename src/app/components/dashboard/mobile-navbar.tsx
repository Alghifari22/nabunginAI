"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  PiggyBank,
  Wallet,
  Bot,
} from "lucide-react";

const menus = [
  {
    label: "Home",
    icon: LayoutDashboard,
    href: "/dashboard",
  },

  {
    label: "Goals",
    icon: PiggyBank,
    href: "/goals",
  },

  {
    label: "Finance",
    icon: Wallet,
    href: "/finance",
  },

  {
    label: "AI",
    icon: Bot,
    href: "/dashboard",
  },
];

export function MobileNavbar() {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        z-50
        border-t
        bg-background/80
        backdrop-blur-xl
        md:hidden
      "
    >
      <div className="grid grid-cols-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="
                flex flex-col items-center
                justify-center gap-1
                py-3 text-xs
              "
            >
              <Icon
                className={
                  active
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                }
                size={22}
              />

              <span
                className={
                  active
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                }
              >
                {menu.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}