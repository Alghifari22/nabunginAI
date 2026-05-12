import {
  LayoutDashboard,
  PiggyBank,
  Wallet,
  Bot,
  Settings,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Goals",
    icon: PiggyBank,
  },
  {
    title: "Finance",
    icon: Wallet,
  },
  {
    title: "AI Assistant",
    icon: Bot,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r bg-card p-6 hidden md:block">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          Nabungin.AI
        </h1>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <button
              key={menu.title}
              className="
                w-full flex items-center gap-3
                rounded-xl px-4 py-3
                hover:bg-muted transition
              "
            >
              <Icon size={20} />

              <span>{menu.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}