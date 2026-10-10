"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  BadgeDollarSign,
  Banknote,
  CheckCheck,
  CircleDollarSign,
  ClipboardCheck,
  Plus,
  Send,
  WalletCards,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useApproveBudget,
  useApprovePayroll,
  useBudgets,
  useCreateBudget,
  useCreateFinancialCategory,
  useCreateFundTransfer,
  useCreatePayrollRun,
  useCreateStaffCompensation,
  useFinanceDashboard,
  useFinanceStaffLookup,
  useFinancialCategories,
  useFunds,
  useGeneratePayroll,
  usePayPayroll,
  usePayrollRuns,
  useStaffCompensations,
  useSubmitBudget,
} from "@/hooks/useFinance";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const today = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => `${today().slice(0, 7)}-01`;
const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const statusLabel = {
  draft: "مسودہ",
  submitted: "منظوری کے لیے",
  approved: "منظور شدہ",
  closed: "بند",
  paid: "ادا شدہ",
  cancelled: "منسوخ",
};

function FormDialog({
  type,
  open,
  onOpenChange,
  funds,
  categories,
  staff,
  mutations,
}) {
  const titles = {
    category: "مالی زمرہ",
    transfer: "فنڈ منتقلی",
    budget: "نیا بجٹ",
    compensation: "عملہ معاوضہ",
    payroll: "نیا پے رول",
  };
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    let mutation;
    let data = values;
    if (type === "category") mutation = mutations.category;
    if (type === "transfer") {
      mutation = mutations.transfer;
      data = {
        ...values,
        source_fund: Number(values.source_fund),
        destination_fund: Number(values.destination_fund),
        amount: Number(values.amount),
      };
    }
    if (type === "budget") {
      mutation = mutations.budget;
      data = {
        ...values,
        fiscal_year: Number(values.fiscal_year),
        lines: [
          {
            line_type: values.line_type,
            title: values.line_title,
            category: values.category ? Number(values.category) : null,
            fund: values.fund ? Number(values.fund) : null,
            planned_amount: Number(values.planned_amount),
            notes: "",
          },
        ],
      };
      delete data.line_type;
      delete data.line_title;
      delete data.category;
      delete data.fund;
      delete data.planned_amount;
    }
    if (type === "compensation") {
      mutation = mutations.compensation;
      data = {
        ...values,
        staff: Number(values.staff),
        basic_salary: Number(values.basic_salary),
        allowances: Number(values.allowances || 0),
        fixed_deductions: Number(values.fixed_deductions || 0),
        fund: values.fund ? Number(values.fund) : null,
      };
    }
    if (type === "payroll") mutation = mutations.payroll;
    try {
      await mutation.mutateAsync(data);
      toast.success("ریکارڈ محفوظ ہو گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
          <DialogDescription>
            مطلوبہ معلومات درج کر کے محفوظ کریں۔
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {type === "category" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="زمرے کا نام"
                  className={inputClass}
                />
                <select name="category_type" className={inputClass}>
                  <option value="expense">خرچ</option>
                  <option value="income">آمدن</option>
                </select>
                <input
                  name="code"
                  placeholder="کوڈ (اختیاری)"
                  className={inputClass}
                />
              </>
            )}
            {type === "transfer" && (
              <>
                <select name="source_fund" required className={inputClass}>
                  <option value="">ماخذ فنڈ</option>
                  {funds.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select name="destination_fund" required className={inputClass}>
                  <option value="">منزل فنڈ</option>
                  {funds.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  name="amount"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="رقم"
                  className={inputClass}
                />
                <input
                  name="date"
                  type="date"
                  defaultValue={today()}
                  required
                  className={inputClass}
                />
                <input
                  name="reference_number"
                  placeholder="حوالہ نمبر"
                  className={inputClass}
                />
              </>
            )}
            {type === "budget" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="بجٹ کا نام"
                  className={inputClass}
                />
                <input
                  name="fiscal_year"
                  required
                  type="number"
                  min="2000"
                  defaultValue={new Date().getFullYear()}
                  className={inputClass}
                />
                <select name="line_type" className={inputClass}>
                  <option value="expense">اخراجات</option>
                  <option value="income">آمدن</option>
                </select>
                <input
                  name="line_title"
                  required
                  placeholder="بجٹ مد"
                  className={inputClass}
                />
                <select name="category" className={inputClass}>
                  <option value="">زمرہ (اختیاری)</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select name="fund" className={inputClass}>
                  <option value="">فنڈ (اختیاری)</option>
                  {funds.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  name="planned_amount"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="منصوبہ شدہ رقم"
                  className={inputClass}
                />
              </>
            )}
            {type === "compensation" && (
              <>
                <select name="staff" required className={inputClass}>
                  <option value="">عملہ منتخب کریں</option>
                  {staff.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.full_name}
                    </option>
                  ))}
                </select>
                <input
                  name="basic_salary"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="بنیادی تنخواہ"
                  className={inputClass}
                />
                <input
                  name="allowances"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="الاؤنس"
                  className={inputClass}
                />
                <input
                  name="fixed_deductions"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="کٹوتی"
                  className={inputClass}
                />
                <input
                  name="effective_from"
                  required
                  type="date"
                  defaultValue={today()}
                  className={inputClass}
                />
                <select name="fund" className={inputClass}>
                  <option value="">فنڈ (اختیاری)</option>
                  {funds.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {type === "payroll" && (
              <>
                <input
                  name="month"
                  required
                  type="date"
                  defaultValue={currentMonth()}
                  className={inputClass}
                />
                <textarea
                  name="notes"
                  placeholder="نوٹس"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              منسوخ
            </Button>
            <Button type="submit">محفوظ کریں</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FinanceControlPage() {
  const year = new Date().getFullYear();
  const [dialog, setDialog] = useState(null);
  const { data: dashboard, isLoading } = useFinanceDashboard(year);
  const { data: funds = [] } = useFunds();
  const { data: categories = [] } = useFinancialCategories();
  const { data: budgets = [] } = useBudgets();
  const { data: payroll = [] } = usePayrollRuns();
  const { data: compensations = [] } = useStaffCompensations();
  const { data: staff = [] } = useFinanceStaffLookup();
  const mutations = {
    category: useCreateFinancialCategory(),
    transfer: useCreateFundTransfer(),
    budget: useCreateBudget(),
    compensation: useCreateStaffCompensation(),
    payroll: useCreatePayrollRun(),
  };
  const submitBudget = useSubmitBudget();
  const approveBudget = useApproveBudget();
  const generatePayroll = useGeneratePayroll();
  const approvePayroll = useApprovePayroll();
  const payPayroll = usePayPayroll();
  const fundTotals = useMemo(
    () => ({
      balance: funds.reduce((sum, item) => sum + Number(item.balance || 0), 0),
      income: funds.reduce((sum, item) => sum + Number(item.income || 0), 0),
      expenses: funds.reduce(
        (sum, item) => sum + Number(item.expenses || 0),
        0,
      ),
    }),
    [funds],
  );
  async function action(mutation, payload, message) {
    try {
      await mutation.mutateAsync(payload);
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  if (isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">جامع مالیاتی نظام</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            فنڈز، بجٹ اور پے رول
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            فنڈ بیلنس، بجٹ منظوری، عملہ معاوضہ اور ماہانہ تنخواہوں کا مربوط
            انتظام
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialog("category")}>
            <Plus />
            زمرہ
          </Button>
          <Button variant="outline" onClick={() => setDialog("transfer")}>
            <ArrowLeftRight />
            منتقلی
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "مجموعی فنڈ بیلنس",
            value: fundTotals.balance,
            icon: CircleDollarSign,
            tone: "text-primary bg-primary/10",
          },
          {
            label: "فنڈ آمدن",
            value: fundTotals.income,
            icon: BadgeDollarSign,
            tone: "text-success bg-success/10",
          },
          {
            label: "فنڈ اخراجات",
            value: fundTotals.expenses,
            icon: Banknote,
            tone: "text-destructive bg-destructive/10",
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-2xl border bg-card p-5">
            <div
              className={`grid size-10 place-items-center rounded-xl ${tone}`}
            >
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold" dir="ltr">
              {money(value)}
            </p>
          </article>
        ))}
      </section>
      <Tabs defaultValue="funds">
        <TabsList className="flex-wrap">
          <TabsTrigger value="funds">فنڈز</TabsTrigger>
          <TabsTrigger value="budgets">بجٹ</TabsTrigger>
          <TabsTrigger value="compensation">معاوضہ</TabsTrigger>
          <TabsTrigger value="payroll">پے رول</TabsTrigger>
        </TabsList>
        <TabsContent value="funds">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(dashboard?.funds || funds).map((fund) => (
              <article key={fund.id} className="rounded-2xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">{fund.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {fund.code || fund.fund_type}
                    </p>
                  </div>
                  <WalletCards className="size-5 text-primary" />
                </div>
                <p className="mt-5 text-2xl font-bold" dir="ltr">
                  {money(fund.balance)}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <span className="text-success">
                    آمدن {money(fund.income)}
                  </span>
                  <span className="text-destructive">
                    خرچ {money(fund.expenses)}
                  </span>
                </div>
              </article>
            ))}
          </section>
        </TabsContent>
        <TabsContent value="budgets">
          <section className="rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-bold">سالانہ بجٹ</h2>
                <p className="text-sm text-muted-foreground">
                  منصوبہ، منظوری اور اصل اخراجات کا کنٹرول
                </p>
              </div>
              <Button onClick={() => setDialog("budget")}>
                <Plus />
                نیا بجٹ
              </Button>
            </div>
            <div className="divide-y">
              {budgets.length ? (
                budgets.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.name} — {item.fiscal_year}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        آمدن {money(item.planned_income)} · اخراجات{" "}
                        {money(item.planned_expenses)} ·{" "}
                        {statusLabel[item.status]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {item.status === "draft" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            action(
                              submitBudget,
                              item.id,
                              "بجٹ منظوری کے لیے بھیج دیا گیا",
                            )
                          }
                        >
                          <Send />
                          جمع کریں
                        </Button>
                      )}
                      {item.status === "submitted" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            action(approveBudget, item.id, "بجٹ منظور ہو گیا")
                          }
                        >
                          <CheckCheck />
                          منظور کریں
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-muted-foreground">
                  کوئی بجٹ موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="compensation">
          <section className="rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="font-bold">عملہ معاوضہ ڈھانچہ</h2>
              <Button onClick={() => setDialog("compensation")}>
                <Plus />
                معاوضہ مقرر کریں
              </Button>
            </div>
            <div className="divide-y">
              {compensations.length ? (
                compensations.map((item) => (
                  <div key={item.id} className="grid gap-2 p-5 sm:grid-cols-4">
                    <p className="font-semibold">{item.staff_name}</p>
                    <p>
                      بنیادی: <span dir="ltr">{money(item.basic_salary)}</span>
                    </p>
                    <p>
                      الاؤنس: <span dir="ltr">{money(item.allowances)}</span>
                    </p>
                    <p className="font-bold text-primary">
                      خالص: <span dir="ltr">{money(item.net_salary)}</span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-muted-foreground">
                  معاوضہ ریکارڈ موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="payroll">
          <section className="rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-bold">ماہانہ پے رول</h2>
                <p className="text-sm text-muted-foreground">
                  تیاری، منظوری اور ادائیگی
                </p>
              </div>
              <Button onClick={() => setDialog("payroll")}>
                <Plus />
                نیا پے رول
              </Button>
            </div>
            <div className="divide-y">
              {payroll.length ? (
                payroll.map((run) => (
                  <div
                    key={run.id}
                    className="flex flex-col gap-3 p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="font-semibold" dir="ltr">
                        {run.month}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {run.staff_count} ملازمین · خالص {money(run.total_net)}{" "}
                        · {statusLabel[run.status]}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {run.status === "draft" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              action(
                                generatePayroll,
                                run.id,
                                "پے رول تیار ہو گیا",
                              )
                            }
                          >
                            <ClipboardCheck />
                            تیار کریں
                          </Button>
                          {run.staff_count > 0 && (
                            <Button
                              size="sm"
                              onClick={() =>
                                action(
                                  approvePayroll,
                                  run.id,
                                  "پے رول منظور ہو گیا",
                                )
                              }
                            >
                              <CheckCheck />
                              منظور کریں
                            </Button>
                          )}
                        </>
                      )}
                      {run.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            action(
                              payPayroll,
                              { id: run.id, payment_date: today() },
                              "تنخواہیں ادا ہو گئیں",
                            )
                          }
                        >
                          <Banknote />
                          ادائیگی کریں
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-muted-foreground">
                  کوئی پے رول موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>
      <FormDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        funds={funds}
        categories={categories}
        staff={staff}
        mutations={mutations}
      />
    </div>
  );
}
