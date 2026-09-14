import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { formatDueDate, STATUS_META } from "@/lib/format";
import { useMockStore } from "@/lib/mocks/store";

export function TaskDetailsDialog({
  taskId,
  onClose,
}: {
  taskId: string | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { tasks, users, removeTask } = useMockStore();
  const task = tasks.find((item) => item.id === taskId);
  const assignee = task
    ? users.find((user) => user.id === task.assignedTo)
    : undefined;
  const meta = task ? STATUS_META[task.status] : null;

  function handleDelete() {
    if (!task) return;
    removeTask(task.id);
    onClose();
  }

  function handleEdit() {
    if (!task) return;
    onClose();
    navigate(`/tasks/new?id=${task.id}`);
  }

  return (
    <Dialog open={Boolean(task)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="gap-0 sm:max-w-md"
        showCloseButton
      >
        <DialogHeader className="pb-4">
          <DialogTitle>Detalhes da Demanda</DialogTitle>
        </DialogHeader>

        {task && meta ? (
          <div className="space-y-4 pb-4">
            <div>
              <p className="text-xs text-muted-foreground">Título</p>
              <p className="mt-1 text-sm font-medium">{task.title}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Responsável</p>
              <div className="mt-1.5 flex items-center gap-2">
                {assignee ? (
                  <>
                    <UserAvatar name={assignee.name} />
                    <span className="text-sm">{assignee.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Sem responsável
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className={`mt-1.5 ${meta.badgeClass}`}>{meta.label}</Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Prazo</p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Calendar className="size-4" />
                {formatDueDate(task.dueDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Descrição</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                {task.description}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter className="border-0 bg-transparent sm:justify-stretch">
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil data-icon="inline-start" />
              Editar
            </Button>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 data-icon="inline-start" />
              Excluir
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
