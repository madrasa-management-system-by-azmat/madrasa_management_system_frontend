"use client";
import { useState } from "react";
import {
  Award,
  BookOpenCheck,
  GraduationCap,
  Plus,
  ShieldAlert,
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
  useAlumni,
  useAlumniEngagements,
  useCreateAlumniEngagement,
  useCreateDisciplineCategory,
  useCreateDisciplineIncident,
  useCreateReward,
  useCreateRewardCategory,
  useCreateTrainingEnrollment,
  useCreateTrainingProgram,
  useDevelopmentDashboard,
  useDisciplineCategories,
  useDisciplineIncidents,
  useIncidentAction,
  useRewardAction,
  useRewardCategories,
  useRewards,
  useTrainingPrograms,
} from "@/hooks/useDevelopment";
import { useAllStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { getApiErrorMessage, toast } from "@/lib/toast";
const input =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right";
const now = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
function Form({
  type,
  open,
  onOpenChange,
  categories,
  rewardCategories,
  students,
  staff,
  alumni,
  programs,
  mutations,
}) {
  async function submit(e) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    let m = mutations[type],
      d = v;
    if (type === "disciplineCategory") d = { ...v };
    if (type === "incident")
      d = {
        student: Number(v.student),
        category: Number(v.category),
        incident_date: v.incident_date,
        severity: v.severity,
        description: v.description,
        location: v.location,
        confidential: true,
      };
    if (type === "program")
      d = {
        ...v,
        capacity: Number(v.capacity),
        passing_score: Number(v.passing_score),
        certificate_enabled: true,
      };
    if (type === "enrollment")
      d = {
        program: Number(v.program),
        staff: v.staff ? Number(v.staff) : null,
        student: v.student ? Number(v.student) : null,
        alumni: v.alumni ? Number(v.alumni) : null,
      };
    if (type === "rewardCategory")
      d = { ...v, default_points: Number(v.default_points) };
    if (type === "reward")
      d = {
        category: Number(v.category),
        student: v.student ? Number(v.student) : null,
        staff: v.staff ? Number(v.staff) : null,
        alumni: v.alumni ? Number(v.alumni) : null,
        title: v.title,
        citation: v.citation,
        points: Number(v.points || 0),
      };
    if (type === "engagement")
      d = {
        alumni: Number(v.alumni),
        engagement_type: v.engagement_type,
        title: v.title,
        date: v.date,
        details: v.details,
        amount: Number(v.amount || 0),
      };
    try {
      await m.mutateAsync(d);
      toast.success("ریکارڈ محفوظ ہو گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] overflow-y-auto text-right"
      >
        <DialogHeader>
          <DialogTitle>نیا ریکارڈ</DialogTitle>
          <DialogDescription>مطلوبہ معلومات درج کریں۔</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {type === "disciplineCategory" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="زمرہ"
                  className={input}
                />
                <input
                  name="code"
                  required
                  placeholder="کوڈ"
                  className={input}
                />
                <select name="default_severity" className={input}>
                  <option value="minor">معمولی</option>
                  <option value="moderate">درمیانہ</option>
                  <option value="major">سنگین</option>
                  <option value="critical">انتہائی</option>
                </select>
              </>
            )}
            {type === "incident" && (
              <>
                <select name="student" required className={input}>
                  <option value="">طالب علم</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
                <select name="category" required className={input}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  name="incident_date"
                  type="date"
                  required
                  className={input}
                />
                <select name="severity" className={input}>
                  <option value="minor">معمولی</option>
                  <option value="moderate">درمیانہ</option>
                  <option value="major">سنگین</option>
                  <option value="critical">انتہائی</option>
                </select>
                <input name="location" placeholder="مقام" className={input} />
                <textarea
                  name="description"
                  required
                  placeholder="واقعہ کی تفصیل"
                  className="min-h-28 rounded-lg border p-3"
                />
              </>
            )}
            {type === "program" && (
              <>
                <input
                  name="title"
                  required
                  placeholder="تربیتی پروگرام"
                  className={input}
                />
                <textarea
                  name="description"
                  className="min-h-20 rounded-lg border p-3"
                />
                <select name="audience" className={input}>
                  <option value="staff">عملہ</option>
                  <option value="students">طلبہ</option>
                  <option value="both">دونوں</option>
                  <option value="alumni">سابق طلبہ</option>
                </select>
                <input
                  name="trainer_name"
                  placeholder="ٹرینر"
                  className={input}
                />
                <input
                  name="starts_at"
                  type="datetime-local"
                  defaultValue={now()}
                  required
                  className={input}
                />
                <input
                  name="ends_at"
                  type="datetime-local"
                  required
                  className={input}
                />
                <input name="venue" placeholder="مقام" className={input} />
                <input
                  name="capacity"
                  type="number"
                  defaultValue="30"
                  className={input}
                />
                <input
                  name="passing_score"
                  type="number"
                  defaultValue="50"
                  className={input}
                />
              </>
            )}
            {type === "enrollment" && (
              <>
                <select name="program" required className={input}>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <select name="staff" className={input}>
                  <option value="">عملہ</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
                <select name="student" className={input}>
                  <option value="">یا طالب علم</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
                <select name="alumni" className={input}>
                  <option value="">یا سابق طالب علم</option>
                  {alumni.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.student_name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {type === "rewardCategory" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="انعام زمرہ"
                  className={input}
                />
                <input
                  name="code"
                  required
                  placeholder="کوڈ"
                  className={input}
                />
                <select name="recipient_kind" className={input}>
                  <option value="any">سب</option>
                  <option value="student">طلبہ</option>
                  <option value="staff">عملہ</option>
                  <option value="alumni">سابق طلبہ</option>
                </select>
                <input
                  name="default_points"
                  type="number"
                  defaultValue="10"
                  className={input}
                />
              </>
            )}
            {type === "reward" && (
              <>
                <select name="category" required className={input}>
                  {rewardCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select name="student" className={input}>
                  <option value="">طالب علم</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
                <select name="staff" className={input}>
                  <option value="">یا عملہ</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
                <select name="alumni" className={input}>
                  <option value="">یا سابق طالب علم</option>
                  {alumni.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.student_name}
                    </option>
                  ))}
                </select>
                <input
                  name="title"
                  required
                  placeholder="انعام عنوان"
                  className={input}
                />
                <textarea
                  name="citation"
                  required
                  placeholder="وجہ / اعزازی عبارت"
                  className="min-h-24 rounded-lg border p-3"
                />
                <input
                  name="points"
                  type="number"
                  defaultValue="0"
                  className={input}
                />
              </>
            )}
            {type === "engagement" && (
              <>
                <select name="alumni" required className={input}>
                  {alumni.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.student_name}
                    </option>
                  ))}
                </select>
                <select name="engagement_type" className={input}>
                  <option value="event">تقریب</option>
                  <option value="volunteer">رضاکار</option>
                  <option value="mentorship">رہنمائی</option>
                  <option value="donation">عطیہ</option>
                  <option value="visit">دورہ</option>
                </select>
                <input
                  name="title"
                  required
                  placeholder="عنوان"
                  className={input}
                />
                <input name="date" type="date" required className={input} />
                <textarea
                  name="details"
                  className="min-h-20 rounded-lg border p-3"
                />
                <input
                  name="amount"
                  type="number"
                  min="0"
                  defaultValue="0"
                  className={input}
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
export default function StudentDevelopmentPage() {
  const [dialog, setDialog] = useState(null);
  const { data: dash, isLoading } = useDevelopmentDashboard();
  const { data: categories = [] } = useDisciplineCategories();
  const { data: incidents = [] } = useDisciplineIncidents();
  const { data: programs = [] } = useTrainingPrograms();
  const { data: rewardCategories = [] } = useRewardCategories();
  const { data: rewards = [] } = useRewards();
  const { data: alumni = [] } = useAlumni();
  const { data: engagements = [] } = useAlumniEngagements();
  const { data: students = [] } = useAllStudents();
  const { data: staff = [] } = useTeachers();
  const mutations = {
    disciplineCategory: useCreateDisciplineCategory(),
    incident: useCreateDisciplineIncident(),
    program: useCreateTrainingProgram(),
    enrollment: useCreateTrainingEnrollment(),
    rewardCategory: useCreateRewardCategory(),
    reward: useCreateReward(),
    engagement: useCreateAlumniEngagement(),
  };
  const incidentAction = useIncidentAction();
  const rewardAction = useRewardAction();
  async function act(m, id, action, message) {
    try {
      await m.mutateAsync({
        id,
        action,
        data: { findings: "تحقیق مکمل", resolution: "اصلاحی کارروائی مکمل" },
      });
      toast.success(message);
    } catch (e) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(e));
    }
  }
  if (isLoading) return <Skeleton className="h-150" />;
  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-medium text-primary">طلبہ و ادارہ ترقی</p>
        <h1 className="text-3xl font-bold">
          انضباط، تربیت، انعامات اور سابق طلبہ
        </h1>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border p-5">
          <ShieldAlert />
          <p>کھلے واقعات</p>
          <strong className="text-3xl">{dash?.open_incidents || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <BookOpenCheck />
          <p>جاری تربیت</p>
          <strong className="text-3xl">{dash?.active_training || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <Award />
          <p>عطا شدہ انعامات</p>
          <strong className="text-3xl">{dash?.awarded_rewards || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <GraduationCap />
          <p>سابق طلبہ</p>
          <strong className="text-3xl">{dash?.alumni || 0}</strong>
        </article>
      </section>
      <Tabs defaultValue="discipline">
        <TabsList className="flex-wrap">
          <TabsTrigger value="discipline">انضباط</TabsTrigger>
          <TabsTrigger value="training">تربیت</TabsTrigger>
          <TabsTrigger value="rewards">انعامات</TabsTrigger>
          <TabsTrigger value="alumni">سابق طلبہ</TabsTrigger>
        </TabsList>
        <TabsContent value="discipline">
          <div className="mb-3 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDialog("disciplineCategory")}
            >
              <Plus />
              زمرہ
            </Button>
            <Button onClick={() => setDialog("incident")}>
              <Plus />
              واقعہ
            </Button>
          </div>
          <div className="space-y-3">
            {incidents.map((i) => (
              <article key={i.id} className="rounded-xl border p-5">
                <div className="flex justify-between">
                  <div>
                    <strong>
                      {i.incident_number} — {i.student_name}
                    </strong>
                    <p>
                      {i.category_name} · {i.severity} · {i.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {i.status === "reported" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          act(
                            incidentAction,
                            i.id,
                            "start_investigation",
                            "تحقیق شروع",
                          )
                        }
                      >
                        تحقیق
                      </Button>
                    )}
                    {["investigating", "action_pending", "appealed"].includes(
                      i.status,
                    ) && (
                      <Button
                        size="sm"
                        onClick={() =>
                          act(
                            incidentAction,
                            i.id,
                            "resolve",
                            "واقعہ حل ہو گیا",
                          )
                        }
                      >
                        حل
                      </Button>
                    )}
                  </div>
                </div>
                <p className="mt-3">{i.description}</p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="training">
          <div className="mb-3 flex gap-2">
            <Button onClick={() => setDialog("program")}>
              <Plus />
              پروگرام
            </Button>
            <Button variant="outline" onClick={() => setDialog("enrollment")}>
              داخلہ
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {programs.map((p) => (
              <article key={p.id} className="rounded-xl border p-5">
                <h2 className="font-bold">{p.title}</h2>
                <p>
                  {p.trainer_name} · {p.audience} · {p.status}
                </p>
                <p>{p.enrolled_count} شرکاء</p>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="rewards">
          <div className="mb-3 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDialog("rewardCategory")}
            >
              <Plus />
              زمرہ
            </Button>
            <Button onClick={() => setDialog("reward")}>
              <Award />
              نامزدگی
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((r) => (
              <article key={r.id} className="rounded-xl border p-5">
                <h2 className="font-bold">
                  {r.recipient_name} — {r.title}
                </h2>
                <p>
                  {r.category_name} · {r.points} پوائنٹس · {r.status}
                </p>
                <div className="mt-3 flex gap-2">
                  {r.status === "nominated" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        rewardAction.mutate({ id: r.id, action: "approve" })
                      }
                    >
                      منظور
                    </Button>
                  )}
                  {r.status === "approved" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        rewardAction.mutate({ id: r.id, action: "award" })
                      }
                    >
                      عطا کریں
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="alumni">
          <Button className="mb-3" onClick={() => setDialog("engagement")}>
            <Plus />
            سرگرمی
          </Button>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {alumni.map((a) => (
              <article key={a.id} className="rounded-xl border p-5">
                <h2 className="font-bold">{a.student_name}</h2>
                <p>
                  {a.occupation || "پیشہ غیر درج"} · {a.employer}
                </p>
                <p>
                  {a.current_phone} · {a.email}
                </p>
              </article>
            ))}
          </div>
          <h2 className="my-4 font-bold">سرگرمیاں</h2>
          {engagements.map((e) => (
            <p key={e.id} className="mb-2 rounded-lg border p-3">
              {e.alumni_name} — {e.title} — {e.engagement_type}
            </p>
          ))}
        </TabsContent>
      </Tabs>
      <Form
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(o) => !o && setDialog(null)}
        categories={categories}
        rewardCategories={rewardCategories}
        students={students}
        staff={staff}
        alumni={alumni}
        programs={programs}
        mutations={mutations}
      />
    </div>
  );
}
