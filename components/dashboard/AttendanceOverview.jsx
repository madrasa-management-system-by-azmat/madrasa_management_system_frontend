import { ArrowDownLeft, ArrowUpLeft, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

const attendance = [
  { day: "ہفتہ", value: 64 },
  { day: "اتوار", value: 72 },
  { day: "پیر", value: 84 },
  { day: "منگل", value: 76 },
  { day: "بدھ", value: 92 },
  { day: "جمعرات", value: 86 },
  { day: "آج", value: 89, active: true },
];

export default function AttendanceOverview() {
  return (
    <section id="attendance" className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">حاضری کا جائزہ</h2>
          <p className="mt-1 text-sm text-muted-foreground">گزشتہ سات دن کی طلبہ حاضری</p>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="مزید اختیارات">
          <MoreHorizontal />
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="flex h-48 items-end justify-between gap-2 border-b border-border pb-1" aria-label="ہفتہ وار حاضری چارٹ">
          {attendance.map(({ day, value, active }) => (
            <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="group relative flex h-40 w-full items-end justify-center">
                <div
                  className={`w-full max-w-8 rounded-t-md transition-opacity duration-200 ${active ? "bg-primary" : "bg-muted-foreground/25 group-hover:bg-muted-foreground/40"}`}
                  style={{ height: `${value}%` }}
                />
              </div>
              <span className={`text-[11px] ${active ? "font-bold text-foreground" : "text-muted-foreground"}`}>{day}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">آج کی حاضری</p>
          <p className="mt-1 text-3xl font-bold">88.6٪</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-success"><ArrowUpLeft className="size-4" />حاضر</span>
              <strong>1,106</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-destructive"><ArrowDownLeft className="size-4" />غیر حاضر</span>
              <strong>142</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
