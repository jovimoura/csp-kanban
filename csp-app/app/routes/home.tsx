import { Link } from "react-router";

import type { Route } from "./+types/home";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | CSP Kanban" },
    { name: "description", content: "Painel inicial do CSP Kanban." },
  ];
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-medium tracking-tight">Home</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Acompanhe tarefas e usuários do kanban.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/tasks">
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Ver lista de tarefas e cadastrar novas.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to="/users">
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Ver usuários e cadastrar novos.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
