"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DeleteAcademicReferenceDialog({ open, onOpenChange, recordName, title, description, cancelLabel, deleteLabel, isPending, error, onDelete }) {
  async function handleDelete() {
    try {
      await onDelete();
      onOpenChange(false);
    } catch {
      // API errors are rendered in the dialog.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
        <div className="space-y-3 px-5 py-5"><div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="size-5 shrink-0" aria-hidden="true" /><span>{recordName}</span></div>{error && <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error?.response?.data?.detail || "\u0631\u06CC\u06A9\u0627\u0631\u0688 \u062D\u0630\u0641 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4"}</p>}</div>
        <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{cancelLabel}</Button><Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}><Trash2 aria-hidden="true" />{isPending ? "..." : deleteLabel}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
