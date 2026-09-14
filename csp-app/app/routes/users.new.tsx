import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";

import type { Route } from "./+types/users.new";
import { FormPage, RequiredLabel } from "@/components/layout/form-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROFILE_LABELS } from "@/lib/format";
import { useMockStore } from "@/lib/mocks/store";
import { USER_PROFILES, type UserProfile } from "@/lib/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro de Usuário | CSP Tech" },
    { name: "description", content: "Cadastro de um novo usuário." },
  ];
}

export default function NewUser() {
  const navigate = useNavigate();
  const { addUser } = useMockStore();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<UserProfile | "">("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !profile) return;

    addUser({ name: name.trim(), profile });
    navigate("/users");
  }

  return (
    <FormPage
      title="Cadastro de Usuário"
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Usuários", to: "/users" },
        { label: "Novo" },
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <RequiredLabel htmlFor="name">Nome</RequiredLabel>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Digite o nome do usuário"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="profile">Perfil</RequiredLabel>
          <Select
            name="profile"
            value={profile || undefined}
            onValueChange={(value) => setProfile(value as UserProfile)}
            required
          >
            <SelectTrigger id="profile" className="w-full">
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              {USER_PROFILES.map((item) => (
                <SelectItem key={item} value={item}>
                  {PROFILE_LABELS[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-h-52 items-end justify-end gap-3 pt-6">
          <Button variant="outline" type="button" asChild>
            <Link to="/users">Cancelar</Link>
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </FormPage>
  );
}
