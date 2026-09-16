import { Home, LayoutGrid, ClipboardList, Users, LogOut } from "lucide-react";
import { Form, NavLink } from "react-router";

import { UserAvatar } from "@/components/user-avatar";
import { PROFILE_LABELS } from "@/lib/format";
import { can } from "@/lib/permissions";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  end: boolean;
  visible: (user: User) => boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Início", icon: Home, end: true, visible: () => true },
  { to: "/kanban", label: "Kanban", icon: LayoutGrid, end: false, visible: () => true },
  {
    to: "/tasks",
    label: "Demandas",
    icon: ClipboardList,
    end: false,
    visible: () => true,
  },
  {
    to: "/users",
    label: "Usuários",
    icon: Users,
    end: false,
    visible: (user) => can(user.profile, "createUser"),
  },
];

export function AppSidebar({ user }: { user: User }) {
  return (
    <aside className="flex w-52 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <p className="font-heading text-xl font-semibold tracking-tight">CSP Tech</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems
          .filter((item) => item.visible(user))
          .map((item) => (
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

      <div className="border-t border-sidebar-border/40 p-3">
        <div className="flex items-center gap-2 rounded-xl px-2 py-2">
          <UserAvatar name={user.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70">
              {PROFILE_LABELS[user.profile]}
            </p>
          </div>
        </div>
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </Form>
      </div>
    </aside>
  );
}
