import { Link } from "react-router";

import type { Route } from "./+types/users.new";
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Novo usuário | CSP Kanban" },
    { name: "description", content: "Cadastro de um novo usuário." },
  ];
}

export default function NewUser() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <p className="text-sm text-muted-foreground">
        <Link to="/users" className="hover:underline">
          Users
        </Link>{" "}
        / Novo
      </p>
      <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight">
        Cadastro de usuário
      </h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dados do usuário</CardTitle>
        </CardHeader>
        <form>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile">Perfil</Label>
              <Select name="profile" defaultValue="developer">
                <SelectTrigger id="profile" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="agile">Agile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" asChild>
              <Link to="/users">Cancelar</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
