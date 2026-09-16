import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

/**
 * Date field that only accepts numbers, displayed as a dd/mm/aaaa mask.
 * The value is exposed to the form as an ISO date string (YYYY-MM-DD).
 */
export function DueDateInput({
  id,
  value,
  onChange,
  invalid,
}: {
  id?: string;
  value: string;
  onChange: (isoDate: string) => void;
  invalid?: boolean;
}) {
  const [text, setText] = useState(() => isoToMasked(value));

  useEffect(() => {
    setText(isoToMasked(value));
  }, [value]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
    setText(maskDigits(digits));

    if (digits.length === 8) {
      onChange(digitsToIso(digits));
    } else {
      onChange("");
    }
  }

  return (
    <Input
      id={id}
      inputMode="numeric"
      autoComplete="off"
      placeholder="dd/mm/aaaa"
      value={text}
      onChange={handleChange}
      aria-invalid={invalid}
    />
  );
}

function maskDigits(digits: string): string {
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
}

function digitsToIso(digits: string): string {
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (month < 1 || month > 12 || day < 1 || day > 31) return "";

  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return iso;
}

function isoToMasked(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}
