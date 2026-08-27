import Link from "next/link";
import { ChevronRight, UserPlus } from "lucide-react";

export default function AddStudentHeader() {
  return (
    <section>
      <Link
        href="/dashboard/students"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
        طلبہ کی فہرست پر واپس جائیں
      </Link>
      <div className="mt-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <UserPlus className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">نیا طالب علم شامل کریں</h1>
          <p className="mt-2 text-sm text-muted-foreground">طالب علم کا بنیادی، تعلیمی اور رہائشی ریکارڈ درج کریں۔</p>
        </div>
      </div>
    </section>
  );
}
