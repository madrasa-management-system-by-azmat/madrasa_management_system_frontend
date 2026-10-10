"use client";

import { useState } from "react";
import {
  BellRing,
  BookOpenCheck,
  CalendarDays,
  CreditCard,
  GraduationCap,
  LogOut,
  MessageSquareText,
  School,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateParentMeetingBooking,
  useCreateGuardianLeaveRequest,
  useGuardianLeaveRequests,
  useGuardianLeaveTypes,
  useMarkGuardianAnnouncementRead,
  useParentPortal,
  useSubmitGuardianLeaveRequest,
} from "@/hooks/useGuardians";
import { useAuthContext } from "@/context/AuthContext";
import { getApiErrorMessage, toast } from "@/lib/toast";

const money = (v) =>
  Number(v || 0).toLocaleString("en-PK", { maximumFractionDigits: 2 });
function Card({
  icon: Icon,
  label,
  value,
  tone = "bg-primary/10 text-primary",
}) {
  return (
    <article className="rounded-2xl border bg-card p-5">
      <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold" dir="ltr">
        {value}
      </p>
    </article>
  );
}
export default function ParentPortalPage() {
  const { data, isLoading } = useParentPortal();
  const { endSession } = useAuthContext();
  const [selected, setSelected] = useState("");
  const booking = useCreateParentMeetingBooking();
  const markRead = useMarkGuardianAnnouncementRead();
  const { data: leaveTypes = [] } = useGuardianLeaveTypes();
  const { data: leaveRequests = [] } = useGuardianLeaveRequests();
  const createLeave = useCreateGuardianLeaveRequest();
  const submitLeave = useSubmitGuardianLeaveRequest();
  if (isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  const children = data?.children || [];
  const child =
    children.find((item) => String(item.id) === String(selected)) ||
    children[0];
  async function book(slot) {
    try {
      await booking.mutateAsync({
        slot: slot.id,
        student: child.id,
        agenda: "طالب علم کی تعلیمی پیش رفت",
      });
      toast.success("ملاقات محفوظ ہو گئی");
    } catch (error) {
      toast.error("ملاقات محفوظ نہیں ہوئی", getApiErrorMessage(error));
    }
  }
  async function requestLeave(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const request = await createLeave.mutateAsync({
        subject_kind: "student",
        student: child.id,
        leave_type: Number(values.leave_type),
        starts_on: values.starts_on,
        ends_on: values.ends_on,
        day_part: "full",
        reason: values.reason,
      });
      await submitLeave.mutateAsync(request.id);
      event.currentTarget.reset();
      toast.success("رخصت درخواست جمع ہو گئی");
    } catch (error) {
      toast.error("رخصت درخواست جمع نہیں ہوئی", getApiErrorMessage(error));
    }
  }
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-bold">والدین پورٹل</p>
            <p className="text-sm text-muted-foreground">
              خوش آمدید، {data?.guardian?.full_name}
            </p>
          </div>
          <Button variant="outline" onClick={endSession}>
            <LogOut />
            لاگ آؤٹ
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-7 px-4 py-7">
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm opacity-80">طالب علم منتخب کریں</p>
              <h1 className="mt-2 text-3xl font-bold">
                تعلیمی اور انتظامی جائزہ
              </h1>
            </div>
            <select
              value={child?.id || ""}
              onChange={(e) => setSelected(e.target.value)}
              className="h-11 rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-4"
            >
              <option className="text-foreground" value="">
                طالب علم
              </option>
              {children.map((item) => (
                <option
                  className="text-foreground"
                  key={item.id}
                  value={item.id}
                >
                  {item.full_name}
                </option>
              ))}
            </select>
          </div>
        </section>
        {child ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card
                icon={School}
                label="جماعت"
                value={child.class_name || "—"}
              />
              <Card
                icon={CalendarDays}
                label="حاضری"
                value={`${child.attendance.present}/${child.attendance.total}`}
                tone="bg-success/10 text-success"
              />
              <Card
                icon={CreditCard}
                label="بقایا فیس"
                value={money(child.fees.outstanding)}
                tone="bg-warning/10 text-warning"
              />
              <Card
                icon={GraduationCap}
                label="شائع نتائج"
                value={child.results.length}
              />
            </section>
            <Tabs defaultValue="overview">
              <TabsList className="flex-wrap">
                <TabsTrigger value="overview">خلاصہ</TabsTrigger>
                <TabsTrigger value="attendance">حاضری</TabsTrigger>
                <TabsTrigger value="results">نتائج</TabsTrigger>
                <TabsTrigger value="fees">فیس</TabsTrigger>
                <TabsTrigger value="hifz">حفظ</TabsTrigger>
                <TabsTrigger value="meetings">اساتذہ ملاقات</TabsTrigger>
                <TabsTrigger value="leave">رخصت</TabsTrigger>
                <TabsTrigger value="announcements">اعلانات</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <section className="grid gap-5 lg:grid-cols-2">
                  <article className="rounded-2xl border bg-card p-5">
                    <h2 className="font-bold">طالب علم</h2>
                    <p className="mt-3 text-xl font-bold">{child.full_name}</p>
                    <p className="text-muted-foreground">
                      {child.registration_number} · {child.class_name} ·{" "}
                      {child.halaqa_name}
                    </p>
                  </article>
                  <article className="rounded-2xl border bg-card p-5">
                    <h2 className="font-bold">حالیہ سرگرمی</h2>
                    <p className="mt-3 text-sm">
                      حاضری: {child.attendance.recent[0]?.status || "—"}
                    </p>
                    <p className="text-sm">
                      آخری نتیجہ: {child.results[0]?.exam || "—"}
                    </p>
                    <p className="text-sm">
                      آخری حفظ اندراج: {child.hifz[0]?.date || "—"}
                    </p>
                  </article>
                </section>
              </TabsContent>
              <TabsContent value="attendance">
                <div className="grid gap-3 md:grid-cols-2">
                  {child.attendance.recent.map((row) => (
                    <div
                      key={row.date}
                      className="rounded-xl border bg-card p-4"
                    >
                      <span dir="ltr">{row.date}</span>
                      <strong className="float-left">{row.status}</strong>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="results">
                <div className="overflow-x-auto rounded-2xl border bg-card">
                  <table className="w-full min-w-160 text-right">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3">امتحان</th>
                        <th>مضمون</th>
                        <th>نمبر</th>
                        <th>نتیجہ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {child.results.map((r, i) => (
                        <tr
                          key={`${r.exam}-${r.subject}-${i}`}
                          className="border-t"
                        >
                          <td className="p-3">{r.exam}</td>
                          <td>{r.subject}</td>
                          <td dir="ltr">{r.marks}</td>
                          <td>{r.result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="fees">
                <div className="grid gap-3 md:grid-cols-2">
                  {child.fees.recent.map((fee) => (
                    <div
                      key={fee.month}
                      className="rounded-xl border bg-card p-4"
                    >
                      <strong dir="ltr">{fee.month}</strong>
                      <p>
                        واجب: {money(fee.total_due)} · ادا:{" "}
                        {money(fee.amount_paid)}
                      </p>
                      <p className="text-warning">
                        بقایا: {money(fee.outstanding)}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="hifz">
                <div className="grid gap-3 md:grid-cols-2">
                  {child.hifz.map((log) => (
                    <div
                      key={log.date}
                      className="rounded-xl border bg-card p-4"
                    >
                      <strong dir="ltr">{log.date}</strong>
                      <p>سبق: {log.sabaq || "—"}</p>
                      <p>سبقی: {log.sabqi || "—"}</p>
                      <p>منزل: {log.manzil || "—"}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="meetings">
                <section className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.available_slots?.map((slot) => (
                      <article
                        key={slot.id}
                        className="rounded-2xl border bg-card p-5"
                      >
                        <h2 className="font-bold">{slot.teacher_name}</h2>
                        <p
                          className="mt-2 text-sm text-muted-foreground"
                          dir="ltr"
                        >
                          {new Date(slot.starts_at).toLocaleString()}
                        </p>
                        <p className="text-sm">{slot.venue || "آن لائن"}</p>
                        <Button
                          className="mt-4"
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => book(slot)}
                        >
                          <MessageSquareText />
                          ملاقات محفوظ کریں
                        </Button>
                      </article>
                    ))}
                  </div>
                  <h2 className="font-bold">میری ملاقاتیں</h2>
                  {data.meetings?.map((m) => (
                    <div key={m.id} className="rounded-xl border bg-card p-4">
                      <strong>
                        {m.teacher_name} — {m.student_name}
                      </strong>
                      <p dir="ltr">{new Date(m.starts_at).toLocaleString()}</p>
                      <p>{m.status}</p>
                      {m.follow_up && (
                        <p className="mt-2 text-sm">فالو اپ: {m.follow_up}</p>
                      )}
                    </div>
                  ))}
                </section>
              </TabsContent>
              <TabsContent value="leave">
                <section className="grid gap-5 lg:grid-cols-2">
                  <form
                    onSubmit={requestLeave}
                    className="space-y-4 rounded-2xl border bg-card p-5"
                  >
                    <h2 className="font-bold">نئی رخصت درخواست</h2>
                    <select
                      name="leave_type"
                      required
                      className="h-10 w-full rounded-lg border border-input bg-background px-3"
                    >
                      <option value="">رخصت قسم</option>
                      {leaveTypes
                        .filter((item) =>
                          ["student", "both"].includes(item.subject_kind),
                        )
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="starts_on"
                        type="date"
                        required
                        className="h-10 rounded-lg border border-input bg-background px-3"
                      />
                      <input
                        name="ends_on"
                        type="date"
                        required
                        className="h-10 rounded-lg border border-input bg-background px-3"
                      />
                    </div>
                    <textarea
                      name="reason"
                      required
                      placeholder="رخصت کی وجہ"
                      className="min-h-24 w-full rounded-lg border border-input bg-background p-3"
                    />
                    <Button type="submit">
                      <CalendarDays />
                      درخواست جمع کریں
                    </Button>
                  </form>
                  <div className="space-y-3">
                    <h2 className="font-bold">سابقہ درخواستیں</h2>
                    {leaveRequests
                      .filter((item) => item.student === child.id)
                      .map((item) => (
                        <article
                          key={item.id}
                          className="rounded-xl border bg-card p-4"
                        >
                          <strong>{item.leave_type_name}</strong>
                          <p dir="ltr">
                            {item.starts_on} — {item.ends_on}
                          </p>
                          <p>
                            {item.status} · {item.chargeable_days} دن
                          </p>
                        </article>
                      ))}
                  </div>
                </section>
              </TabsContent>
              <TabsContent value="announcements">
                <div className="space-y-3">
                  {data.announcements?.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => !a.is_read && markRead.mutate(a.id)}
                      className={`w-full rounded-xl border bg-card p-5 text-right ${a.is_read ? "opacity-70" : "border-primary/40"}`}
                    >
                      <div className="flex justify-between">
                        <strong>{a.title}</strong>
                        {!a.is_read && (
                          <BellRing className="size-5 text-primary" />
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-7">{a.body}</p>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            اس اکاؤنٹ سے کوئی طالب علم منسلک نہیں۔
          </p>
        )}
      </main>
    </div>
  );
}
