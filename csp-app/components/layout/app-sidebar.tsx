import { LayoutGrid, ClipboardList, Users } from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Kanban", icon: LayoutGrid, end: true },
  { to: "/tasks", label: "Demandas", icon: ClipboardList, end: false },
  { to: "/users", label: "Usuários", icon: Users, end: false },
];

export function AppSidebar() {
  return (
    <aside className="flex w-52 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <p className="font-heading text-xl font-semibold tracking-tight">
          CSP Tech
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
