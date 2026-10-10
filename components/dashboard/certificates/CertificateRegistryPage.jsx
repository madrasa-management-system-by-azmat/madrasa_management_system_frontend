"use client";
import { useState } from "react";
import {
  BadgeCheck,
  FileCheck2,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCertificateAction,
  useCertificateDashboard,
  useCertificates,
  useCreateCertificate,
} from "@/hooks/useCertificates";
import { useAllStudents } from "@/hooks/useStudents";
import { getApiErrorMessage, toast } from "@/lib/toast";
const input =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right";
const labels = {
  draft: "مسودہ",
  approved: "منظور",
  issued: "جاری",
  revoked: "منسوخ",
  superseded: "بدلا گیا",
};
export default function CertificateRegistryPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim();
  const { data: dash, isLoading } = useCertificateDashboard();
  const { data: rows = [], isFetching: isSearching } =
    useCertificates(normalizedSearch);
  const { data: students = [] } = useAllStudents();
  const create = useCreateCertificate();
  const action = useCertificateAction();
  async function submit(e) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    const student = students.find((s) => String(s.id) === v.student);
    try {
      await create.mutateAsync({
        certificate_type: v.certificate_type,
        recipient_kind: "student",
        student: Number(v.student),
        recipient_name_snapshot: student.full_name,
        recipient_identifier_snapshot: student.registration_number,
        title: v.title,
        body_snapshot: v.body_snapshot,
        credential_snapshot: {
          class_name: student.class_name,
          guardian_name: student.guardian_name,
        },
        source_type: "student_manual",
        source_fingerprint: `student:${student.id}:${v.certificate_type}:${v.source_key}`,
      });
      toast.success("سند رجسٹر ہو گئی");
      setOpen(false);
    } catch (error) {
      toast.error("سند محفوظ نہیں ہوئی", getApiErrorMessage(error));
    }
  }
  async function run(id, name, data = {}, message = "عمل مکمل ہو گیا") {
    try {
      await action.mutateAsync({ id, action: name, data });
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  if (isLoading) return <Skeleton className="h-150" />;
  return (
    <div className="space-y-7">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-primary">محفوظ اسناد</p>
          <h1 className="text-3xl font-bold">سند رجسٹر اور تصدیق</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus />
          نئی سند
        </Button>
      </header>
      <section className="grid gap-4 sm:grid-cols-4">
        <article className="rounded-2xl border p-5">
          <FileCheck2 />
          <p>کل</p>
          <strong className="text-3xl">{dash?.total || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <RefreshCw />
          <p>مسودے</p>
          <strong className="text-3xl">{dash?.draft || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <BadgeCheck />
          <p>جاری</p>
          <strong className="text-3xl">{dash?.issued || 0}</strong>
        </article>
        <article className="rounded-2xl border p-5">
          <ShieldAlert />
          <p>تصدیقات</p>
          <strong className="text-3xl">{dash?.verifications || 0}</strong>
        </article>
      </section>
      <section className="rounded-2xl border bg-card">
        <div className="relative border-b p-5">
          <Search className="absolute right-8 top-1/2 size-4 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="نمبر، نام یا عنوان"
            className={`${input} pr-10`}
          />
        </div>
        <div className="divide-y">
          {!normalizedSearch ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              متعلقہ سند دیکھنے کے لیے تصدیقی نمبر، نام یا عنوان تلاش کریں۔
            </p>
          ) : isSearching ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : rows.length ? (
            rows.map((c) => (
              <article
                key={c.id}
                className="grid gap-3 p-5 lg:grid-cols-[13rem_1fr_8rem_auto]"
              >
                <span className="font-mono text-xs" dir="ltr">
                  {c.serial_number}
                </span>
                <div>
                  <strong>
                    {c.recipient_name} — {c.title}
                  </strong>
                  <p className="text-sm text-muted-foreground">
                    {labels[c.status]} · Revision {c.revision_number}
                  </p>
                  {c.status === "issued" && (
                    <a
                      className="text-sm text-primary underline"
                      href={c.verification_url}
                      target="_blank"
                    >
                      تصدیقی صفحہ
                    </a>
                  )}
                </div>
                <span>{c.certificate_type}</span>
                <div className="flex gap-2">
                  {c.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => run(c.id, "approve", {}, "سند منظور")}
                    >
                      منظور
                    </Button>
                  )}
                  {c.status === "approved" && (
                    <Button
                      size="sm"
                      onClick={() => run(c.id, "issue", {}, "سند جاری")}
                    >
                      جاری
                    </Button>
                  )}
                  {c.status === "issued" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        run(
                          c.id,
                          "revoke",
                          { reason: "انتظامی منسوخی" },
                          "سند منسوخ",
                        )
                      }
                    >
                      منسوخ
                    </Button>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="p-10 text-center text-sm text-muted-foreground">
              تلاش کے مطابق کوئی سند نہیں ملی۔
            </p>
          )}
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>نئی قابل تصدیق سند</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit}>
            <div className="grid gap-4 p-5">
              <select name="student" required className={input}>
                <option value="">طالب علم</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} — {s.registration_number}
                  </option>
                ))}
              </select>
              <select name="certificate_type" className={input}>
                <option value="leaving">رخصتی سند</option>
                <option value="nazera">ناظرہ</option>
                <option value="hifz">حفظ</option>
                <option value="tarjama">ترجمہ</option>
                <option value="manual">دیگر</option>
              </select>
              <input
                name="title"
                required
                placeholder="سند عنوان"
                className={input}
              />
              <textarea
                name="body_snapshot"
                required
                placeholder="حتمی عبارت"
                className="min-h-36 rounded-lg border p-3"
              />
              <input
                name="source_key"
                defaultValue={new Date().toISOString()}
                type="hidden"
              />
            </div>
            <DialogFooter>
              <Button type="submit">محفوظ کریں</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
