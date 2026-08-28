"use client";

import { useState } from "react";
import {
  Building2,
  Download,
  ImagePlus,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMadrasaProfile,
  downloadTenantBackup,
  useRestoreTenantBackup,
  useUpdateMadrasaProfile,
} from "@/hooks/useSettings";
import { getMediaUrl } from "@/lib/apiClient";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const fields = [
  ["name", "مدرسہ کا نام", "مثال: مدرسہ فیضان القرآن", true],
  ["name_english", "نام (English)", "Madrasa Faizan-ul-Quran"],
  ["phone", "مرکزی فون نمبر", "0300 1234567"],
  ["alternate_phone", "متبادل فون نمبر", ""],
  ["email", "ای میل", "info@madrasa.edu.pk", false, "email"],
  ["website", "ویب سائٹ", "https://example.edu.pk", false, "url"],
  ["city", "شہر", ""],
  ["province", "صوبہ", ""],
  ["country", "ملک", "Pakistan"],
  ["postal_code", "پوسٹل کوڈ", ""],
  ["principal_name", "مہتمم / پرنسپل کا نام", ""],
  ["principal_title", "عہدہ", "مہتمم"],
  ["registration_number", "رجسٹریشن نمبر", ""],
  ["established_year", "سنِ قیام", "مثال: 2005", false, "number"],
];

function MadrasaProfileForm({ profile }) {
  const updateProfile = useUpdateMadrasaProfile();
  const restoreBackup = useRestoreTenantBackup();
  const [values, setValues] = useState(profile);
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(getMediaUrl(profile.logo) || "");
  const [backupFile, setBackupFile] = useState(null);

  function changeValue(event) {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }
  function chooseLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setPreview(URL.createObjectURL(file));
  }
  async function submit(event) {
    event.preventDefault();
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (
        ["id", "logo", "updated_at"].includes(key) ||
        value === null ||
        value === undefined
      )
        continue;
      data.append(key, value);
    }
    if (logoFile) data.set("logo", logoFile);
    try {
      await updateProfile.mutateAsync(data);
      setLogoFile(null);
      toast.success("مدرسہ کی معلومات محفوظ ہو گئیں");
    } catch (error) {
      toast.error(
        "معلومات محفوظ نہیں ہو سکیں",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }

  async function downloadBackup() {
    try {
      const backup = await downloadTenantBackup();
      const url = URL.createObjectURL(backup);
      const link = document.createElement("a");
      link.href = url;
      link.download = `madrasa-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("بیک اپ ڈاؤن لوڈ ہو گیا");
    } catch (error) {
      toast.error(
        "بیک اپ ڈاؤن لوڈ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }

  async function restore() {
    if (!backupFile) return;
    if (
      !window.confirm(
        "بیک اپ بحال کرنے سے موجودہ مدرسہ کا ڈیٹا مکمل طور پر تبدیل ہو جائے گا۔ کیا آپ جاری رکھنا چاہتے ہیں؟",
      )
    )
      return;
    try {
      const result = await restoreBackup.mutateAsync(backupFile);
      setBackupFile(null);
      toast.success(
        "بیک اپ بحال ہو گیا",
        `${result.records} ریکارڈ بحال کیے گئے۔`,
      );
    } catch (error) {
      toast.error(
        "بیک اپ بحال نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }

  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Building2 className="size-4" />
          سسٹم سیٹنگز
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          مدرسہ کی معلومات
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          اپنے مدرسہ کا نام، لوگو، رابطے اور انتظامی معلومات درج کریں۔ یہ
          معلومات پرنٹس اور سسٹم کی شناخت کے لیے استعمال ہوں گی۔
        </p>
      </header>
      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-bold">لوگو اور بنیادی شناخت</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              مدرسہ کا واضح لوگو اپ لوڈ کریں۔
            </p>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-input bg-muted">
              <>
                {preview ? (
                  <img
                    src={preview}
                    alt="مدرسہ کا لوگو"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImagePlus className="size-8 text-muted-foreground" />
                )}
              </>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              مدرسہ کا لوگو
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={chooseLogo}
                className="block w-full text-sm text-muted-foreground file:me-0 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
              />
              <span className="text-xs font-normal text-muted-foreground">
                PNG، JPG یا WebP فائل منتخب کریں۔
              </span>
            </label>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-bold">بیک اپ اور بحالی</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              اپنے مدرسہ کے ڈیٹا اور اپ لوڈ کی گئی تصاویر کا ZIP بیک اپ محفوظ
              کریں۔ بحالی صرف اسی مدرسہ کے بیک اپ سے کی جا سکتی ہے۔
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl bg-muted p-4">
              <h3 className="font-semibold">ڈیٹا بیک اپ</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                موجودہ طلبہ، فیس، امتحانات، حاضری، ہاسٹل، حفظ اور میڈیا فائلوں
                کی نقل ڈاؤن لوڈ کریں۔
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={downloadBackup}
                className="mt-4"
              >
                <Download />
                بیک اپ ڈاؤن لوڈ کریں
              </Button>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h3 className="font-semibold text-destructive">
                بیک اپ بحال کریں
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                احتیاط: بحالی موجودہ مدرسہ کا تمام ڈیٹا تبدیل کر دے گی۔ صرف اسی
                مدرسہ کا ZIP بیک اپ اپ لوڈ کریں۔
              </p>
              <input
                type="file"
                accept="application/zip,.zip"
                onChange={(event) =>
                  setBackupFile(event.target.files?.[0] || null)
                }
                className="mt-4 block w-full text-sm text-muted-foreground file:me-0 file:rounded-md file:border-0 file:bg-destructive file:px-3 file:py-2 file:text-sm file:font-medium file:text-destructive-foreground"
              />
              {backupFile && (
                <p className="mt-2 text-xs text-muted-foreground" dir="ltr">
                  {backupFile.name}
                </p>
              )}
              <Button
                type="button"
                variant="destructive"
                onClick={restore}
                disabled={!backupFile || restoreBackup.isPending}
                className="mt-4"
              >
                <RotateCcw />
                {restoreBackup.isPending
                  ? "بحال ہو رہا ہے..."
                  : "بیک اپ بحال کریں"}
              </Button>
            </div>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-bold">رابطہ اور انتظامی معلومات</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              یہ معلومات رسیدوں، فارم اور پرنٹ شدہ رپورٹس میں شامل کی جا سکتی
              ہیں۔
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([name, label, placeholder, required, type]) => (
              <label key={name} className="grid gap-2 text-sm font-medium">
                {label}
                <input
                  name={name}
                  type={type || "text"}
                  value={values[name] || ""}
                  onChange={changeValue}
                  placeholder={placeholder}
                  required={required}
                  dir={
                    type === "email" || type === "url" || type === "number"
                      ? "ltr"
                      : undefined
                  }
                  className={inputClass}
                />
              </label>
            ))}
          </div>
          <label className="mt-4 grid gap-2 text-sm font-medium">
            مکمل پتہ
            <textarea
              name="address"
              value={values.address || ""}
              onChange={changeValue}
              rows={4}
              placeholder="گلی، علاقہ، نزدیکی نشان وغیرہ"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
        </section>
        <div className="flex justify-end">
          <Button type="submit" disabled={updateProfile.isPending}>
            <Save />
            {updateProfile.isPending
              ? "محفوظ ہو رہا ہے..."
              : "معلومات محفوظ کریں"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  const { data: profile, isLoading } = useMadrasaProfile();
  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  return profile ? (
    <MadrasaProfileForm key={profile.updated_at} profile={profile} />
  ) : null;
}
