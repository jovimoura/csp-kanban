import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { PROFILE_LABELS } from "@/lib/format";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Searchable dropdown for picking a responsible user. Filters as the user types
 * and shows "Usuário não encontrado" when nothing matches.
 */
export function AssigneeCombobox({
  id,
  users,
  value,
  onChange,
  placeholder = "Selecione o responsável",
  invalid,
}: {
  id?: string;
  users: User[];
  value: string;
  onChange: (userId: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = users.find((user) => user.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => user.name.toLowerCase().includes(term));
  }, [query, users]);

  const displayValue = open ? query : selected?.name ?? "";

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          autoComplete="off"
          value={displayValue}
          placeholder={placeholder}
          className="pr-9"
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (value) onChange("");
          }}
        />
        <ChevronsUpDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {open ? (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-md">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Usuário não encontrado
            </li>
          ) : (
            filtered.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(user.id);
                    setQuery("");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                    user.id === value && "bg-accent",
                  )}
                >
                  <span className="truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {PROFILE_LABELS[user.profile]}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
