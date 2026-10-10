"use client";

import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FilePlus2,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import {
  useAdmissionApplications,
  useCreateAdmissionApplication,
  useDeleteAdmissionApplication,
  useDecideAdmission,
  useAdmitApplicant,
  useRecordAdmissionTest,
  useScheduleAdmissionInterview,
} from "@/hooks/useStudents";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50";
const emptyApplication = {
  full_name: "",
  father_name: "",
  mother_name: "",
  guardian_name: "",
  guardian_relation: "",
  guardian_phone: "",
  alternate_phone: "",
  date_of_birth: "",
  gender: "male",
  address: "",
  village: "",
  tehsil: "",
  district: "",
  previous_institution: "",
  previous_education: "",
  requested_class: "",
  special_education_needs: "",
  emergency_contact: "",
  source: "",
  notes: "",
};
const statusLabels = {
  submitted: "درخواست موصول",
  interview_scheduled: "انٹرویو مقرر",
  interviewed: "انٹرویو مکمل",
  test_scheduled: "ٹیسٹ مقرر",
  tested: "ٹیسٹ مکمل",
  approved: "منظور",
  rejected: "نامنظور",
  waitlisted: "انتظار فہرست",
  admitted: "داخلہ مکمل",
  cancelled: "منسوخ",
};
const fields = [
  ["full_name", "نام", true],
  ["father_name", "والد کا نام", true],
  ["mother_name", "والدہ (ماں) کا نام"],
  ["guardian_name", "سرپرست کا نام", true],
  ["guardian_relation", "رشتہ"],
  ["guardian_phone", "رابطہ نمبر", true],
  ["alternate_phone", "متبادل رابطہ"],
  ["date_of_birth", "تاریخ پیدائش", false, "date"],
  ["village", "گاؤں"],
  ["tehsil", "تحصیل"],
  ["district", "ضلع"],
  ["previous_institution", "سابقہ ادارہ"],
  ["previous_education", "سابقہ تعلیم"],
  ["emergency_contact", "ہنگامی رابطہ"],
  ["source", "درخواست کا ذریعہ"],
];

function Dialog({ title, children, onClose, fullScreen = false }) {
  return (
    <div
      className={`fixed inset-0 z-50 grid bg-foreground/30 ${fullScreen ? "place-items-stretch p-0" : "place-items-center p-4"}`}
      onMouseDown={onClose}
    >
      <section
        className={
          fullScreen
            ? "h-dvh w-full overflow-y-auto bg-card"
            : "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6"
        }
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className={
            fullScreen
              ? "sticky top-0 z-10 border-b border-border bg-card/95 px-5 py-4 backdrop-blur sm:px-8"
              : "mb-5"
          }
        >
          <div
            className={`flex items-center justify-between gap-3 ${fullScreen ? "mx-auto max-w-6xl" : ""}`}
          >
            <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
            <Button type="button" variant="outline" onClick={onClose}>
              بند کریں
            </Button>
          </div>
        </div>
        <div
          className={
            fullScreen ? "mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8" : ""
          }
        >
          {children}
        </div>
      </section>
    </div>
  );
}

export default function AdmissionPipelinePage() {
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyApplication);
  const { data, isLoading } = useAdmissionApplications({ search });
  const { data: classes = [] } = useAcademicClasses();
  const createApplication = useCreateAdmissionApplication();
  const deleteApplication = useDeleteAdmissionApplication();
  const scheduleInterview = useScheduleAdmissionInterview();
  const recordTest = useRecordAdmissionTest();
  const decide = useDecideAdmission();
  const admit = useAdmitApplicant();
  const applications = data?.results || [];

  function openAction(type, application = null) {
    setSelected(application);
    setDialog(type);
  }
  async function submitApplication(event) {
    event.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value !== ""),
    );
    if (payload.requested_class) {
      payload.requested_class = Number(payload.requested_class);
    }
    try {
      await createApplication.mutateAsync(payload);
      setForm(emptyApplication);
      setDialog(null);
      toast.success("درخواست محفوظ ہو گئی");
    } catch (error) {
      toast.error(
        "درخواست محفوظ نہیں ہو سکی",
        getApiErrorMessage(error, "درج کردہ معلومات دوبارہ چیک کریں۔"),
      );
    }
  }
  async function action(mutation, payload, success) {
    try {
      await mutation.mutateAsync({ id: selected.id, ...payload });
      setDialog(null);
      setSelected(null);
      toast.success(success);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }

  async function removeApplication(application) {
    if (
      !window.confirm(
        `${application.full_name} کی داخلہ درخواست مستقل حذف کر دی جائے؟`,
      )
    )
      return;
    try {
      await deleteApplication.mutateAsync(application.id);
      toast.success("داخلہ درخواست حذف ہو گئی");
    } catch (error) {
      toast.error(
        "درخواست حذف نہیں ہو سکی",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            داخلہ و طالب علم لائف سائیکل
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            داخلہ درخواستیں
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            درخواست، انٹرویو، داخلہ ٹیسٹ، منظوری اور مستقل طالب علم ریکارڈ
          </p>
        </div>
        <Button type="button" onClick={() => openAction("application")}>
          <FilePlus2 /> نئی درخواست
        </Button>
      </header>
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="نام، درخواست نمبر یا سرپرست تلاش کریں"
          className={`${inputClass} pr-9`}
        />
      </div>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64" />
          ))}
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {application.application_number}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    {application.full_name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    سرپرست: {application.guardian_name}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {statusLabels[application.status] || application.status}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">
                    درخواست تاریخ
                  </dt>
                  <dd dir="ltr">{application.application_date}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    مطلوبہ جماعت
                  </dt>
                  <dd>{application.requested_class_name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">انٹرویو</dt>
                  <dd>{application.interviews.length}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">ٹیسٹ</dt>
                  <dd>{application.tests.length}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {application.status !== "admitted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAction("interview", application)}
                  >
                    <CalendarClock /> انٹرویو
                  </Button>
                )}
                {application.status !== "admitted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAction("test", application)}
                  >
                    <ClipboardCheck /> ٹیسٹ
                  </Button>
                )}
                {!["approved", "admitted", "rejected"].includes(
                  application.status,
                ) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAction("decision", application)}
                  >
                    <CheckCircle2 /> فیصلہ
                  </Button>
                )}
                {application.status === "approved" && (
                  <Button
                    size="sm"
                    onClick={() => openAction("admit", application)}
                  >
                    <UserCheck /> داخلہ مکمل کریں
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={
                    deleteApplication.isPending &&
                    deleteApplication.variables === application.id
                  }
                  onClick={() => removeApplication(application)}
                >
                  <Trash2 />
                  {deleteApplication.isPending &&
                  deleteApplication.variables === application.id
                    ? "حذف ہو رہی ہے..."
                    : "حذف کریں"}
                </Button>
              </div>
            </article>
          ))}
          {!applications.length && (
            <p className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              کوئی داخلہ درخواست موجود نہیں۔
            </p>
          )}
        </section>
      )}

      {dialog === "application" && (
        <Dialog
          title="نئی داخلہ درخواست"
          onClose={() => setDialog(null)}
          fullScreen
        >
          <form
            onSubmit={submitApplication}
            className="grid gap-4 sm:grid-cols-2"
          >
            {fields.map(([name, label, required, type]) => (
              <label key={name} className="grid gap-2 text-sm font-medium">
                {label}
                <input
                  name={name}
                  type={type || "text"}
                  required={required}
                  value={form[name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-medium">
              جنس
              <select
                value={form.gender}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gender: event.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="male">طالب</option>
                <option value="female">طالبہ</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              مطلوبہ جماعت
              <select
                required
                value={form.requested_class}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    requested_class: event.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="">منتخب کریں</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium sm:col-span-2">
              پتہ
              <textarea
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                rows={3}
                className={inputClass.replace("h-10", "min-h-20 py-2")}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium sm:col-span-2">
              خصوصی تعلیمی ضرورت
              <textarea
                value={form.special_education_needs}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    special_education_needs: event.target.value,
                  }))
                }
                rows={2}
                className={inputClass.replace("h-10", "min-h-16 py-2")}
              />
            </label>
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" disabled={createApplication.isPending}>
                {createApplication.isPending
                  ? "محفوظ ہو رہی ہے..."
                  : "درخواست محفوظ کریں"}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
      {dialog === "interview" && (
        <Dialog
          title={`${selected.full_name} — انٹرویو`}
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              action(
                scheduleInterview,
                { data: Object.fromEntries(new FormData(event.currentTarget)) },
                "انٹرویو مقرر ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <label className="grid gap-2 text-sm font-medium">
              تاریخ اور وقت
              <input
                name="scheduled_at"
                type="datetime-local"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              نوٹس
              <textarea
                name="notes"
                rows={4}
                className={inputClass.replace("h-10", "min-h-24 py-2")}
              />
            </label>
            <Button type="submit" disabled={scheduleInterview.isPending}>
              {scheduleInterview.isPending
                ? "محفوظ ہو رہا ہے..."
                : "انٹرویو مقرر کریں"}
            </Button>
          </form>
        </Dialog>
      )}
      {dialog === "test" && (
        <Dialog
          title={`${selected.full_name} — داخلہ ٹیسٹ`}
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = Object.fromEntries(
                new FormData(event.currentTarget),
              );
              data.completed_at = new Date().toISOString();
              action(recordTest, { data }, "ٹیسٹ ریکارڈ محفوظ ہو گیا");
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <label className="grid gap-2 text-sm font-medium">
              کل نمبر
              <input
                name="total_marks"
                type="number"
                defaultValue="100"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              پاسنگ نمبر
              <input
                name="passing_marks"
                type="number"
                defaultValue="40"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              حاصل کردہ نمبر
              <input
                name="obtained_marks"
                type="number"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              نتیجہ
              <select name="outcome" className={inputClass}>
                <option value="pass">کامیاب</option>
                <option value="fail">ناکام</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium sm:col-span-2">
              رپورٹ
              <textarea
                name="report"
                rows={4}
                className={inputClass.replace("h-10", "min-h-24 py-2")}
              />
            </label>
            <Button
              type="submit"
              disabled={recordTest.isPending}
              className="sm:col-span-2"
            >
              {recordTest.isPending ? "محفوظ ہو رہا ہے..." : "ٹیسٹ محفوظ کریں"}
            </Button>
          </form>
        </Dialog>
      )}
      {dialog === "decision" && (
        <Dialog
          title={`${selected.full_name} — داخلہ فیصلہ`}
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              action(
                decide,
                { data: Object.fromEntries(new FormData(event.currentTarget)) },
                "داخلہ فیصلہ محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <label className="grid gap-2 text-sm font-medium">
              فیصلہ
              <select name="decision" className={inputClass}>
                <option value="approved">منظور</option>
                <option value="rejected">نامنظور</option>
                <option value="waitlisted">انتظار فہرست</option>
                <option value="deferred">مؤخر</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              منظور شدہ جماعت
              <select
                name="approved_class"
                defaultValue={selected.requested_class}
                className={inputClass}
              >
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              شرائط / نوٹس
              <textarea
                name="conditions"
                rows={4}
                className={inputClass.replace("h-10", "min-h-24 py-2")}
              />
            </label>
            <Button type="submit" disabled={decide.isPending}>
              {decide.isPending ? "محفوظ ہو رہا ہے..." : "فیصلہ محفوظ کریں"}
            </Button>
          </form>
        </Dialog>
      )}
      {dialog === "admit" && (
        <Dialog
          title={`${selected.full_name} — مستقل داخلہ`}
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              action(
                admit,
                {
                  admission_date: new FormData(event.currentTarget).get(
                    "admission_date",
                  ),
                },
                "طالب علم کا مستقل داخلہ مکمل ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <p className="rounded-xl bg-primary/10 p-4 text-sm">
              اس مرحلے پر مستقل Student ID جاری ہوگی اور موجودہ تعلیمی سال میں
              enrollment بنے گا۔
            </p>
            <label className="grid gap-2 text-sm font-medium">
              داخلہ تاریخ
              <input
                name="admission_date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
                className={inputClass}
              />
            </label>
            <Button type="submit" disabled={admit.isPending}>
              {admit.isPending ? "داخلہ مکمل ہو رہا ہے..." : "داخلہ مکمل کریں"}
            </Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
