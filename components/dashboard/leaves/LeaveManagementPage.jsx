"use client";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck2,
  CalendarDays,
  CheckCheck,
  Clock3,
  Plus,
  Search,
  Send,
  UsersRound,
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
  useCreateLeaveBalance,
  useCreateLeaveCalendarDay,
  useCreateLeaveRequest,
  useCreateLeaveType,
  useLeaveAction,
  useLeaveBalances,
  useLeaveCalendar,
  useLeaveDashboard,
  useLeavePeople,
  useLeaveRequests,
  useLeaveTypes,
} from "@/hooks/useLeaves";
import { getApiErrorMessage, toast } from "@/lib/toast";
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const labels = {
  draft: "مسودہ",
  submitted: "جمع شدہ",
  pending_approval: "منظوری کے لیے",
  approved: "منظور",
  rejected: "نامنظور",
  cancelled: "منسوخ",
};
const today = () => new Date().toISOString().slice(0, 10);
function Metric({ icon: Icon, label, value, tone }) {
  return (
    <article className="rounded-2xl border bg-card p-5">
      <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </article>
  );
}
function FormDialog({ type, open, onOpenChange, types, people, mutations }) {
  const [kind, setKind] = useState("staff");
  const titles = {
    type: "رخصت کی قسم",
    request: "نئی رخصت درخواست",
    balance: "رخصت بیلنس",
    calendar: "تعطیل/کیلنڈر دن",
  };
  async function submit(e) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    let m = mutations[type],
      data = v;
    if (type === "type")
      data = {
        ...v,
        is_paid: v.is_paid === "on",
        paid_percentage: Number(v.paid_percentage),
        requires_attachment: v.requires_attachment === "on",
        attachment_required_after_days: Number(
          v.attachment_required_after_days || 0,
        ),
        allow_half_day: true,
        allow_negative_balance: false,
        requires_substitution: v.requires_substitution === "on",
      };
    if (type === "request")
      data = {
        subject_kind: kind,
        staff: kind === "staff" ? Number(v.staff) : null,
        student: kind === "student" ? Number(v.student) : null,
        leave_type: Number(v.leave_type),
        starts_on: v.starts_on,
        ends_on: v.ends_on,
        day_part: v.day_part,
        reason: v.reason,
        contact_during_leave: v.contact_during_leave,
      };
    if (type === "balance")
      data = {
        staff: v.staff ? Number(v.staff) : null,
        student: v.student ? Number(v.student) : null,
        leave_type: Number(v.leave_type),
        year: Number(v.year),
        opening: Number(v.opening || 0),
        entitlement: Number(v.entitlement || 0),
        used: 0,
        adjusted: 0,
      };
    if (type === "calendar")
      data = {
        date: v.date,
        day_type: v.day_type,
        audience: v.audience,
        name: v.name,
        counts_as_leave_day: v.counts_as_leave_day === "on",
      };
    try {
      await m.mutateAsync(data);
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
          <DialogDescription>مطلوبہ معلومات درج کریں۔</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {type === "type" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="قسم کا نام"
                  className={inputClass}
                />
                <input
                  name="code"
                  required
                  placeholder="کوڈ"
                  className={inputClass}
                />
                <select name="subject_kind" className={inputClass}>
                  <option value="both">دونوں</option>
                  <option value="staff">عملہ</option>
                  <option value="student">طلبہ</option>
                </select>
                <input
                  name="paid_percentage"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="100"
                  className={inputClass}
                />
                <label>
                  <input type="checkbox" name="is_paid" defaultChecked /> با
                  تنخواہ
                </label>
                <label>
                  <input type="checkbox" name="requires_attachment" /> دستاویز
                  ضروری
                </label>
                <input
                  name="attachment_required_after_days"
                  type="number"
                  min="0"
                  defaultValue="0"
                  className={inputClass}
                />
                <label>
                  <input type="checkbox" name="requires_substitution" /> متبادل
                  استاد ضروری
                </label>
              </>
            )}
            {type === "request" && (
              <>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                  className={inputClass}
                >
                  <option value="staff">عملہ</option>
                  <option value="student">طالب علم</option>
                </select>
                {kind === "staff" ? (
                  <select name="staff" required className={inputClass}>
                    <option value="">عملہ</option>
                    {people.staff.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.full_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select name="student" required className={inputClass}>
                    <option value="">طالب علم</option>
                    {people.students.map((x) => (
                      <option
                        key={x.id || x.student_id}
                        value={x.id || x.student_id}
                      >
                        {x.full_name || x.student__full_name}
                      </option>
                    ))}
                  </select>
                )}
                <select name="leave_type" required className={inputClass}>
                  <option value="">رخصت قسم</option>
                  {types
                    .filter(
                      (x) =>
                        x.subject_kind === "both" || x.subject_kind === kind,
                    )
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="starts_on"
                    type="date"
                    required
                    defaultValue={today()}
                    className={inputClass}
                  />
                  <input
                    name="ends_on"
                    type="date"
                    required
                    defaultValue={today()}
                    className={inputClass}
                  />
                </div>
                <select name="day_part" className={inputClass}>
                  <option value="full">پورا دن</option>
                  <option value="first_half">پہلا نصف</option>
                  <option value="second_half">دوسرا نصف</option>
                </select>
                <textarea
                  name="reason"
                  required
                  placeholder="رخصت کی وجہ"
                  className="min-h-28 rounded-lg border border-input bg-background p-3"
                />
                <input
                  name="contact_during_leave"
                  placeholder="رابطہ"
                  className={inputClass}
                />
              </>
            )}
            {type === "balance" && (
              <>
                <select name="staff" className={inputClass}>
                  <option value="">عملہ</option>
                  {people.staff.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.full_name}
                    </option>
                  ))}
                </select>
                <select name="student" className={inputClass}>
                  <option value="">یا طالب علم</option>
                  {people.students.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.full_name}
                    </option>
                  ))}
                </select>
                <select name="leave_type" required className={inputClass}>
                  {types.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <input
                  name="year"
                  type="number"
                  defaultValue={new Date().getFullYear()}
                  className={inputClass}
                />
                <input
                  name="opening"
                  type="number"
                  step="0.5"
                  defaultValue="0"
                  className={inputClass}
                />
                <input
                  name="entitlement"
                  type="number"
                  step="0.5"
                  defaultValue="12"
                  className={inputClass}
                />
              </>
            )}
            {type === "calendar" && (
              <>
                <input
                  name="date"
                  type="date"
                  required
                  className={inputClass}
                />
                <input
                  name="name"
                  required
                  placeholder="تعطیل کا نام"
                  className={inputClass}
                />
                <select name="day_type" className={inputClass}>
                  <option value="public_holiday">سرکاری تعطیل</option>
                  <option value="institution_holiday">ادارہ تعطیل</option>
                  <option value="closure">بندش</option>
                  <option value="weekend">ہفتہ وار تعطیل</option>
                </select>
                <select name="audience" className={inputClass}>
                  <option value="all">سب</option>
                  <option value="staff">عملہ</option>
                  <option value="students">طلبہ</option>
                </select>
                <label>
                  <input name="counts_as_leave_day" type="checkbox" /> رخصت دن
                  شمار ہو
                </label>
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
export default function LeaveManagementPage() {
  const [dialog, setDialog] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data: dashboard, isLoading } = useLeaveDashboard();
  const { data: types = [] } = useLeaveTypes();
  const { data: requests = [] } = useLeaveRequests();
  const { data: balances = [] } = useLeaveBalances();
  const { data: calendar = [] } = useLeaveCalendar();
  const { data: people = { staff: [], students: [] } } = useLeavePeople();
  const createType = useCreateLeaveType();
  const createRequest = useCreateLeaveRequest();
  const createBalance = useCreateLeaveBalance();
  const createCalendar = useCreateLeaveCalendarDay();
  const action = useLeaveAction();
  const mutations = {
    type: createType,
    request: createRequest,
    balance: createBalance,
    calendar: createCalendar,
  };
  const filtered = useMemo(
    () =>
      requests.filter(
        (r) =>
          (!status || r.status === status) &&
          `${r.request_number} ${r.subject_name} ${r.leave_type_name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [requests, search, status],
  );
  async function run(id, name, data, message) {
    try {
      await action.mutateAsync({ id, action: name, data });
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  if (isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
      </div>
    );
  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">حاضری و عملہ نظم</p>
          <h1 className="text-3xl font-bold">رخصت کا انتظام</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            عملہ و طلبہ درخواستیں، منظوری، بیلنس، تعطیلات اور حاضری ربط
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialog("calendar")}>
            <CalendarDays />
            تعطیل
          </Button>
          <Button variant="outline" onClick={() => setDialog("balance")}>
            <Plus />
            بیلنس
          </Button>
          <Button variant="outline" onClick={() => setDialog("type")}>
            <Plus />
            قسم
          </Button>
          <Button onClick={() => setDialog("request")}>
            <Plus />
            درخواست
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric
          icon={CalendarCheck2}
          label="کل درخواستیں"
          value={dashboard?.total || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={Clock3}
          label="زیر منظوری"
          value={dashboard?.pending || 0}
          tone="bg-warning/10 text-warning"
        />
        <Metric
          icon={CheckCheck}
          label="منظور"
          value={dashboard?.approved || 0}
          tone="bg-success/10 text-success"
        />
        <Metric
          icon={UsersRound}
          label="آج رخصت"
          value={dashboard?.active_today || 0}
          tone="bg-info/10 text-info"
        />
        <Metric
          icon={UsersRound}
          label="عملہ رخصت"
          value={dashboard?.staff_active || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={AlertTriangle}
          label="طلبہ رخصت"
          value={dashboard?.student_active || 0}
          tone="bg-destructive/10 text-destructive"
        />
      </section>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">درخواستیں</TabsTrigger>
          <TabsTrigger value="balances">بیلنس</TabsTrigger>
          <TabsTrigger value="calendar">تعطیلات</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <section className="rounded-2xl border bg-card">
            <div className="grid gap-3 border-b p-5 sm:grid-cols-[1fr_14rem]">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="نمبر، نام یا قسم"
                  className={`${inputClass} pr-9`}
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="">تمام حالتیں</option>
                {Object.entries(labels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="divide-y">
              {filtered.length ? (
                filtered.map((r) => (
                  <article
                    key={r.id}
                    className="grid gap-3 p-5 lg:grid-cols-[10rem_1fr_10rem_8rem_auto]"
                  >
                    <span className="font-mono text-xs" dir="ltr">
                      {r.request_number}
                    </span>
                    <div>
                      <strong>{r.subject_name}</strong>
                      <p className="text-sm text-muted-foreground">
                        {r.leave_type_name} · {r.reason}
                      </p>
                    </div>
                    <span dir="ltr">
                      {r.starts_on} — {r.ends_on}
                    </span>
                    <span>
                      {labels[r.status]} · {r.chargeable_days} دن
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {r.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            run(r.id, "submit", {}, "درخواست جمع ہو گئی")
                          }
                        >
                          <Send />
                          جمع
                        </Button>
                      )}
                      {r.status === "pending_approval" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              run(r.id, "approve", {}, "رخصت منظور ہو گئی")
                            }
                          >
                            <CheckCheck />
                            منظور
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              run(
                                r.id,
                                "reject",
                                { comment: "درخواست منظور نہیں" },
                                "درخواست نامنظور ہو گئی",
                              )
                            }
                          >
                            نامنظور
                          </Button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            run(
                              r.id,
                              "sync_attendance",
                              {},
                              "حاضری سے مربوط ہو گئی",
                            )
                          }
                        >
                          حاضری ربط
                        </Button>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <p className="p-10 text-center text-muted-foreground">
                  کوئی درخواست موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="balances">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {balances.map((b) => (
              <article key={b.id} className="rounded-2xl border bg-card p-5">
                <h2 className="font-bold">{b.subject_name}</h2>
                <p className="text-sm text-muted-foreground">
                  {b.leave_type_name} — {b.year}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <small>حق</small>
                    <p>{b.entitlement}</p>
                  </div>
                  <div>
                    <small>استعمال</small>
                    <p>{b.used}</p>
                  </div>
                  <div>
                    <small>دستیاب</small>
                    <p className="text-success">{b.available}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </TabsContent>
        <TabsContent value="calendar">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {calendar.map((d) => (
              <article key={d.id} className="rounded-xl border bg-card p-4">
                <strong>{d.name}</strong>
                <p dir="ltr">{d.date}</p>
                <p className="text-sm text-muted-foreground">
                  {d.day_type} · {d.audience}
                </p>
              </article>
            ))}
          </section>
        </TabsContent>
      </Tabs>
      <FormDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        types={types}
        people={people}
        mutations={mutations}
      />
    </div>
  );
}
