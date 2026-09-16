import { useState } from "react";
import { Form, redirect, useNavigation } from "react-router";
import { LogIn } from "lucide-react";

import type { Route } from "./+types/login";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { PROFILE_LABELS } from "@/lib/format";
import { listUsers, signIn } from "@/lib/api/resources";
import { createUserSession, getOptionalUser } from "@/lib/session.server";
import { cn } from "@/lib/utils";

export function meta() {
  return [
    { title: "Entrar | CSP Tech" },
    { name: "description", content: "Selecione um usuário para acessar o quadro." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await getOptionalUser(request)) {
    throw redirect("/");
  }
  const users = await listUsers();
  return { users };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const userId = String(formData.get("userId") ?? "");

  if (!userId) {
    return { error: "Selecione um usuário para continuar." };
  }

  try {
    const { accessToken } = await signIn(userId);
    return redirect("/", {
      headers: { "Set-Cookie": await createUserSession(accessToken) },
    });
  } catch {
    return { error: "Não foi possível entrar. Tente novamente." };
  }
}

export default function Login({ loaderData, actionData }: Route.ComponentProps) {
  const { users } = loaderData;
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState<string>("");
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="flex min-h-svh items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-background p-8 shadow-xl">
        <div className="text-center">
          <p className="font-heading text-3xl font-semibold tracking-tight text-primary-foreground/90">
            CSP Tech
          </p>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight">
            Selecione seu usuário
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escolha um perfil para acessar o quadro de demandas.
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="userId" value={selectedId} />

          <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {users.map((user) => {
              const isSelected = selectedId === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedId(user.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/15 ring-2 ring-primary/50"
                      : "border-border bg-card hover:bg-accent",
                  )}
                >
                  <UserAvatar name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {PROFILE_LABELS[user.profile]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {actionData?.error ? (
            <p className="text-center text-sm text-destructive">{actionData.error}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedId || isSubmitting}
          >
            <LogIn data-icon="inline-start" />
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </Form>
      </div>
    </main>
  );
}
