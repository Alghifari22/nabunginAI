"use client";

import {
  LayoutDashboard,
  PiggyBank,
  Wallet,
  Bot,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Goals",
    icon: PiggyBank,
    href: "/goals",
  },
  {
    title: "Finance",
    icon: Wallet,
    href: "/finance",
  },
  {
    title: "AI Assistant",
    icon: Bot,
    href: "/ai",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col shrink-0 w-64 h-screen sticky top-0 border-r bg-background/80 backdrop-blur-xl p-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Nabungin.AI</h1>
      </div>

      <nav className="space-y-1 flex-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;

          return (
            <Link
              key={menu.title}
              href={menu.href}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span>{menu.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
