"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff, LockKeyhole, LogIn, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useAuth";

const inputClassName = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signIn, isPending, error, reset } = useLogin();

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    signIn({
      identifier: formData.get("identifier"),
      password: formData.get("password"),
      remember: formData.get("remember") === "on",
    });
  }

  const errorMessage = error?.response?.data?.non_field_errors?.[0]
    || error?.response?.data?.detail
    || "صارف نام، موبائل نمبر یا پاس ورڈ درست نہیں ہے۔";

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold">مدرسہ فیضان القرآن</p>
            <p className="text-xs text-muted-foreground">نظامِ انتظام</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-primary">خوش آمدید</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">اپنے اکاؤنٹ میں لاگ اِن کریں</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">نظام تک رسائی کے لیے اپنا صارف نام اور پاس ورڈ درج کریں۔</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium">
          صارف نام یا موبائل نمبر
          <span className="relative">
            <UserRound className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input className={`${inputClassName} pr-10`} name="identifier" placeholder="مثلاً admin یا 0300 1234567" autoComplete="username" onChange={reset} required />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          پاس ورڈ
          <span className="relative">
            <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input className={`${inputClassName} pr-10 pl-10`} type={showPassword ? "text" : "password"} name="password" placeholder="اپنا پاس ورڈ درج کریں" autoComplete="current-password" onChange={reset} required />
            <button
              type="button"
              className="absolute left-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label={showPassword ? "پاس ورڈ چھپائیں" : "پاس ورڈ دکھائیں"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <div className="flex items-center justify-between gap-3 text-sm">
          <a href="#forgot-password" className="font-medium text-primary transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">پاس ورڈ بھول گئے؟</a>
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
            <input type="checkbox" name="remember" className="size-4 accent-primary" />
            مجھے یاد رکھیں
          </label>
        </div>

        {error && <p className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{errorMessage}</p>}

        <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending}>
          <LogIn aria-hidden="true" />
          {isPending ? "لاگ اِن ہو رہا ہے..." : "لاگ اِن کریں"}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs leading-6 text-muted-foreground">مدرسہ کے مجاز عملے کے لیے۔ مدد درکار ہو تو منتظم سے رابطہ کریں۔</p>
    </div>
  );
}
