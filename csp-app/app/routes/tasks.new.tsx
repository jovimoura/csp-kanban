import { Link } from "react-router";

import type { Route } from "./+types/tasks.new";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nova task | CSP Kanban" },
    { name: "description", content: "Cadastro de uma nova tarefa." },
  ];
}

export default function NewTask() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <p className="text-sm text-muted-foreground">
        <Link to="/tasks" className="hover:underline">
          Tasks
        </Link>{" "}
        / Nova
      </p>
      <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
        Cadastro de task
      </h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dados da task</CardTitle>
        </CardHeader>
        <form>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" required rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="not_started">
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Não iniciada</SelectItem>
                  <SelectItem value="in_progress">Em progresso</SelectItem>
                  <SelectItem value="paused">Pausada</SelectItem>
                  <SelectItem value="homolog">Homologação</SelectItem>
                  <SelectItem value="prod">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Prazo</Label>
              <Input id="dueDate" name="dueDate" type="date" required />
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" asChild>
              <Link to="/tasks">Cancelar</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
