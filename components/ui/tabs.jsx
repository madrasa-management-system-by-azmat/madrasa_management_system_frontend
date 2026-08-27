"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />;
}

function TabsList({ className, ...props }) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("inline-flex h-10 w-full items-center justify-start gap-1 overflow-x-auto rounded-xl bg-muted p-1 text-muted-foreground", className)} {...props} />;
}

function TabsTrigger({ className, ...props }) {
  return <TabsPrimitive.Tab data-slot="tabs-trigger" className={cn("inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium whitespace-nowrap outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-sm disabled:pointer-events-none disabled:opacity-50", className)} {...props} />;
}

function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
