"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const text = {
  cancel: "\u0645\u0646\u0633\u0648\u062E",
  delete: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u062D\u0630\u0641 \u06A9\u0631\u06CC\u06BA",
  description: "\u06A9\u06CC\u0627 \u0622\u067E \u06CC\u0642\u06CC\u0646\u0627\u064B \u0627\u0633 \u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u062D\u0630\u0641 \u06A9\u0631\u0646\u0627 \u0686\u0627\u06C1\u062A\u06D2 \u06C1\u06CC\u06BA\u061F \u0627\u0633 \u0639\u0645\u0644 \u06A9\u0648 \u0648\u0627\u067E\u0633 \u0646\u06C1\u06CC\u06BA \u0644\u06CC\u0627 \u062C\u0627 \u0633\u06A9\u062A\u0627\u06D4",
  title: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u062D\u0630\u0641 \u06A9\u0631\u06CC\u06BA",
};

export default function DeleteStudentDialog({ student, open, onOpenChange, isPending, onDelete }) {
  async function handleDelete() {
    await onDelete();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{text.title}</DialogTitle><DialogDescription>{text.description}</DialogDescription></DialogHeader>
        <div className="px-5 py-5"><div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="size-5 shrink-0" aria-hidden="true" /><span>{student?.full_name}</span></div></div>
        <DialogFooter><Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>{text.cancel}</Button><Button type="button" variant="destructive" disabled={isPending} onClick={handleDelete}><Trash2 aria-hidden="true" />{isPending ? "..." : text.delete}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
