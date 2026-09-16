import { useRef, useState } from "react";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type { Task, User } from "@/lib/types";

export function TaskDetailsDialog({
  taskId,
  tasks,
  users,
  canEdit,
  canDelete,
  onDelete,
  onClose,
}: {
  taskId: string | null;
  tasks: Task[];
  users: User[];
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmOpenRef = useRef(false);
  const task = tasks.find((item) => item.id === taskId);
  const assignee = task
    ? users.find((user) => user.id === task.assignedTo)
    : undefined;
  const meta = task ? STATUS_META[task.status] : null;

  function setConfirm(open: boolean) {
    confirmOpenRef.current = open;
    setConfirmOpen(open);
  }

  function handleConfirmDelete() {
    if (!task) return;
    setConfirm(false);
    onDelete(task.id);
  }

  function handleEdit() {
    if (!task) return;
    setConfirm(false);
    onClose();
    navigate(`/tasks/new?id=${task.id}`);
  }

  function handleDetailsOpenChange(open: boolean) {
    if (open || confirmOpenRef.current) return;
    onClose();
  }

  const showActions = canEdit || canDelete;

  return (
    <>
      <Dialog
        open={Boolean(task) && !confirmOpen}
        onOpenChange={handleDetailsOpenChange}
      >
        <DialogContent className="gap-0 sm:max-w-md" showCloseButton>
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

          {showActions ? (
            <DialogFooter className="border-0 bg-transparent sm:justify-stretch">
              <div className="flex w-full gap-3">
                {canEdit ? (
                  <Button variant="outline" className="flex-1" onClick={handleEdit}>
                    <Pencil data-icon="inline-start" />
                    Editar
                  </Button>
                ) : null}
                {canDelete ? (
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setConfirm(true)}
                  >
                    <Trash2 data-icon="inline-start" />
                    Excluir
                  </Button>
                ) : null}
              </div>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir demanda?</AlertDialogTitle>
            <AlertDialogDescription>
              {task
                ? `Tem certeza que deseja excluir “${task.title}”? Esta ação não pode ser desfeita.`
                : "Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
