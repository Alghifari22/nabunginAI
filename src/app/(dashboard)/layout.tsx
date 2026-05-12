import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "../lib/auth";

import { Sidebar } from "../components/dashboard/sidebar";

import { MobileNavbar } from "../components/dashboard/mobile-navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileNavbar />

        <main className="flex-1 p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}