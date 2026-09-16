import { type FormEvent, useState } from "react";
import { redirect, useNavigate, useNavigation, useSubmit } from "react-router";

import type { Route } from "./+types/users.new";
import { FormPage, RequiredLabel } from "@/components/layout/form-page";
import { FieldError } from "@/components/forms/field-error";
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
import { createUser } from "@/lib/api/resources";
import { requireUser } from "@/lib/session.server";
import { can } from "@/lib/permissions";
import { USER_PROFILES, type UserProfile } from "@/lib/types";

const NAME_PATTERN = /^[\p{L}\s]+$/u;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro de Usuário | CSP Tech" },
    { name: "description", content: "Cadastro de um novo usuário." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { user } = await requireUser(request);
  if (!can(user.profile, "createUser")) {
    throw redirect("/");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { token, user } = await requireUser(request);
  if (!can(user.profile, "createUser")) {
    return { formError: "Você não tem permissão para cadastrar usuários." };
  }

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const profile = String(formData.get("profile") ?? "") as UserProfile;

  try {
    await createUser(token, { name, profile });
    return redirect("/users");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao salvar o usuário.";
    return { formError: message };
  }
}

type Errors = Partial<Record<"name" | "profile", string>>;

export default function NewUser({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  const [name, setName] = useState("");
  const [profile, setProfile] = useState<UserProfile | "">("");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) {
      next.name = "O nome é obrigatório.";
    } else if (!NAME_PATTERN.test(name.trim())) {
      next.name = "O nome deve conter apenas letras.";
    }
    if (!profile) next.profile = "O perfil é obrigatório.";
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("profile", profile);
    submit(formData, { method: "post" });
  }

  return (
    <FormPage
      title="Cadastro de Usuário"
      crumbs={[
        { label: "Início", to: "/" },
        { label: "Usuários", to: "/users" },
        { label: "Novo" },
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <RequiredLabel htmlFor="name">Nome</RequiredLabel>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) =>
              // Only allow letters (with/without accents) and spaces.
              setName(event.target.value.replace(/[^\p{L}\s]/gu, ""))
            }
            placeholder="Digite o nome do usuário"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="profile">Perfil</RequiredLabel>
          <Select
            name="profile"
            value={profile || undefined}
            onValueChange={(value) => setProfile(value as UserProfile)}
          >
            <SelectTrigger
              id="profile"
              className="w-full"
              aria-invalid={Boolean(errors.profile)}
            >
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
          <FieldError message={errors.profile} />
        </div>

        {actionData?.formError ? (
          <p className="text-sm text-destructive">{actionData.formError}</p>
        ) : null}

        <div className="flex min-h-52 items-end justify-end gap-3 pt-6">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </FormPage>
  );
}
