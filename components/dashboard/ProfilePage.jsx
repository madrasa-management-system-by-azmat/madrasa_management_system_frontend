"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AtSign,
  BadgeCheck,
  Camera,
  KeyRound,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext";
import { useChangePassword, useUpdateProfile } from "@/hooks/useProfile";
import { getMediaUrl } from "@/lib/apiClient";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function ProfileDetailsForm({ user }) {
  const updateProfile = useUpdateProfile();
  const [preview, setPreview] = useState(getMediaUrl(user?.photo) || "");
  const [photo, setPhoto] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const data = new FormData();
    data.set("first_name", values.first_name || "");
    data.set("last_name", values.last_name || "");
    data.set("phone", values.phone || "");
    if (photo) data.set("photo", photo);
    try {
      await updateProfile.mutateAsync(data);
      setPhoto(null);
      toast.success("پروفائل کی معلومات محفوظ ہو گئیں");
    } catch (error) {
      toast.error(
        "پروفائل محفوظ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  function choosePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl bg-muted p-4 sm:flex-row sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {preview ? (
            <Image
              src={preview}
              alt="پروفائل تصویر"
              width={80}
              height={80}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            (user?.first_name || user?.username || "ص").charAt(0)
          )}
        </div>
        <label className="grid gap-2 text-sm font-medium">
          پروفائل تصویر
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={choosePhoto}
            className="block w-full text-sm text-muted-foreground file:me-0 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
          />
          <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
            <Camera className="size-3" />
            PNG، JPG یا WebP منتخب کریں۔
          </span>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          پہلا نام
          <input
            name="first_name"
            defaultValue={user?.first_name || ""}
            className={inputClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          آخری نام
          <input
            name="last_name"
            defaultValue={user?.last_name || ""}
            className={inputClass}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          ای میل
          <input
            value={user?.email || ""}
            type="email"
            dir="ltr"
            disabled
            className={`${inputClass} cursor-not-allowed opacity-70`}
          />
          <span className="text-xs font-normal text-muted-foreground">
            ای میل تبدیل نہیں کی جا سکتی۔
          </span>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          موبائل نمبر
          <input
            name="phone"
            type="tel"
            dir="ltr"
            defaultValue={user?.phone || ""}
            className={inputClass}
          />
        </label>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={updateProfile.isPending}>
          <Save />
          {updateProfile.isPending
            ? "محفوظ ہو رہا ہے..."
            : "تبدیلیاں محفوظ کریں"}
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const changePassword = useChangePassword();
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.new_password !== values.confirm_password) {
      toast.error(
        "پاس ورڈ مماثل نہیں ہیں",
        "نیا پاس ورڈ اور تصدیق ایک جیسی ہونی چاہیے۔",
      );
      return;
    }
    try {
      await changePassword.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      toast.success(
        "پاس ورڈ تبدیل ہو گیا",
        "براہِ کرم نئے پاس ورڈ سے دوبارہ لاگ اِن کریں۔",
      );
      event.currentTarget.reset();
    } catch (error) {
      toast.error(
        "پاس ورڈ تبدیل نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium sm:col-span-2">
        موجودہ پاس ورڈ
        <input
          name="current_password"
          type="password"
          required
          dir="ltr"
          className={inputClass}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        نیا پاس ورڈ
        <input
          name="new_password"
          type="password"
          minLength="8"
          required
          dir="ltr"
          className={inputClass}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        نئے پاس ورڈ کی تصدیق
        <input
          name="confirm_password"
          type="password"
          minLength="8"
          required
          dir="ltr"
          className={inputClass}
        />
      </label>
      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit" disabled={changePassword.isPending}>
          <KeyRound />
          {changePassword.isPending
            ? "تبدیل ہو رہا ہے..."
            : "پاس ورڈ تبدیل کریں"}
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuthContext();
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "صارف";
  const initial = fullName.charAt(0) || "ص";
  const facts = [
    { label: "صارف نام", value: user?.username || "—", icon: AtSign },
    { label: "کردار", value: user?.role || "—", icon: BadgeCheck },
    { label: "موبائل نمبر", value: user?.phone || "—", icon: Phone },
  ];
  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <UserRound className="size-4" />
          میرا اکاؤنٹ
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          پروفائل اور سیکیورٹی
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          اپنی ذاتی معلومات، پروفائل تصویر اور اکاؤنٹ کی سیکیورٹی کو منظم کریں۔
        </p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="grid size-16 place-items-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {user?.photo ? (
              <Image
                src={getMediaUrl(user.photo)}
                alt={fullName}
                width={64}
                height={64}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p
              className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"
              dir="ltr"
            >
              <Mail className="size-3" />
              {user?.email || "ای میل شامل نہیں ہے"}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            {user?.role || "صارف"}
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {facts.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-muted p-3"
            >
              <div className="grid size-9 place-items-center rounded-lg bg-background text-primary">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className="mt-1 truncate text-sm font-semibold"
                  dir={label === "موبائل نمبر" ? "ltr" : undefined}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <UserRound className="size-4" />
            ذاتی معلومات
          </TabsTrigger>
          <TabsTrigger value="security">
            <KeyRound className="size-4" />
            پاس ورڈ اور سیکیورٹی
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="profile"
          className="rounded-xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="mb-5">
            <h2 className="font-bold">ذاتی معلومات</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              اپنا نام، موبائل نمبر اور پروفائل تصویر تبدیل کریں۔
            </p>
          </div>
          <ProfileDetailsForm key={`${user?.id}-${user?.photo}`} user={user} />
        </TabsContent>
        <TabsContent
          value="security"
          className="rounded-xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="mb-5">
            <h2 className="font-bold">پاس ورڈ تبدیل کریں</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ایک مضبوط نیا پاس ورڈ منتخب کریں، کم از کم 8 حروف ضروری ہیں۔
            </p>
          </div>
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
