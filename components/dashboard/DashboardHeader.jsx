import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
          <span>3 صفر 1448ھ</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">السلام علیکم، محمد احمد</h1>
        <p className="mt-2 text-sm text-muted-foreground">یہاں آج کے مدرسہ کے اہم امور کا خلاصہ ہے۔</p>
      </div>
      <Button type="button" size="lg" className="w-full sm:w-auto">
        <Plus aria-hidden="true" />
        نیا داخلہ
      </Button>
    </section>
  );
}
