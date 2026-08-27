"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <DialogPrimitive.Popup data-slot="dialog-content" className={cn("w-full max-w-lg rounded-xl border border-border bg-popover text-popover-foreground shadow-xl outline-none", className)} {...props}>
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }) {
  return <div data-slot="dialog-header" className={cn("space-y-1.5 border-b border-border px-5 py-4", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-start", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-base font-bold", className)} {...props} />;
}

function DialogDescription({ className, ...props }) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle };
