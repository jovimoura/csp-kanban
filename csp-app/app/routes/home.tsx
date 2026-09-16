import { Link } from "react-router";
import { LayoutGrid, ClipboardPlus, UserPlus, type LucideIcon } from "lucide-react";

import type { Route } from "./+types/home";
import { useAppContext } from "./_app";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Início | CSP Tech" },
    { name: "description", content: "Painel inicial da CSP Tech." },
  ];
}

type HubOption = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  visible: boolean;
};

export default function Home() {
  const { user } = useAppContext();

  const options: HubOption[] = [
    {
      to: "/kanban",
      title: "Quadro Kanban",
      description: "Acompanhe e movimente as demandas entre os status.",
      icon: LayoutGrid,
      visible: true,
    },
    {
      to: "/tasks/new",
      title: "Cadastrar Demanda",
      description: "Crie uma nova demanda para o quadro.",
      icon: ClipboardPlus,
      visible: can(user.profile, "createTask"),
    },
    {
      to: "/users/new",
      title: "Cadastrar Usuário",
      description: "Adicione um novo usuário à base.",
      icon: UserPlus,
      visible: can(user.profile, "createUser"),
    },
  ];

  const visibleOptions = options.filter((option) => option.visible);

  return (
    <main className="flex min-h-svh flex-col justify-center px-8 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground">Bem-vindo,</p>
          <h1 className="mt-1 font-heading text-4xl font-semibold tracking-tight">
            {user.name}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            O que você gostaria de fazer hoje?
          </p>
        </header>

        <div
          className={cn(
            "grid gap-4",
            visibleOptions.length >= 3
              ? "sm:grid-cols-3"
              : visibleOptions.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-1",
          )}
        >
          {visibleOptions.map((option) => (
            <Link
              key={option.to}
              to={option.to}
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary-foreground transition-colors group-hover:bg-primary/40">
                <option.icon className="size-6" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-semibold tracking-tight">
                  {option.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
