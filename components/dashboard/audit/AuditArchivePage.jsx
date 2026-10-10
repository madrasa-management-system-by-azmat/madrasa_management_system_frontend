"use client";
import { useState } from "react";
import {
  Archive,
  FileLock2,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext";
import {
  useArchiveBatches,
  useArchivePolicies,
  useAuditDashboard,
  useAuditEvents,
  useCreateArchiveBatch,
  useCreateArchivePolicy,
  useCreateLegalHold,
  useLegalHolds,
  useReleaseLegalHold,
  useRestoreArchiveBatch,
  useVerifyAuditChain,
} from "@/hooks/useAudit";
import { getApiErrorMessage, toast } from "@/lib/toast";
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const dt = (value) =>
  value
    ? new Intl.DateTimeFormat("ur-PK", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
function Empty({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
export default function AuditArchivePage() {
  const { hasPermission } = useAuthContext();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const canView = hasPermission("audit.view");
  const canManage = hasPermission("audit.manage");
  const dashboard = useAuditDashboard({ enabled: canView }),
    events = useAuditEvents(filters),
    policies = useArchivePolicies(),
    batches = useArchiveBatches(),
    holds = useLegalHolds();
  const verify = useVerifyAuditChain(),
    createPolicy = useCreateArchivePolicy(),
    createBatch = useCreateArchiveBatch(),
    restore = useRestoreArchiveBatch(),
    createHold = useCreateLegalHold(),
    release = useReleaseLegalHold();
  async function act(mutation, payload, success) {
    try {
      const result = await mutation.mutateAsync(payload);
      if (success) toast.success(success);
      return result;
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  if (!canView)
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        آپ کو اس صفحہ تک رسائی کی اجازت نہیں ہے۔
      </p>
    );
  if (dashboard.isLoading) return <Loading />;
  const cards = [
    ["کل واقعات", dashboard.data?.events, ShieldCheck],
    ["آج کے واقعات", dashboard.data?.today, Search],
    ["آرکائیو بیچز", dashboard.data?.archives, Archive],
    ["قانونی پابندیاں", dashboard.data?.legal_holds, FileLock2],
  ];
  return (
    <main className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-bold text-foreground">
          آڈٹ لاگز اور آرکائیونگ
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          سرگرمی، ریکارڈ سالمیت، محفوظ آرکائیو اور قانونی پابندیوں کی مرکزی
          نگرانی
        </p>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="size-5 text-primary" />
            </div>
            <strong className="mt-2 block text-2xl text-foreground">
              {value ?? 0}
            </strong>
          </article>
        ))}
      </section>
      <Tabs defaultValue="events">
        <TabsList className="flex-wrap">
          <TabsTrigger value="events">آڈٹ واقعات</TabsTrigger>
          <TabsTrigger value="policies">آرکائیو پالیسیاں</TabsTrigger>
          <TabsTrigger value="batches">آرکائیو بیچز</TabsTrigger>
          <TabsTrigger value="holds">قانونی پابندیاں</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputClass}
              placeholder="عمل، صارف، ریکارڈ یا راستہ تلاش کریں"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setFilters({ search })}>
              <Search /> تلاش
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const r = await act(verify, undefined, null);
                if (r)
                  toast[r.valid ? "success" : "error"](
                    r.valid ? "آڈٹ چین درست ہے" : "آڈٹ چین میں مسئلہ ہے",
                    `${r.checked} واقعات چیک ہوئے`,
                  );
              }}
              disabled={verify.isPending}
            >
              <ShieldCheck /> سالمیت چیک کریں
            </Button>
          </div>
          {events.isLoading ? (
            <Loading />
          ) : !events.data?.length ? (
            <Empty>کوئی آڈٹ واقعہ موجود نہیں۔</Empty>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-225 text-right text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    {[
                      "تاریخ",
                      "زمرہ",
                      "عمل",
                      "صارف",
                      "ریکارڈ",
                      "راستہ",
                      "درخواست نمبر",
                    ].map((x) => (
                      <th className="p-3" key={x}>
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {events.data.map((e) => (
                    <tr key={e.id}>
                      <td className="p-3 whitespace-nowrap">
                        {dt(e.created_at)}
                      </td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3 font-medium">{e.action}</td>
                      <td className="p-3">{e.actor_label}</td>
                      <td className="p-3">
                        {e.entity_label || `${e.entity_type} #${e.entity_id}`}
                      </td>
                      <td className="p-3 ltr text-left">{e.path || "—"}</td>
                      <td className="p-3 font-mono text-xs">{e.request_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="policies" className="space-y-4">
          {canManage && (
            <form
              className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const d = Object.fromEntries(new FormData(e.currentTarget));
                d.age_days = Number(d.age_days);
                d.retention_years = Number(d.retention_years);
                d.terminal_statuses = d.terminal_statuses
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean);
                if (await act(createPolicy, d, "آرکائیو پالیسی محفوظ ہو گئی"))
                  e.currentTarget.reset();
              }}
            >
              <input
                required
                name="name"
                className={inputClass}
                placeholder="پالیسی نام"
              />
              <input
                required
                name="entity_type"
                className={inputClass}
                placeholder="مثال: students.student"
              />
              <input
                name="terminal_statuses"
                className={inputClass}
                placeholder="حالات: inactive,closed"
              />
              <input
                required
                name="age_days"
                type="number"
                defaultValue="365"
                className={inputClass}
              />
              <div className="flex gap-2">
                <input
                  required
                  name="retention_years"
                  type="number"
                  defaultValue="7"
                  className={inputClass}
                />
                <Button disabled={createPolicy.isPending}>
                  <Plus /> شامل کریں
                </Button>
              </div>
            </form>
          )}
          {!policies.data?.length ? (
            <Empty>کوئی آرکائیو پالیسی موجود نہیں۔</Empty>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {policies.data.map((p) => (
                <article
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {p.entity_type} · {p.age_days} دن بعد · {p.retention_years}{" "}
                    سال حفاظت
                  </p>
                </article>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="batches" className="space-y-4">
          {canManage && (
            <form
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row"
              onSubmit={async (e) => {
                e.preventDefault();
                const d = Object.fromEntries(new FormData(e.currentTarget));
                d.ids = d.ids
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean);
                if (await act(createBatch, d, "ریکارڈ آرکائیو ہو گئے"))
                  e.currentTarget.reset();
              }}
            >
              <input
                required
                name="entity_type"
                className={inputClass}
                placeholder="ماڈل: students.student"
              />
              <input
                required
                name="ids"
                className={inputClass}
                placeholder="ریکارڈ IDs: 1,2,3"
              />
              <Button disabled={createBatch.isPending}>
                <Archive /> آرکائیو کریں
              </Button>
            </form>
          )}
          {!batches.data?.length ? (
            <Empty>کوئی آرکائیو بیچ موجود نہیں۔</Empty>
          ) : (
            <div className="space-y-3">
              {batches.data.map((b) => (
                <article
                  key={b.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold">{b.batch_number}</h3>
                    <p className="text-sm text-muted-foreground">
                      {b.status} · {b.record_count} ریکارڈ · {dt(b.created_at)}
                    </p>
                  </div>
                  {b.status === "completed" && (
                    <Button
                      variant="outline"
                      onClick={() => act(restore, b.id, "آرکائیو بحال ہو گیا")}
                      disabled={restore.isPending}
                    >
                      <RotateCcw /> بحال کریں
                    </Button>
                  )}
                </article>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="holds" className="space-y-4">
          {canManage && (
            <form
              className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const d = Object.fromEntries(new FormData(e.currentTarget));
                if (await act(createHold, d, "قانونی پابندی نافذ ہو گئی"))
                  e.currentTarget.reset();
              }}
            >
              <input
                required
                name="name"
                className={inputClass}
                placeholder="پابندی کا نام"
              />
              <input
                required
                name="reason"
                className={inputClass}
                placeholder="وجہ"
              />
              <input
                name="entity_type"
                className={inputClass}
                placeholder="ماڈل (اختیاری)"
              />
              <div className="flex gap-2">
                <input
                  name="entity_id"
                  className={inputClass}
                  placeholder="ریکارڈ ID"
                />
                <Button disabled={createHold.isPending}>
                  <FileLock2 /> نافذ کریں
                </Button>
              </div>
            </form>
          )}
          {!holds.data?.length ? (
            <Empty>کوئی قانونی پابندی موجود نہیں۔</Empty>
          ) : (
            <div className="space-y-3">
              {holds.data.map((h) => (
                <article
                  key={h.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <h3 className="font-semibold">{h.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span>{h.reason}</span>
                      <span>
                        {h.entity_type
                          ? ` · ${h.entity_type} #${h.entity_id}`
                          : ""}
                      </span>
                    </p>
                  </div>
                  {h.is_active && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        act(release, h.id, "قانونی پابندی ختم ہو گئی")
                      }
                      disabled={release.isPending}
                    >
                      ختم کریں
                    </Button>
                  )}
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
