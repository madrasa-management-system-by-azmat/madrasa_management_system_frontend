"use client";

import { useState } from "react";
import {
  Building2,
  Eye,
  KeyRound,
  Pencil,
  Plus,
  ShieldCheck,
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
import { useAuthContext } from "@/context/AuthContext";
import {
  useCreateMadrasa,
  useMadrasas,
  useResetMadrasaAdminPassword,
  useUpdateMadrasa,
} from "@/hooks/useUsers";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function CreateMadrasaDialog({ open, onOpenChange }) {
  const createMadrasa = useCreateMadrasa();
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await createMadrasa.mutateAsync(data);
      toast.success("مدرسہ اور ایڈمن بنا دیا گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        "مدرسہ محفوظ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>نیا مدرسہ اور ایڈمن</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          <label className="grid gap-2 text-sm font-medium">
            مدرسہ کا نام
            <input name="name" required className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            منفرد شناخت (slug)
            <input
              name="slug"
              required
              dir="ltr"
              pattern="[a-z0-9-]+"
              placeholder="example-madrasa"
              className={inputClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              ایڈمن صارف نام
              <input
                name="admin_username"
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ایڈمن ای میل
              <input
                name="admin_email"
                type="email"
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ایڈمن پاس ورڈ
              <input
                name="admin_password"
                type="password"
                minLength="8"
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ایڈمن کا پہلا نام
              <input name="admin_first_name" className={inputClass} />
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              منسوخ
            </Button>
            <Button type="submit" disabled={createMadrasa.isPending}>
              {createMadrasa.isPending ? "محفوظ ہو رہا ہے..." : "مدرسہ بنائیں"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditMadrasaDialog({ madrasa, open, onOpenChange }) {
  const updateMadrasa = useUpdateMadrasa();
  async function submit(event) {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const profile = {
      name: raw.profile_name,
      address: raw.address,
      city: raw.city,
      province: raw.province,
      country: raw.country,
      phone: raw.phone,
      email: raw.email,
      website: raw.website,
      principal_name: raw.principal_name,
      principal_title: raw.principal_title,
      registration_number: raw.registration_number,
      established_year: raw.established_year || null,
    };
    const data = {
      name: raw.name,
      is_active: raw.is_active === "true",
      profile,
    };
    try {
      await updateMadrasa.mutateAsync({ id: madrasa.id, data });
      toast.success("مدرسہ کی معلومات اپ ڈیٹ ہو گئیں");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        "مدرسہ محفوظ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  const profile = madrasa?.profile || {};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>مدرسہ کی معلومات میں ترمیم</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={submit}
          className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              مدرسہ کا نام
              <input
                name="name"
                defaultValue={madrasa?.name || ""}
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              حالت
              <select
                name="is_active"
                defaultValue={String(madrasa?.is_active)}
                className={inputClass}
              >
                <option value="true">فعال</option>
                <option value="false">غیر فعال</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              پرنٹ میں مدرسہ کا نام
              <input
                name="profile_name"
                defaultValue={profile.name || madrasa?.name || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              فون
              <input
                name="phone"
                defaultValue={profile.phone || ""}
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ای میل
              <input
                name="email"
                type="email"
                defaultValue={profile.email || ""}
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ویب سائٹ
              <input
                name="website"
                defaultValue={profile.website || ""}
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              شہر
              <input
                name="city"
                defaultValue={profile.city || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              صوبہ
              <input
                name="province"
                defaultValue={profile.province || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ملک
              <input
                name="country"
                defaultValue={profile.country || "Pakistan"}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              مہتمم / پرنسپل
              <input
                name="principal_name"
                defaultValue={profile.principal_name || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              عہدہ
              <input
                name="principal_title"
                defaultValue={profile.principal_title || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              رجسٹریشن نمبر
              <input
                name="registration_number"
                defaultValue={profile.registration_number || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              سن قیام
              <input
                name="established_year"
                type="number"
                defaultValue={profile.established_year || ""}
                dir="ltr"
                className={inputClass}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            مکمل پتہ
            <textarea
              name="address"
              defaultValue={profile.address || ""}
              rows={3}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              منسوخ
            </Button>
            <Button type="submit" disabled={updateMadrasa.isPending}>
              {updateMadrasa.isPending
                ? "محفوظ ہو رہا ہے..."
                : "تبدیلیاں محفوظ کریں"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({ madrasa, open, onOpenChange }) {
  const resetPassword = useResetMadrasaAdminPassword();
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.password !== values.confirm_password) {
      toast.error("پاس ورڈ مماثل نہیں ہیں");
      return;
    }
    try {
      await resetPassword.mutateAsync({
        id: madrasa.id,
        password: values.password,
      });
      toast.success("ایڈمن کا پاس ورڈ تبدیل ہو گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        "پاس ورڈ تبدیل نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>مدرسہ ایڈمن کا پاس ورڈ تبدیل کریں</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          <p className="text-sm text-muted-foreground">
            {madrasa?.name} کے ایڈمن:{" "}
            <span dir="ltr">{madrasa?.admin?.username || "—"}</span>
          </p>
          <label className="grid gap-2 text-sm font-medium">
            نیا پاس ورڈ
            <input
              name="password"
              type="password"
              minLength="8"
              required
              dir="ltr"
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            تصدیق پاس ورڈ
            <input
              name="confirm_password"
              type="password"
              minLength="8"
              required
              dir="ltr"
              className={inputClass}
            />
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              منسوخ
            </Button>
            <Button type="submit" disabled={resetPassword.isPending}>
              {resetPassword.isPending
                ? "تبدیل ہو رہا ہے..."
                : "پاس ورڈ تبدیل کریں"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MadrasaDetailsDialog({ madrasa, open, onOpenChange }) {
  const profile = madrasa?.profile || {};
  const details = [
    ["منفرد شناخت", madrasa?.slug, true],
    ["حالت", madrasa?.is_active ? "فعال" : "غیر فعال"],
    ["نام برائے پرنٹ", profile.name || madrasa?.name],
    ["فون", profile.phone, true],
    ["ای میل", profile.email, true],
    ["ویب سائٹ", profile.website, true],
    ["شہر", profile.city],
    ["صوبہ", profile.province],
    ["ملک", profile.country],
    ["مہتمم / پرنسپل", profile.principal_name],
    ["عہدہ", profile.principal_title],
    ["رجسٹریشن نمبر", profile.registration_number],
    ["سن قیام", profile.established_year, true],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>مدرسہ کی تفصیلات</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
          <div className="rounded-xl bg-primary/10 p-4">
            <h2 className="text-lg font-bold text-primary">{madrasa?.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {madrasa?.admin
                ? `ایڈمن: ${[madrasa.admin.first_name, madrasa.admin.last_name].filter(Boolean).join(" ") || madrasa.admin.username}`
                : "کوئی ایڈمن مقرر نہیں"}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {details.map(([label, value, ltr]) => (
              <article key={label} className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className="mt-1 text-sm font-semibold"
                  dir={ltr ? "ltr" : undefined}
                >
                  {value || "—"}
                </p>
              </article>
            ))}
          </div>
          <article className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">مکمل پتہ</p>
            <p className="mt-1 text-sm font-semibold">
              {profile.address || "—"}
            </p>
          </article>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            بند کریں
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SuperAdminPage() {
  const { user } = useAuthContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [resetting, setResetting] = useState(null);
  const [viewing, setViewing] = useState(null);
  const { data: madrasas = [], isLoading } = useMadrasas();
  const updateMadrasa = useUpdateMadrasa();
  async function toggleMadrasaStatus(madrasa) {
    try {
      await updateMadrasa.mutateAsync({
        id: madrasa.id,
        data: { is_active: !madrasa.is_active },
      });
      toast.success(
        madrasa.is_active
          ? "مدرسہ غیر فعال کر دیا گیا"
          : "مدرسہ فعال کر دیا گیا",
      );
    } catch (error) {
      toast.error(
        "مدرسہ کی حالت تبدیل نہیں ہو سکی",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  if (!user?.is_super_admin)
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        یہ صفحہ صرف سپر ایڈمن کے لیے ہے۔
      </p>
    );
  return (
    <div dir="rtl" className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />
            پلیٹ فارم انتظام
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            مدارس کا انتظام
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            مدرسہ بنائیں، اس کی معلومات اپ ڈیٹ کریں، اور مدرسہ ایڈمن کا پاس ورڈ
            تبدیل کریں۔
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          نیا مدرسہ
        </Button>
      </header>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-4">مدرسہ</th>
                <th className="px-5 py-4">ایڈمن</th>
                <th className="px-5 py-4">حالت</th>
                <th className="px-5 py-4">عمل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {madrasas.map((madrasa) => (
                <tr key={madrasa.id}>
                  <td className="px-5 py-4 font-semibold">
                    <span className="ml-2 inline-grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-4" />
                    </span>
                    {madrasa.name}
                    <p
                      className="mr-10 text-xs font-normal text-muted-foreground"
                      dir="ltr"
                    >
                      {madrasa.slug}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {madrasa.admin ? (
                      <>
                        <p>
                          {[madrasa.admin.first_name, madrasa.admin.last_name]
                            .filter(Boolean)
                            .join(" ") || madrasa.admin.username}
                        </p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          {madrasa.admin.email}
                        </p>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {madrasa.is_active ? (
                      <span className="text-success">فعال</span>
                    ) : (
                      <span className="text-destructive">غیر فعال</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMadrasaStatus(madrasa)}
                        disabled={updateMadrasa.isPending}
                      >
                        {madrasa.is_active ? "غیر فعال کریں" : "فعال کریں"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="مدرسہ کی تفصیلات دیکھیں"
                        onClick={() => setViewing(madrasa)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="مدرسہ میں ترمیم"
                        onClick={() => setEditing(madrasa)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="ایڈمن پاس ورڈ تبدیل کریں"
                        onClick={() => setResetting(madrasa)}
                        disabled={!madrasa.admin}
                      >
                        <KeyRound />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <CreateMadrasaDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditMadrasaDialog
        madrasa={editing}
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
      />
      <ResetPasswordDialog
        madrasa={resetting}
        open={Boolean(resetting)}
        onOpenChange={(open) => !open && setResetting(null)}
      />
      <MadrasaDetailsDialog
        madrasa={viewing}
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
      />
    </div>
  );
}
