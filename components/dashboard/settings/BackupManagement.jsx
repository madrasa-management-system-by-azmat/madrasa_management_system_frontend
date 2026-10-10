"use client";

import {
  Archive,
  CalendarClock,
  Download,
  HardDrive,
  Play,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import {
  useBackupRuns,
  useBackupSchedule,
  useDownloadBackupRun,
  useRestoreBackupRun,
  useRunBackupNow,
  useUpdateBackupSchedule,
} from "@/hooks/useSettings";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const dateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("ur-PK", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
const size = (bytes) =>
  bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "—";
const statusLabels = {
  pending: "زیر انتظار",
  running: "جاری",
  completed: "مکمل",
  failed: "ناکام",
  skipped: "چھوڑ دیا",
  deleted: "حذف شدہ",
};

export default function BackupManagement() {
  const { hasPermission } = useAuthContext();
  const canView = hasPermission("settings.view");
  const canManage = hasPermission("settings.manage");
  const canBackup = hasPermission("settings.backup");
  const canRestore = hasPermission("settings.restore");
  const schedule = useBackupSchedule({ enabled: canView });
  const runs = useBackupRuns({ enabled: canView });
  const updateSchedule = useUpdateBackupSchedule();
  const runNow = useRunBackupNow();
  const download = useDownloadBackupRun();
  const restore = useRestoreBackupRun();

  if (!canView)
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-destructive">
        آپ کو بیک اپ کی معلومات دیکھنے کی اجازت نہیں ہے۔
      </p>
    );
  if (schedule.isLoading || runs.isLoading)
    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((x) => (
            <Skeleton key={x} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  async function saveSchedule(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.is_active = data.is_active === "on";
    data.weekday = Number(data.weekday);
    data.day_of_month = Number(data.day_of_month);
    data.retention_count = Number(data.retention_count);
    data.retention_days = Number(data.retention_days);
    data.include_media = data.include_media === "on";
    try {
      await updateSchedule.mutateAsync(data);
      toast.success("بیک اپ شیڈول محفوظ ہو گیا");
    } catch (error) {
      toast.error("شیڈول محفوظ نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function runBackup() {
    try {
      await runNow.mutateAsync();
      toast.success("بیک اپ مکمل ہو گیا");
    } catch (error) {
      toast.error("بیک اپ نہیں بن سکا", getApiErrorMessage(error));
    }
  }
  async function downloadRun(run) {
    try {
      const blob = await download.mutateAsync(run.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = run.filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("بیک اپ ڈاؤن لوڈ ہو گیا");
    } catch (error) {
      toast.error("ڈاؤن لوڈ نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function restoreRun(run) {
    if (
      !window.confirm(
        `${run.filename} بحال کرنے سے موجودہ مدرسہ کا ڈیٹا تبدیل ہو جائے گا۔ جاری رکھیں؟`,
      )
    )
      return;
    try {
      const result = await restore.mutateAsync(run.id);
      toast.success(
        "بیک اپ بحال ہو گیا",
        `${result.records} ریکارڈ بحال ہوئے۔`,
      );
    } catch (error) {
      toast.error("بیک اپ بحال نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  const records = runs.data || [];
  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-4">
          <CalendarClock className="size-5 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            اگلا خودکار بیک اپ
          </p>
          <strong>{dateTime(schedule.data?.next_run_at)}</strong>
        </article>
        <article className="rounded-xl border border-border bg-card p-4">
          <Archive className="size-5 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            آخری کامیاب بیک اپ
          </p>
          <strong>{dateTime(schedule.data?.last_success_at)}</strong>
        </article>
        <article className="rounded-xl border border-border bg-card p-4">
          <HardDrive className="size-5 text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">محفوظ بیک اپ</p>
          <strong>
            {records.filter((x) => x.status === "completed").length}
          </strong>
        </article>
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">خودکار شیڈول اور حفاظت</h3>
            <p className="text-sm text-muted-foreground">
              روزانہ، ہفتہ وار یا ماہانہ بیک اپ اور retention مقرر کریں۔
            </p>
          </div>
          {canBackup && (
            <Button
              type="button"
              onClick={runBackup}
              disabled={runNow.isPending}
            >
              <Play />
              {runNow.isPending ? "بن رہا ہے..." : "ابھی بیک اپ بنائیں"}
            </Button>
          )}
        </div>
        <form onSubmit={saveSchedule} className="grid gap-3 md:grid-cols-4">
          <label className="flex items-center gap-2">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={schedule.data?.is_active}
            />
            خودکار بیک اپ فعال
          </label>
          <select
            name="frequency"
            defaultValue={schedule.data?.frequency || "daily"}
            className={inputClass}
          >
            <option value="daily">روزانہ</option>
            <option value="weekly">ہفتہ وار</option>
            <option value="monthly">ماہانہ</option>
          </select>
          <input
            name="time_of_day"
            type="time"
            defaultValue={(schedule.data?.time_of_day || "02:00").slice(0, 5)}
            className={inputClass}
          />
          <select
            name="weekday"
            defaultValue={schedule.data?.weekday ?? 0}
            className={inputClass}
          >
            {["پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ", "اتوار"].map(
              (x, i) => (
                <option value={i} key={x}>
                  {x}
                </option>
              ),
            )}
          </select>
          <label className="grid gap-1 text-sm">
            مہینے کا دن
            <input
              name="day_of_month"
              type="number"
              min="1"
              max="28"
              defaultValue={schedule.data?.day_of_month || 1}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 text-sm">
            تعداد کی حد
            <input
              name="retention_count"
              type="number"
              min="1"
              defaultValue={schedule.data?.retention_count || 14}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 text-sm">
            دنوں کی حد
            <input
              name="retention_days"
              type="number"
              min="1"
              defaultValue={schedule.data?.retention_days || 30}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              name="include_media"
              type="checkbox"
              defaultChecked={schedule.data?.include_media ?? true}
            />
            میڈیا شامل کریں
          </label>
          {canManage && (
            <Button disabled={updateSchedule.isPending}>
              <Save />
              شیڈول محفوظ کریں
            </Button>
          )}
        </form>
      </section>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h3 className="font-bold">بیک اپ تاریخ</h3>
        </div>
        {!records.length ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            ابھی کوئی محفوظ بیک اپ موجود نہیں۔
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-right text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">تاریخ</th>
                  <th className="p-3">قسم</th>
                  <th className="p-3">حیثیت</th>
                  <th className="p-3">سائز</th>
                  <th className="p-3">میعاد</th>
                  <th className="p-3">عمل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((run) => (
                  <tr key={run.id}>
                    <td className="p-3">{dateTime(run.created_at)}</td>
                    <td className="p-3">{run.trigger}</td>
                    <td className="p-3">
                      {statusLabels[run.status] || run.status}
                      {run.error_message && (
                        <small className="block text-destructive">
                          {run.error_message}
                        </small>
                      )}
                    </td>
                    <td className="p-3" dir="ltr">
                      {size(run.size_bytes)}
                    </td>
                    <td className="p-3">{dateTime(run.expires_at)}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {canBackup && run.is_available && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadRun(run)}
                          >
                            <Download />
                            ڈاؤن لوڈ
                          </Button>
                        )}
                        {canRestore && run.is_available && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => restoreRun(run)}
                            disabled={restore.isPending}
                          >
                            <RotateCcw />
                            بحال
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
