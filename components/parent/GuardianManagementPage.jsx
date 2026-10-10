"use client";

import { useState } from "react";
import {
  BellRing,
  CalendarPlus,
  Copy,
  Plus,
  Send,
  UserPlus,
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
  useCreateGuardian,
  useCreateGuardianAnnouncement,
  useCreateParentMeetingSlot,
  useGuardians,
  useGuardianAnnouncements,
  useInviteGuardian,
  useParentMeetingBookings,
  useParentMeetingSlots,
} from "@/hooks/useGuardians";
import { useAllStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { getApiErrorMessage, toast } from "@/lib/toast";
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
function FormDialog({
  type,
  open,
  onOpenChange,
  students,
  teachers,
  mutations,
}) {
  const titles = {
    guardian: "نیا سرپرست",
    slot: "والدین ملاقات وقت",
    announcement: "والدین اعلان",
  };
  async function submit(event) {
    event.preventDefault();
    const v = Object.fromEntries(new FormData(event.currentTarget));
    let m = mutations[type],
      data = v;
    if (type === "guardian")
      data = {
        full_name: v.full_name,
        phone: v.phone,
        email: v.email,
        student_ids: [Number(v.student)],
        relationship: v.relationship,
        is_primary: true,
      };
    if (type === "slot")
      data = {
        teacher: Number(v.teacher),
        academic_class: null,
        starts_at: v.starts_at,
        ends_at: v.ends_at,
        venue: v.venue,
        capacity: Number(v.capacity),
      };
    if (type === "announcement")
      data = { title: v.title, body: v.body, audience: "all" };
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
            {type === "guardian" && (
              <>
                <input
                  name="full_name"
                  required
                  placeholder="سرپرست کا نام"
                  className={inputClass}
                />
                <input
                  name="phone"
                  required
                  placeholder="فون"
                  dir="ltr"
                  className={inputClass}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="ای میل"
                  dir="ltr"
                  className={inputClass}
                />
                <select name="student" required className={inputClass}>
                  <option value="">طالب علم</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} — {s.registration_number}
                    </option>
                  ))}
                </select>
                <input
                  name="relationship"
                  defaultValue="سرپرست"
                  className={inputClass}
                />
              </>
            )}
            {type === "slot" && (
              <>
                <select name="teacher" required className={inputClass}>
                  <option value="">استاد</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name}
                    </option>
                  ))}
                </select>
                <input
                  name="starts_at"
                  type="datetime-local"
                  required
                  className={inputClass}
                />
                <input
                  name="ends_at"
                  type="datetime-local"
                  required
                  className={inputClass}
                />
                <input name="venue" placeholder="مقام" className={inputClass} />
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className={inputClass}
                />
              </>
            )}
            {type === "announcement" && (
              <>
                <input
                  name="title"
                  required
                  placeholder="اعلان کا عنوان"
                  className={inputClass}
                />
                <textarea
                  name="body"
                  required
                  placeholder="اعلان"
                  className="min-h-36 rounded-lg border border-input bg-background p-3"
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
export default function GuardianManagementPage() {
  const [dialog, setDialog] = useState(null);
  const { data: guardians = [], isLoading } = useGuardians();
  const { data: slots = [] } = useParentMeetingSlots();
  const { data: bookings = [] } = useParentMeetingBookings();
  const { data: announcements = [] } = useGuardianAnnouncements();
  const { data: students = [] } = useAllStudents();
  const { data: teachers = [] } = useTeachers();
  const createGuardian = useCreateGuardian();
  const invite = useInviteGuardian();
  const createSlot = useCreateParentMeetingSlot();
  const createAnnouncement = useCreateGuardianAnnouncement();
  const mutations = {
    guardian: createGuardian,
    slot: createSlot,
    announcement: createAnnouncement,
  };
  async function makeInvite(id) {
    try {
      const result = await invite.mutateAsync(id);
      await navigator.clipboard.writeText(
        `${window.location.origin}/parent/activate/${result.token}`,
      );
      toast.success("دعوتی لنک کاپی ہو گیا");
    } catch (error) {
      toast.error("دعوت نہیں بن سکی", getApiErrorMessage(error));
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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">رابطۂ والدین</p>
          <h1 className="text-3xl font-bold">والدین پورٹل اور ملاقاتیں</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            سرپرست اکاؤنٹس، طلبہ روابط، اعلانات اور اساتذہ ملاقاتیں
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialog("announcement")}>
            <BellRing />
            اعلان
          </Button>
          <Button variant="outline" onClick={() => setDialog("slot")}>
            <CalendarPlus />
            ملاقات وقت
          </Button>
          <Button onClick={() => setDialog("guardian")}>
            <UserPlus />
            نیا سرپرست
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border bg-card p-5">
          <UsersRound className="text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">سرپرست</p>
          <p className="text-3xl font-bold">{guardians.length}</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <CalendarPlus className="text-info" />
          <p className="mt-3 text-sm text-muted-foreground">ملاقات اوقات</p>
          <p className="text-3xl font-bold">{slots.length}</p>
        </article>
        <article className="rounded-2xl border bg-card p-5">
          <BellRing className="text-warning" />
          <p className="mt-3 text-sm text-muted-foreground">اعلانات</p>
          <p className="text-3xl font-bold">{announcements.length}</p>
        </article>
      </section>
      <Tabs defaultValue="guardians">
        <TabsList>
          <TabsTrigger value="guardians">سرپرست</TabsTrigger>
          <TabsTrigger value="slots">ملاقاتیں</TabsTrigger>
          <TabsTrigger value="announcements">اعلانات</TabsTrigger>
        </TabsList>
        <TabsContent value="guardians">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {guardians.map((g) => (
              <article key={g.id} className="rounded-2xl border bg-card p-5">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold">{g.full_name}</h2>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {g.phone}
                    </p>
                  </div>
                  <span>{g.status}</span>
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  {g.students.map((s) => (
                    <p key={s.id}>
                      {s.student_name} — {s.class_name}
                    </p>
                  ))}
                </div>
                {g.status !== "active" && (
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => makeInvite(g.id)}
                  >
                    <Copy />
                    دعوتی لنک
                  </Button>
                )}
              </article>
            ))}
          </section>
        </TabsContent>
        <TabsContent value="slots">
          <div className="space-y-3">
            {slots.map((s) => (
              <article key={s.id} className="rounded-xl border bg-card p-4">
                <strong>{s.teacher_name}</strong>
                <p dir="ltr">
                  {new Date(s.starts_at).toLocaleString()} —{" "}
                  {new Date(s.ends_at).toLocaleTimeString()}
                </p>
                <p>
                  {s.venue} · {s.booked_count}/{s.capacity}
                </p>
              </article>
            ))}
            <h2 className="pt-5 font-bold">محفوظ ملاقاتیں</h2>
            {bookings.map((b) => (
              <article key={b.id} className="rounded-xl border bg-card p-4">
                <strong>
                  {b.guardian_name} — {b.student_name}
                </strong>
                <p>
                  {b.teacher_name} · {b.status}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="announcements">
          <div className="space-y-3">
            {announcements.map((a) => (
              <article key={a.id} className="rounded-xl border bg-card p-5">
                <h2 className="font-bold">{a.title}</h2>
                <p className="mt-2">{a.body}</p>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <FormDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        students={students}
        teachers={teachers}
        mutations={mutations}
      />
    </div>
  );
}
