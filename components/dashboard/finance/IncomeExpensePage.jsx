"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  BanknoteArrowDown,
  CircleDollarSign,
  HandCoins,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateDonation,
  useCreateDonor,
  useCreateExpense,
  useCreateFund,
  useDonors,
  useFinanceLedger,
  useFunds,
} from "@/hooks/useFinance";
import { getApiErrorMessage, toast } from "@/lib/toast";
import YearlyFinanceReportButton from "@/components/dashboard/finance/YearlyFinanceReportButton";

const text = {
  title: "آمدن اور اخراجات",
  description:
    "طالب علم فیس، عطیات، تنخواہوں اور دستی اخراجات کا خودکار مالی حساب۔",
  income: "کل آمدن",
  expenses: "کل اخراجات",
  balance: "دستیاب بیلنس",
  donation: "عطیہ درج کریں",
  expense: "خرچ درج کریں",
  addFund: "فنڈ شامل کریں",
  fundName: "فنڈ کا نام",
  fundType: "فنڈ کی قسم",
  restriction: "استعمال کی شرط",
  donation: "عطیہ درج کریں",
  expense: "خرچ درج کریں",
  addDonor: "نیا عطیہ دہندہ",
  donor: "عطیہ دہندہ",
  donorName: "عطیہ دہندہ کا نام",
  phone: "موبائل نمبر",
  address: "پتہ",
  fund: "فنڈ",
  amount: "رقم (روپے)",
  date: "تاریخ",
  receipt: "رسید نمبر",
  titleField: "خرچ کا عنوان",
  notes: "نوٹس",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  transactionHistory: "مالی لین دین",
  loading: "مالی ریکارڈ لوڈ ہو رہا ہے...",
  empty: "ابھی کوئی مالی لین دین موجود نہیں۔",
  success: "ریکارڈ محفوظ ہو گیا",
  error: "عمل مکمل نہیں ہو سکا۔",
  choose: "منتخب کریں",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const today = () => new Date().toISOString().slice(0, 10);
const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function SearchableDonorField({ donors }) {
  const [query, setQuery] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMemo(() => {
    const search = query.trim().toLowerCase();
    return donors
      .filter(
        (donor) =>
          !search ||
          [donor.full_name, donor.phone].some((value) =>
            value?.toLowerCase().includes(search),
          ),
      )
      .slice(0, 30);
  }, [donors, query]);

  return (
    <label className="grid gap-2 text-right text-sm font-medium">
      {text.donor}
      <input type="hidden" name="donor" value={selectedDonorId} />
      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          role="combobox"
          aria-controls="donor-options"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedDonorId("");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="عطیہ دہندہ تلاش کریں"
          className={`${inputClass} pr-9 pl-9`}
        />
        {query && (
          <button
            type="button"
            aria-label="تلاش صاف کریں"
            onClick={() => {
              setQuery("");
              setSelectedDonorId("");
              setIsOpen(false);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XCircle className="size-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div
          id="donor-options"
          role="listbox"
          className="max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {matches.length ? (
            matches.map((donor) => (
              <button
                key={donor.id}
                type="button"
                role="option"
                aria-selected={String(donor.id) === selectedDonorId}
                onClick={() => {
                  setSelectedDonorId(String(donor.id));
                  setQuery(donor.full_name);
                  setIsOpen(false);
                }}
                className="flex w-full flex-col rounded-md px-3 py-2 text-right hover:bg-accent hover:text-accent-foreground"
              >
                <span className="font-medium">{donor.full_name}</span>
                {donor.phone && (
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {donor.phone}
                  </span>
                )}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              کوئی عطیہ دہندہ نہیں ملا
            </p>
          )}
        </div>
      )}
    </label>
  );
}

function EntryDialog({
  type,
  open,
  onOpenChange,
  donors,
  funds,
  isPending,
  error,
  onSubmit,
  onCreateDonor,
}) {
  const isDonation = type === "donation";
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const data = { ...values, amount: Number(values.amount) };
    if (isDonation) data.donor = Number(values.donor);
    else data.fund = Number(values.fund);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{isDonation ? text.donation : text.expense}</DialogTitle>
          <DialogDescription>
            {isDonation
              ? "دستی عطیہ ریکارڈ کریں۔ طلبہ کی فیس خودکار طور پر آمدن میں شامل ہوتی ہے۔"
              : "دیگر مدرسہ اخراجات دستی طور پر درج کریں۔"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {isDonation ? (
              <>
                <div className="grid gap-2">
                  <SearchableDonorField donors={donors} />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCreateDonor}
                    >
                      <Plus />
                      {text.addDonor}
                    </Button>
                  </div>
                </div>
                <label className="grid gap-2 text-right text-sm font-medium">
                  {text.fund}
                  <select name="fund" required className={inputClass}>
                    <option value="">{text.choose}</option>
                    {funds.map((fund) => (
                      <option key={fund.id} value={fund.id}>
                        {fund.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            ) : (
              <>
                <label className="grid gap-2 text-right text-sm font-medium">
                  {text.titleField}
                  <input name="title" required className={inputClass} />
                </label>
                <label className="grid gap-2 text-right text-sm font-medium">
                  {text.fund}
                  <select name="fund" required className={inputClass}>
                    <option value="">{text.choose}</option>
                    {funds.map((fund) => (
                      <option key={fund.id} value={fund.id}>
                        {fund.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.amount}
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                dir="ltr"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.date}
              <input
                name="date"
                type="date"
                dir="ltr"
                defaultValue={today()}
                required
                className={inputClass}
              />
            </label>
            {isDonation && (
              <label className="grid gap-2 text-right text-sm font-medium">
                {text.receipt}
                <input name="receipt_number" className={inputClass} />
              </label>
            )}
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.error)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DonorDialog({ open, onOpenChange, isPending, error, onSubmit }) {
  async function submit(event) {
    event.preventDefault();
    try {
      await onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      onOpenChange(false);
    } catch {}
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{text.addDonor}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.donorName}
              <input name="full_name" required className={inputClass} />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.phone}
              <input name="phone" dir="ltr" className={inputClass} />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.address}
              <textarea
                name="address"
                className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
              />
            </label>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.error)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FundDialog({ open, onOpenChange, isPending, error, onSubmit }) {
  async function submit(event) {
    event.preventDefault();
    try {
      await onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
      onOpenChange(false);
    } catch {}
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{text.addFund}</DialogTitle>
          <DialogDescription>
            عطیات اور اخراجات کو منظم کرنے کے لیے فنڈ بنائیں۔
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.fundName}
              <input name="name" required className={inputClass} />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.fundType}
              <select name="fund_type" required className={inputClass}>
                <option value="zakat">زکوٰۃ</option>
                <option value="chanda">چندہ</option>
                <option value="lillah">للہ</option>
                <option value="fitrana">فطرانہ</option>
                <option value="other">دیگر</option>
              </select>
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.restriction}
              <textarea
                name="restriction"
                className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
              />
            </label>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.error)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function IncomeExpensePage() {
  const [dialogType, setDialogType] = useState(null);
  const [donorDialogOpen, setDonorDialogOpen] = useState(false);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const { data: ledger, isLoading } = useFinanceLedger();
  const { data: funds = [] } = useFunds();
  const { data: donors = [] } = useDonors();
  const createDonation = useCreateDonation();
  const createExpense = useCreateExpense();
  const createDonor = useCreateDonor();
  const createFund = useCreateFund();
  const stats = useMemo(
    () => [
      {
        label: text.income,
        value: ledger?.income,
        icon: ArrowDownLeft,
        tone: "text-success bg-success/10",
      },
      {
        label: text.expenses,
        value: ledger?.expenses,
        icon: ArrowUpLeft,
        tone: "text-destructive bg-destructive/10",
      },
      {
        label: text.balance,
        value: ledger?.balance,
        icon: CircleDollarSign,
        tone: "text-primary bg-primary/10",
      },
    ],
    [ledger],
  );
  async function saveEntry(data) {
    try {
      if (dialogType === "donation") await createDonation.mutateAsync(data);
      else await createExpense.mutateAsync(data);
      toast.success(text.success);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  async function saveDonor(data) {
    try {
      await createDonor.mutateAsync(data);
      toast.success(text.success);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  async function saveFund(data) {
    try {
      await createFund.mutateAsync(data);
      toast.success(text.success);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">مالیاتی انتظام</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {text.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <YearlyFinanceReportButton />
          <Button variant="outline" onClick={() => setFundDialogOpen(true)}>
            <Plus />
            {text.addFund}
          </Button>
          <Button variant="outline" onClick={() => setDialogType("expense")}>
            <BanknoteArrowDown />
            {text.expense}
          </Button>
          <Button onClick={() => setDialogType("donation")}>
            <HandCoins />
            {text.donation}
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div
              className={`grid size-10 place-items-center rounded-lg ${tone}`}
            >
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold" dir="ltr">
              {money(value)}
            </p>
          </article>
        ))}
      </section>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-bold">{text.transactionHistory}</h2>
        </div>
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.loading}
          </p>
        ) : !ledger?.entries?.length ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {[
                    "قسم",
                    "عنوان",
                    text.date,
                    text.amount,
                    text.receipt,
                    text.notes,
                  ].map((label) => (
                    <th key={label} className="px-4 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledger.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/40">
                    <td className="px-4 py-4">
                      <span
                        className={
                          entry.direction === "income"
                            ? "text-success"
                            : "text-destructive"
                        }
                      >
                        {entry.direction === "income" ? "آمدن" : "خرچ"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium">{entry.title}</td>
                    <td className="px-4 py-4" dir="ltr">
                      {entry.date}
                    </td>
                    <td
                      className={
                        entry.direction === "income"
                          ? "px-4 py-4 font-semibold text-success"
                          : "px-4 py-4 font-semibold text-destructive"
                      }
                      dir="ltr"
                    >
                      {entry.direction === "income" ? "+ " : "− "}
                      {money(entry.amount)}
                    </td>
                    <td className="px-4 py-4" dir="ltr">
                      {entry.reference || "—"}
                    </td>
                    <td className="px-4 py-4">{entry.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <EntryDialog
        type={dialogType}
        open={Boolean(dialogType)}
        onOpenChange={(open) => !open && setDialogType(null)}
        donors={donors}
        funds={funds}
        isPending={createDonation.isPending || createExpense.isPending}
        error={createDonation.error || createExpense.error}
        onSubmit={saveEntry}
        onCreateDonor={() => setDonorDialogOpen(true)}
      />
      <DonorDialog
        open={donorDialogOpen}
        onOpenChange={setDonorDialogOpen}
        isPending={createDonor.isPending}
        error={createDonor.error}
        onSubmit={saveDonor}
      />
      <FundDialog
        open={fundDialogOpen}
        onOpenChange={setFundDialogOpen}
        isPending={createFund.isPending}
        error={createFund.error}
        onSubmit={saveFund}
      />
    </div>
  );
}
