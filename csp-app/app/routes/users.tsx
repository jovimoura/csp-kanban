import { Link } from "react-router";

import type { Route } from "./+types/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Users | CSP Kanban" },
    { name: "description", content: "Lista de usuários do kanban." },
  ];
}

export default function Users() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-medium tracking-tight">
              Users
            </h1>
            <Badge variant="secondary">0</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Lista de usuários do sistema.
          </p>
        </div>
        <Button asChild>
          <Link to="/users/new">Novo usuário</Link>
        </Button>
      </div>

      <Card className="mt-10 border-dashed">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Nenhum usuário cadastrado ainda.
        </CardContent>
      </Card>
    </main>
  );
}
