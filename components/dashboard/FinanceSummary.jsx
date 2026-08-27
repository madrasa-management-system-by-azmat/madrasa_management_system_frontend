import { ArrowDownLeft, ArrowUpLeft, WalletCards } from "lucide-react";

const transactions = [
  { label: "فیس وصولی", amount: "245,000 روپے", time: "آج، 10:30 صبح", incoming: true },
  { label: "راشن کی خریداری", amount: "48,500 روپے", time: "آج، 9:15 صبح", incoming: false },
  { label: "عطیہ موصول", amount: "100,000 روپے", time: "کل، 4:45 شام", incoming: true },
];

export default function FinanceSummary() {
  return (
    <section id="finance" className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">مالی خلاصہ</h2>
          <p className="mt-1 text-sm text-muted-foreground">اس ماہ کی آمدن و اخراجات</p>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-success/10 text-success">
          <WalletCards className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-muted p-4">
        <p className="text-sm text-muted-foreground">دستیاب بیلنس</p>
        <p className="mt-1 text-2xl font-bold">23.60 لاکھ روپے</p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <div>
            <p className="text-muted-foreground">آمدن</p>
            <p className="mt-1 font-bold text-success">+ 8.45 لاکھ</p>
          </div>
          <div className="border-r border-border pr-3">
            <p className="text-muted-foreground">اخراجات</p>
            <p className="mt-1 font-bold text-destructive">− 3.21 لاکھ</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {transactions.map(({ label, amount, time, incoming }) => {
          const Icon = incoming ? ArrowDownLeft : ArrowUpLeft;
          const tone = incoming ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";

          return (
            <div key={`${label}-${time}`} className="flex items-center gap-3">
              <div className={`grid size-9 shrink-0 place-items-center rounded-lg ${tone}`}>
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold">{amount}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
