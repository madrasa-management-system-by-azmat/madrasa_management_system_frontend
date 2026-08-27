"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const inputClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50";
const genericError =
  "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0645\u062D\u0641\u0648\u0638 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u06CC\u06D4";

function getErrorMessage(error) {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return genericError;
  return (
    Object.values(data)
      .flat()
      .find((value) => typeof value === "string") || genericError
  );
}

export default function AcademicReferenceDialog({
  open,
  onOpenChange,
  record,
  title,
  description,
  fields,
  submitLabel,
  cancelLabel,
  isPending,
  error,
  onSubmit,
}) {
  async function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      // API errors are rendered in the dialog.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form key={record?.id || "new"} onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-5">
            {fields.map((field) => (
              <label
                key={field.name}
                className="grid gap-2 text-right text-sm font-medium"
              >
                <span>
                  {field.label}
                  {field.required && (
                    <span className="mr-1 font-mono text-destructive">*</span>
                  )}
                </span>
                {field.type === "select" ? (
                  <select
                    className={inputClassName}
                    name={field.name}
                    defaultValue={record?.[field.name] ?? ""}
                    required={field.required}
                  >
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={inputClassName}
                    name={field.name}
                    type={field.type || "text"}
                    min={field.min}
                    step={field.step}
                    defaultValue={record?.[field.name] ?? ""}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </label>
            ))}
            {error && (
              <p
                className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {getErrorMessage(error)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save aria-hidden="true" />
              {isPending ? "..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
