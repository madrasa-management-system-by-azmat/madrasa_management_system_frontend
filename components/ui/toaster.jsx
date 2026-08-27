"use client";

import { CheckCircle2, CircleAlert, Info, X, XCircle } from "lucide-react";
import { Toast } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";
import { toastManager } from "@/lib/toast";

const typeStyles = {
  error: "border-destructive/35 text-destructive",
  info: "border-info/35 text-info",
  success: "border-success/35 text-success",
  warning: "border-warning/35 text-warning",
};

const typeIcons = {
  error: XCircle,
  info: Info,
  success: CheckCircle2,
  warning: CircleAlert,
};

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed left-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 outline-none sm:left-6 sm:top-6">
        {toasts.map((toastItem) => {
          const Icon = typeIcons[toastItem.type] || Info;

          return (
            <Toast.Root key={toastItem.id} toast={toastItem} className="rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg">
              <Toast.Content className="flex items-start gap-3">
                <Icon className={cn("mt-0.5 size-5 shrink-0", typeStyles[toastItem.type] || typeStyles.info)} aria-hidden="true" />
                <div className="min-w-0 flex-1"><Toast.Title className="text-sm font-bold" /><Toast.Description className="mt-1 text-xs leading-5 text-muted-foreground" /></div>
                <Toast.Close className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Close"><X className="size-4" aria-hidden="true" /></Toast.Close>
              </Toast.Content>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export default function Toaster() {
  return <Toast.Provider toastManager={toastManager} timeout={5000} limit={3}><ToastList /></Toast.Provider>;
}
