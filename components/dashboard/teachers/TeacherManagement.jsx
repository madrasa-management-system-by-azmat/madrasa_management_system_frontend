"use client";

import { useDeferredValue, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  ImageUp,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateTeacher,
  useDeleteTeacher,
  useTeachers,
  useUpdateTeacher,
} from "@/hooks/useTeachers";
import { getApiErrorMessage, toast } from "@/lib/toast";
import { getMediaUrl } from "@/lib/apiClient";

const text = {
  title: "اساتذہ کا انتظام",
  description:
    "حفظ ڈائری کی تصدیق اور حلقہ کی رہنمائی کے لیے اساتذہ کا ریکارڈ بنائیں۔",
  add: "نیا استاد",
  search: "استاد تلاش کریں",
  name: "استاد کا نام",
  phone: "موبائل نمبر",
  photo: "استاد کی تصویر",
  uploadPhoto: "تصویر منتخب کریں",
  cnic: "شناختی کارڈ",
  hireDate: "تاریخ تقرری",
  residential: "رہائشی استاد",
  active: "فعال",
  inactive: "غیر فعال",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  edit: "ترمیم کریں",
  delete: "حذف کریں",
  loading: "اساتذہ لوڈ ہو رہے ہیں...",
  empty: "کوئی استاد نہیں ملا۔",
  error: "اساتذہ لوڈ نہیں ہو سکے۔",
  saveError: "استاد کا ریکارڈ محفوظ نہیں ہو سکا۔",
  deleteError: "استاد حذف نہیں ہو سکا۔",
  created: "استاد شامل ہو گیا",
  updated: "استاد میں ترمیم ہو گئی",
  deleted: "استاد حذف ہو گیا",
  confirm: "کیا آپ یہ استاد حذف کرنا چاہتے ہیں؟",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function TeacherDialog({
  open,
  onOpenChange,
  teacher,
  isPending,
  error,
  onSubmit,
}) {
  const [photoPreview, setPhotoPreview] = useState(
    teacher?.photo ? getMediaUrl(teacher.photo) : "",
  );

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    setPhotoPreview(
      file
        ? URL.createObjectURL(file)
        : teacher?.photo
          ? getMediaUrl(teacher.photo)
          : "",
    );
  }

  async function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("role", "teacher");
    formData.set("is_active", formData.has("is_active") ? "true" : "false");
    formData.set(
      "is_residential",
      formData.has("is_residential") ? "true" : "false",
    );
    if (!formData.get("photo")?.name) formData.delete("photo");
    await onSubmit(formData);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{teacher ? "استاد میں ترمیم" : text.add}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form key={teacher?.id || "new"} onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="size-16 rounded-xl object-cover"
                />
              ) : (
                <div className="grid size-16 place-items-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="size-7" aria-hidden="true" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{text.photo}</p>
                <label
                  htmlFor="teacher-photo"
                  className="mt-2 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                >
                  <ImageUp className="size-4" aria-hidden="true" />
                  {text.uploadPhoto}
                </label>
                <input
                  id="teacher-photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.name}
              <input
                name="full_name"
                defaultValue={teacher?.full_name || ""}
                required
                dir="rtl"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.phone}
              <input
                name="phone"
                defaultValue={teacher?.phone || ""}
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.cnic}
              <input
                name="cnic"
                defaultValue={teacher?.cnic || ""}
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.hireDate}
              <input
                name="hire_date"
                type="date"
                defaultValue={teacher?.hire_date || ""}
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="flex items-center justify-start gap-2 text-right text-sm">
              <input
                name="is_residential"
                type="checkbox"
                defaultChecked={teacher?.is_residential}
              />
              {text.residential}
            </label>
            <label className="flex items-center justify-start gap-2 text-right text-sm">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={teacher ? teacher.is_active : true}
              />
              {text.active}
            </label>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.saveError)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TeacherManagement() {
  const [query, setQuery] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [open, setOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.toLowerCase().trim());
  const { data: teachers = [], isLoading, isError, refetch } = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const visibleTeachers = teachers.filter((item) =>
    [item.full_name, item.phone, item.cnic].some((value) =>
      value?.toLowerCase().includes(deferredQuery),
    ),
  );
  const pending = createTeacher.isPending || updateTeacher.isPending;
  const mutationError = createTeacher.error || updateTeacher.error;
  function add() {
    setTeacher(null);
    setOpen(true);
  }
  async function save(data) {
    try {
      if (teacher) {
        await updateTeacher.mutateAsync({ id: teacher.id, data });
        toast.success(text.updated);
      } else {
        await createTeacher.mutateAsync(data);
        toast.success(text.created);
      }
    } catch (error) {
      toast.error(text.saveError, getApiErrorMessage(error, text.saveError));
      throw error;
    }
  }
  async function remove(item) {
    if (!window.confirm(text.confirm)) return;
    try {
      await deleteTeacher.mutateAsync(item.id);
      toast.success(text.deleted);
    } catch (error) {
      toast.error(
        text.deleteError,
        getApiErrorMessage(error, text.deleteError),
      );
    }
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">عملہ</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {text.description}
          </p>
        </div>
        <Button type="button" onClick={add}>
          <Plus aria-hidden="true" />
          {text.add}
        </Button>
      </header>
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <label className="relative block max-w-sm">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.search}
              className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-3 text-sm outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
        </div>
        {isError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-destructive">{text.error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refetch()}
            >
              دوبارہ کوشش کریں
            </Button>
          </div>
        ) : isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.loading}
          </p>
        ) : visibleTeachers.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-right text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {[
                    text.name,
                    text.phone,
                    text.cnic,
                    text.hireDate,
                    text.residential,
                    text.active,
                    "کارروائی",
                  ].map((label) => (
                    <th key={label} className="px-5 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleTeachers.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.photo ? (
                          <Image
                            src={getMediaUrl(item.photo)}
                            alt=""
                            width={36}
                            height={36}
                            unoptimized
                            className="size-9 rounded-full object-cover"
                          />
                        ) : (
                          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                            <UserRound className="size-4" />
                          </span>
                        )}
                        <span className="font-semibold">{item.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {item.phone}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {item.cnic || "—"}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {item.hire_date}
                    </td>
                    <td className="px-5 py-4">
                      {item.is_residential ? text.active : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          item.is_active
                            ? "text-success"
                            : "text-muted-foreground"
                        }
                      >
                        {item.is_active ? text.active : text.inactive}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/teachers/${item.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="تفصیلات دیکھیں"
                        >
                          <Eye aria-hidden="true" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={text.edit}
                        onClick={() => {
                          setTeacher(item);
                          setOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        aria-label={text.delete}
                        onClick={() => remove(item)}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <TeacherDialog
        key={teacher?.id || "new"}
        open={open}
        onOpenChange={setOpen}
        teacher={teacher}
        isPending={pending}
        error={mutationError}
        onSubmit={save}
      />
    </div>
  );
}
