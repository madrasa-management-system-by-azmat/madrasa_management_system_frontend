"use client";

import { useState } from "react";
import { Pencil, Plus, ShieldCheck, UserCog, UsersRound } from "lucide-react";
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
  useCreateMadrasaUser,
  useMadrasaUsers,
  useUpdateMadrasaUser,
} from "@/hooks/useUsers";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const roles = { admin: "ایڈمن", operator: "آپریٹر", accountant: "اکاؤنٹنٹ" };

function UserDialog({ record, open, onOpenChange }) {
  const createUser = useCreateMadrasaUser();
  const updateUser = useUpdateMadrasaUser();
  const editing = Boolean(record);
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (editing)
        await updateUser.mutateAsync({
          id: record.id,
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            role: values.role,
            is_active: values.is_active === "true",
          },
        });
      else await createUser.mutateAsync(values);
      toast.success(editing ? "صارف اپ ڈیٹ ہو گیا" : "نیا صارف بنا دیا گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        "صارف محفوظ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  const pending = createUser.isPending || updateUser.isPending;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{editing ? "صارف میں ترمیم" : "نیا صارف"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              پہلا نام
              <input
                name="first_name"
                defaultValue={record?.first_name || ""}
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              آخری نام
              <input
                name="last_name"
                defaultValue={record?.last_name || ""}
                className={inputClass}
              />
            </label>
            {!editing && (
              <>
                <label className="grid gap-2 text-sm font-medium">
                  صارف نام
                  <input
                    name="username"
                    required
                    dir="ltr"
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  ای میل
                  <input
                    name="email"
                    type="email"
                    required
                    dir="ltr"
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  پاس ورڈ
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
                  موبائل نمبر
                  <input name="phone" dir="ltr" className={inputClass} />
                </label>
              </>
            )}
            <label className="grid gap-2 text-sm font-medium">
              کردار
              <select
                name="role"
                defaultValue={record?.role || "operator"}
                className={inputClass}
              >
                {Object.entries(roles).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {editing && (
              <label className="grid gap-2 text-sm font-medium">
                حیثیت
                <select
                  name="is_active"
                  defaultValue={String(record.is_active)}
                  className={inputClass}
                >
                  <option value="true">فعال</option>
                  <option value="false">غیر فعال</option>
                </select>
              </label>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              منسوخ
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "محفوظ ہو رہا ہے..." : "محفوظ کریں"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MadrasaUsersPage() {
  const { user } = useAuthContext();
  const [dialog, setDialog] = useState({ open: false, record: null });
  const { data: users = [], isLoading, isError } = useMadrasaUsers();
  if (user?.role !== "admin")
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        آپ کو صارفین کے انتظام کی اجازت نہیں ہے۔
      </p>
    );
  return (
    <div dir="rtl" className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />
            مدرسہ انتظام
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            صارفین کا انتظام
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            اپنے مدرسہ کے ایڈمن، آپریٹر اور اکاؤنٹنٹ اکاؤنٹس بنائیں اور منظم
            کریں۔
          </p>
        </div>
        <Button onClick={() => setDialog({ open: true, record: null })}>
          <Plus />
          نیا صارف
        </Button>
      </header>
      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-destructive">
          صارفین لوڈ نہیں ہو سکے۔
        </p>
      ) : (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-4">صارف</th>
                <th className="px-5 py-4">ای میل</th>
                <th className="px-5 py-4">کردار</th>
                <th className="px-5 py-4">حیثیت</th>
                <th className="px-5 py-4">عمل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 font-semibold">
                    {[item.first_name, item.last_name]
                      .filter(Boolean)
                      .join(" ") || item.username}
                    <p
                      className="text-xs font-normal text-muted-foreground"
                      dir="ltr"
                    >
                      {item.username}
                    </p>
                  </td>
                  <td className="px-5 py-4" dir="ltr">
                    {item.email}
                  </td>
                  <td className="px-5 py-4">{roles[item.role] || item.role}</td>
                  <td className="px-5 py-4">
                    {item.is_active ? (
                      <span className="text-success">فعال</span>
                    ) : (
                      <span className="text-destructive">غیر فعال</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {item.id === user?.id ? (
                      <span className="text-xs text-muted-foreground">
                        اپنا پروفائل صفحہ استعمال کریں
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="ترمیم"
                        onClick={() => setDialog({ open: true, record: item })}
                      >
                        <Pencil />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <UserDialog
        record={dialog.record}
        open={dialog.open}
        onOpenChange={(open) =>
          !open && setDialog({ open: false, record: null })
        }
      />
    </div>
  );
}
