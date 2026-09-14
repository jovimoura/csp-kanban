import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import type { Route } from "./+types/tasks.new";
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
import { Textarea } from "@/components/ui/textarea";
import { useMockStore } from "@/lib/mocks/store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro de Demanda | CSP Tech" },
    { name: "description", content: "Cadastro de uma nova demanda." },
  ];
}

export default function NewTask() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("id");

  return <TaskForm key={taskId ?? "new"} taskId={taskId} />;
}

function TaskForm({ taskId }: { taskId: string | null }) {
  const navigate = useNavigate();
  const { users, tasks, addTask, updateTask } = useMockStore();
  const editing = useMemo(
    () => tasks.find((task) => task.id === taskId),
    [tasks, taskId],
  );

  const [title, setTitle] = useState(editing?.title ?? "");
  const [assignedTo, setAssignedTo] = useState(editing?.assignedTo ?? "");
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !assignedTo || !dueDate || !description.trim()) return;

    if (editing) {
      updateTask(editing.id, {
        title: title.trim(),
        assignedTo,
        dueDate,
        description: description.trim(),
      });
    } else {
      addTask({
        title: title.trim(),
        assignedTo,
        dueDate,
        description: description.trim(),
      });
    }

    navigate("/");
  }

  return (
    <FormPage
      title={editing ? "Editar Demanda" : "Cadastro de Demanda"}
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Demandas", to: "/tasks" },
        { label: editing ? "Editar" : "Novo" },
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <RequiredLabel htmlFor="title">Título</RequiredLabel>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Digite o título da demanda"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="assignedTo">Responsável</RequiredLabel>
          <Select
            name="assignedTo"
            value={assignedTo || undefined}
            onValueChange={setAssignedTo}
            required
          >
            <SelectTrigger id="assignedTo" className="w-full">
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="dueDate">Prazo</RequiredLabel>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
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
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" type="button" asChild>
            <Link to="/">Cancelar</Link>
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </FormPage>
  );
}
