"use client";

import { useParams, useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import {
  useActivateGuardian,
  useGuardianInvitation,
} from "@/hooks/useGuardians";
import { getApiErrorMessage, toast } from "@/lib/toast";
const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50";
export default function GuardianActivationPage() {
  const { token } = useParams();
  const router = useRouter();
  const { startSession } = useAuthContext();
  const { data, isLoading, isError } = useGuardianInvitation(token);
  const activate = useActivateGuardian();
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget),
      password = form.get("password"),
      confirm = form.get("confirm");
    if (password !== confirm) {
      toast.error("پاس ورڈ مطابقت نہیں رکھتے");
      return;
    }
    try {
      const auth = await activate.mutateAsync({
        token,
        password,
        communication_consent: true,
      });
      startSession(auth, true);
      toast.success("والدین اکاؤنٹ فعال ہو گیا");
      router.replace("/parent");
    } catch (error) {
      toast.error("اکاؤنٹ فعال نہیں ہوا", getApiErrorMessage(error));
    }
  }
  if (isLoading)
    return (
      <div className="mx-auto mt-20 max-w-md">
        <Skeleton className="h-96" />
      </div>
    );
  return (
    <main
      dir="rtl"
      className="grid min-h-screen place-items-center bg-muted/30 p-4"
    >
      <section className="w-full max-w-md rounded-3xl border bg-card p-7 shadow-lg">
        <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck />
        </span>
        <h1 className="mt-5 text-2xl font-bold">والدین پورٹل فعال کریں</h1>
        {isError ? (
          <p className="mt-5 rounded-xl bg-destructive/10 p-4 text-destructive">
            دعوتی لنک غلط یا میعاد ختم ہے۔
          </p>
        ) : (
          <>
            <p className="mt-2 text-muted-foreground">
              {data?.madrasa} · {data?.guardian} ·{" "}
              <span dir="ltr">{data?.phone}</span>
            </p>
            <form onSubmit={submit} className="mt-7 space-y-4">
              <label className="grid gap-2 text-sm font-medium">
                نیا پاس ورڈ
                <input
                  name="password"
                  type="password"
                  minLength="8"
                  required
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                پاس ورڈ دوبارہ
                <input
                  name="confirm"
                  type="password"
                  minLength="8"
                  required
                  className={inputClass}
                />
              </label>
              <Button
                className="w-full"
                type="submit"
                disabled={activate.isPending}
              >
                <LockKeyhole />
                {activate.isPending ? "فعال ہو رہا ہے..." : "اکاؤنٹ فعال کریں"}
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
