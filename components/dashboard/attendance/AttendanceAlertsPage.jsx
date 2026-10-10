"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCheck,
  RefreshCw,
  Settings2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import {
  useAttendanceAlerts,
  useAttendanceAlertRules,
  useRefreshAttendanceAlerts,
  useUpdateAttendanceAlertRules,
  useUpdateAttendanceAlertStatus,
} from "@/hooks/useAttendance";
import { useAuthContext } from "@/context/AuthContext";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50";
const statuses = [
  { value: "open", label: "کھلے الرٹس" },
  { value: "acknowledged", label: "دیکھ لیے گئے" },
  { value: "resolved", label: "حل شدہ" },
  { value: "dismissed", label: "خارج شدہ" },
];
const types = [
  { value: "", label: "تمام اقسام" },
  { value: "consecutive_absence", label: "مسلسل غیر حاضری" },
  { value: "monthly_absence", label: "ماہانہ غیر حاضری" },
  { value: "repeated_late", label: "مسلسل تاخیر" },
];
const severityStyles = {
  warning: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
  critical: "bg-destructive text-destructive-foreground",
};

function Dialog({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4"
      onMouseDown={onClose}
    >
      <section
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </section>
    </div>
  );
}

export default function AttendanceAlertsPage() {
  const { user } = useAuthContext();
  const [status, setStatus] = useState("open");
  const [type, setType] = useState("");
  const [academicClass, setAcademicClass] = useState("");
  const [dialog, setDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ruleForm, setRuleForm] = useState(null);
  const { data, isLoading } = useAttendanceAlerts({
    status,
    alert_type: type || undefined,
    academic_class: academicClass || undefined,
  });
  const { data: rules } = useAttendanceAlertRules();
  const { data: classes = [] } = useAcademicClasses();
  const refresh = useRefreshAttendanceAlerts();
  const updateRules = useUpdateAttendanceAlertRules();
  const updateStatus = useUpdateAttendanceAlertStatus();
  const alerts = data?.results || [];

  async function refreshAlerts() {
    try {
      await refresh.mutateAsync();
      toast.success("حاضری الرٹس تازہ ہو گئے");
    } catch (error) {
      toast.error("الرٹس تازہ نہیں ہو سکے", getApiErrorMessage(error));
    }
  }
  async function saveRules(event) {
    event.preventDefault();
    try {
      const payload = {
        ...ruleForm,
        consecutive_absence_threshold: Number(
          ruleForm.consecutive_absence_threshold,
        ),
        monthly_absence_threshold: Number(ruleForm.monthly_absence_threshold),
        monthly_late_threshold: Number(ruleForm.monthly_late_threshold),
      };
      await updateRules.mutateAsync(payload);
      setDialog(null);
      await refreshAlerts();
      toast.success("الرٹ قواعد محفوظ ہو گئے");
    } catch (error) {
      toast.error("قواعد محفوظ نہیں ہو سکے", getApiErrorMessage(error));
    }
  }
  async function changeStatus(action, notes = "") {
    try {
      await updateStatus.mutateAsync({ id: selected.id, action, notes });
      setDialog(null);
      setSelected(null);
      toast.success("الرٹ کی حیثیت تبدیل ہو گئی");
    } catch (error) {
      toast.error("الرٹ تبدیل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">حاضری نگرانی</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">حاضری الرٹس</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            مسلسل غیر حاضری، ماہانہ زیادہ غیر حاضری اور تاخیر کی خودکار نگرانی
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === "admin" && (
            <Button
              variant="outline"
              onClick={() => {
                setRuleForm({ ...rules });
                setDialog("rules");
              }}
            >
              <Settings2 /> قواعد
            </Button>
          )}
          <Button onClick={refreshAlerts} disabled={refresh.isPending}>
            <RefreshCw className={refresh.isPending ? "animate-spin" : ""} />{" "}
            تازہ کریں
          </Button>
        </div>
      </header>
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium">
          حیثیت
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          الرٹ کی قسم
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            {types.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          جماعت
          <select
            value={academicClass}
            onChange={(e) => setAcademicClass(e.target.value)}
            className={inputClass}
          >
            <option value="">تمام جماعتیں</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </section>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64" />
          ))}
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${severityStyles[alert.severity]}`}
                  >
                    <AlertTriangle className="size-5" />
                  </span>
                  <div>
                    <Link
                      href={`/dashboard/students/${alert.student}`}
                      className="font-bold hover:text-primary"
                    >
                      {alert.student_name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {alert.registration_number} · {alert.class_name}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${severityStyles[alert.severity]}`}
                >
                  {alert.severity_label}
                </span>
              </div>
              <h2 className="mt-4 font-semibold">{alert.alert_type_label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {alert.reason}
              </p>
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span dir="ltr">
                  {alert.date_from} — {alert.date_to}
                </span>
                <span>{alert.count} دن</span>
              </div>
              {["open", "acknowledged"].includes(alert.status) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {alert.status === "open" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelected(alert);
                        changeStatus("acknowledge");
                      }}
                    >
                      <CheckCheck /> دیکھ لیا
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected(alert);
                      setDialog("resolve");
                    }}
                  >
                    <ShieldCheck /> حل کریں
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelected(alert);
                      setDialog("dismiss");
                    }}
                  >
                    <XCircle /> خارج کریں
                  </Button>
                </div>
              )}
            </article>
          ))}
          {!alerts.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center">
              <CheckCheck className="mx-auto size-10 text-success" />
              <p className="mt-3 text-muted-foreground">
                اس فلٹر میں کوئی حاضری الرٹ موجود نہیں۔
              </p>
            </div>
          )}
        </section>
      )}
      {dialog === "rules" && ruleForm && (
        <Dialog onClose={() => setDialog(null)}>
          <h2 className="text-xl font-bold">حاضری الرٹ قواعد</h2>
          <form onSubmit={saveRules} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              مسلسل غیر حاضری کی حد
              <input
                type="number"
                min="1"
                value={ruleForm.consecutive_absence_threshold}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    consecutive_absence_threshold: e.target.value,
                  })
                }
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ماہانہ غیر حاضری کی حد
              <input
                type="number"
                min="1"
                value={ruleForm.monthly_absence_threshold}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    monthly_absence_threshold: e.target.value,
                  })
                }
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ماہانہ تاخیر کی حد
              <input
                type="number"
                min="1"
                value={ruleForm.monthly_late_threshold}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    monthly_late_threshold: e.target.value,
                  })
                }
                className={inputClass}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={ruleForm.is_active}
                onChange={(e) =>
                  setRuleForm({ ...ruleForm, is_active: e.target.checked })
                }
              />{" "}
              خودکار الرٹس فعال رکھیں
            </label>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialog(null)}
              >
                منسوخ
              </Button>
              <Button type="submit" disabled={updateRules.isPending}>
                محفوظ کریں
              </Button>
            </div>
          </form>
        </Dialog>
      )}
      {["resolve", "dismiss"].includes(dialog) && (
        <Dialog onClose={() => setDialog(null)}>
          <h2 className="text-xl font-bold">
            {dialog === "resolve" ? "الرٹ حل کریں" : "الرٹ خارج کریں"}
          </h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              changeStatus(
                dialog,
                new FormData(event.currentTarget).get("notes"),
              );
            }}
            className="mt-5 grid gap-4"
          >
            <p className="rounded-xl bg-muted p-4 text-sm">
              {selected?.student_name} — {selected?.reason}
            </p>
            <label className="grid gap-2 text-sm font-medium">
              نوٹس
              <textarea
                name="notes"
                rows="4"
                required={dialog === "resolve"}
                className={inputClass.replace("h-10", "min-h-24 py-2")}
              />
            </label>
            <Button type="submit" disabled={updateStatus.isPending}>
              {dialog === "resolve" ? "حل شدہ نشان لگائیں" : "خارج کریں"}
            </Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
