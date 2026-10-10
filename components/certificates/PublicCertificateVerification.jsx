"use client";
import { useParams } from "next/navigation";
import { BadgeCheck, ShieldAlert, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicCertificate } from "@/hooks/useCertificates";
export default function PublicCertificateVerification() {
  const { id } = useParams();
  const { data, isLoading, isError } = usePublicCertificate(id);
  if (isLoading)
    return (
      <main className="grid min-h-screen place-items-center p-4">
        <Skeleton className="h-96 w-full max-w-xl" />
      </main>
    );
  const valid = data?.valid;
  return (
    <main
      dir="rtl"
      className="grid min-h-screen place-items-center bg-muted/30 p-4"
    >
      <section
        className={`w-full max-w-xl rounded-3xl border bg-card p-8 shadow-lg ${valid ? "border-success/40" : "border-destructive/40"}`}
      >
        <span
          className={`grid size-14 place-items-center rounded-2xl ${valid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
        >
          {valid ? (
            <BadgeCheck className="size-8" />
          ) : isError ? (
            <XCircle className="size-8" />
          ) : (
            <ShieldAlert className="size-8" />
          )}
        </span>
        <h1 className="mt-5 text-3xl font-bold">
          {valid
            ? "سند درست اور تصدیق شدہ ہے"
            : data?.status === "revoked"
              ? "سند منسوخ ہے"
              : "سند کی تصدیق نہیں ہو سکی"}
        </h1>
        {data && (
          <div className="mt-6 grid gap-4 rounded-2xl bg-muted/50 p-5 sm:grid-cols-2">
            <p>
              <small>سند نمبر</small>
              <strong className="block" dir="ltr">
                {data.serial_number}
              </strong>
            </p>
            <p>
              <small>قسم</small>
              <strong className="block">{data.title}</strong>
            </p>
            <p>
              <small>حاصل کنندہ</small>
              <strong className="block">{data.recipient_name}</strong>
            </p>
            <p>
              <small>شناخت</small>
              <strong className="block" dir="ltr">
                {data.recipient_identifier || "—"}
              </strong>
            </p>
            <p>
              <small>تاریخ اجرا</small>
              <strong className="block" dir="ltr">
                {data.issued_on}
              </strong>
            </p>
            <p>
              <small>جاری کنندہ</small>
              <strong className="block">{data.issuer?.name}</strong>
            </p>
          </div>
        )}
        {data?.revocation_reason && (
          <p className="mt-5 rounded-xl bg-destructive/10 p-4 text-destructive">
            وجہ: {data.revocation_reason}
          </p>
        )}
        <p className="mt-6 text-xs text-muted-foreground">
          یہ نتیجہ ادارے کے محفوظ سند رجسٹر، ڈیجیٹل دستخط اور موجودہ منسوخی
          حیثیت سے حاصل ہوا ہے۔
        </p>
      </section>
    </main>
  );
}
