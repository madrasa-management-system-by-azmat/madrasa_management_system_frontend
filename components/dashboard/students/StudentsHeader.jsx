import { Plus, UsersRound } from "lucide-react";
import Link from "next/link";

import PrintStudentsListButton from "@/components/dashboard/students/PrintStudentsListButton";

const text = {
  add: "\u0646\u06CC\u0627 \u0637\u0627\u0644\u0628 \u0639\u0644\u0645",
  description:
    "\u062A\u0645\u0627\u0645 \u0637\u0644\u0628\u06C1 \u06A9\u0627 \u0631\u06CC\u06A9\u0627\u0631\u0688\u060C \u062F\u0627\u062E\u0644\u06C1 \u0627\u0648\u0631 \u062A\u0639\u0644\u06CC\u0645\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u06CC\u06A9 \u062C\u06AF\u06C1\u06D4",
  management:
    "\u0637\u0644\u0628\u06C1 \u06A9\u0627 \u0627\u0646\u062A\u0638\u0627\u0645",
  title: "\u0637\u0644\u0628\u06C1",
};

export default function StudentsHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <UsersRound className="size-4" aria-hidden="true" />
          <span>{text.management}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {text.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <PrintStudentsListButton />
        <Link
          href="/dashboard/students/add"
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
        >
          <Plus aria-hidden="true" />
          {text.add}
        </Link>
      </div>
    </section>
  );
}
