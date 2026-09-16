import { type FormEvent, useState } from "react";
import { redirect, useNavigate, useNavigation, useSubmit } from "react-router";

import type { Route } from "./+types/tasks.new";
import { FormPage, RequiredLabel } from "@/components/layout/form-page";
import { AssigneeCombobox } from "@/components/forms/assignee-combobox";
import { DueDateInput } from "@/components/forms/due-date-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTask, listTasks, listUsers, updateTask } from "@/lib/api/resources";
import { requireUser } from "@/lib/session.server";
import { can } from "@/lib/permissions";
import { FieldError } from "@/components/forms/field-error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro de Demanda | CSP Tech" },
    { name: "description", content: "Cadastro de uma nova demanda." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { token, user } = await requireUser(request);
  const url = new URL(request.url);
  const taskId = url.searchParams.get("id");

  const editing = Boolean(taskId);
  const requiredAction = editing ? "editTask" : "createTask";
  if (!can(user.profile, requiredAction)) {
    throw redirect("/kanban");
  }

  const [users, tasks] = await Promise.all([
    listUsers({ token, assignable: true }),
    editing ? listTasks(token) : Promise.resolve([]),
  ]);

  const task = taskId ? tasks.find((item) => item.id === taskId) ?? null : null;
  if (editing && !task) {
    throw redirect("/kanban");
  }

  return { users, task };
}

export async function action({ request }: Route.ActionArgs) {
  const { token, user } = await requireUser(request);
  const formData = await request.formData();

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    dueDate: String(formData.get("dueDate") ?? ""),
    assignedTo: String(formData.get("assignedTo") ?? ""),
  };

  const requiredAction = id ? "editTask" : "createTask";
  if (!can(user.profile, requiredAction)) {
    return { formError: "Você não tem permissão para esta ação." };
  }

  try {
    if (id) {
      await updateTask(token, id, payload);
    } else {
      await createTask(token, payload);
    }
    return redirect("/kanban");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao salvar a demanda.";
    return { formError: message };
  }
}

type Errors = Partial<Record<"title" | "assignedTo" | "dueDate" | "description", string>>;

export default function NewTask({ loaderData, actionData }: Route.ComponentProps) {
  const { users, task } = loaderData;
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  const [title, setTitle] = useState(task?.title ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const next: Errors = {};
    if (!title.trim()) next.title = "O título é obrigatório.";
    if (!assignedTo) next.assignedTo = "O responsável é obrigatório.";
    if (!dueDate) next.dueDate = "A data é obrigatória.";
    if (!description.trim()) next.description = "A descrição é obrigatória.";
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const formData = new FormData();
    if (task) formData.set("id", task.id);
    formData.set("title", title.trim());
    formData.set("assignedTo", assignedTo);
    formData.set("dueDate", dueDate);
    formData.set("description", description.trim());
    submit(formData, { method: "post" });
  }

  return (
    <FormPage
      title={task ? "Editar Demanda" : "Cadastro de Demanda"}
      crumbs={[
        { label: "Início", to: "/" },
        { label: "Kanban", to: "/kanban" },
        { label: task ? "Editar" : "Nova Demanda" },
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <RequiredLabel htmlFor="title">Título</RequiredLabel>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Digite o título da demanda"
            aria-invalid={Boolean(errors.title)}
          />
          <FieldError message={errors.title} />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="assignedTo">Responsável</RequiredLabel>
          <AssigneeCombobox
            id="assignedTo"
            users={users}
            value={assignedTo}
            onChange={setAssignedTo}
            invalid={Boolean(errors.assignedTo)}
          />
          <FieldError message={errors.assignedTo} />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="dueDate">Prazo</RequiredLabel>
          <DueDateInput
            id="dueDate"
            value={dueDate}
            onChange={setDueDate}
            invalid={Boolean(errors.dueDate)}
          />
          <FieldError message={errors.dueDate} />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="description">Descrição</RequiredLabel>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreva os detalhes da demanda"
            rows={4}
            aria-invalid={Boolean(errors.description)}
          />
          <FieldError message={errors.description} />
        </div>

        {actionData?.formError ? (
          <p className="text-sm text-destructive">{actionData.formError}</p>
        ) : null}

        <div className="flex justify-end gap-3 pt-6">
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
