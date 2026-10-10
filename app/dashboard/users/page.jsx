"use client";

import { useState } from "react";
import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext";
import {
  useCreateMadrasaUser,
  useCreateTenantRole,
  useDeleteTenantRole,
  useMadrasaUsers,
  usePermissionCatalogue,
  useTenantRoles,
  useUpdateMadrasaUser,
  useUpdateTenantRole,
} from "@/hooks/useUsers";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const roles = { admin: "ایڈمن", operator: "آپریٹر", accountant: "اکاؤنٹنٹ" };

function UserDialog({ record, open, onOpenChange, tenantRoles }) {
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
            role_ids: values.role_ids
              ? values.role_ids.split(",").map(Number)
              : [],
            is_active: values.is_active === "true",
          },
        });
      else
        await createUser.mutateAsync({
          ...values,
          role_ids: values.role_ids
            ? values.role_ids.split(",").map(Number)
            : [],
        });
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
              بنیادی پرانا کردار
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
            <fieldset className="grid gap-2 text-sm font-medium sm:col-span-2">
              <legend>مؤثر RBAC کردار</legend>
              <div className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
                {tenantRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2 font-normal"
                  >
                    <input
                      type="checkbox"
                      name="role_choice"
                      value={role.id}
                      defaultChecked={record?.role_ids?.includes(role.id)}
                      onChange={(event) => {
                        const form = event.currentTarget.form;
                        const selected = [
                          ...form.querySelectorAll(
                            'input[name="role_choice"]:checked',
                          ),
                        ].map((item) => item.value);
                        form.elements.role_ids.value = selected.join(",");
                      }}
                    />
                    {role.name_ur || role.name}
                  </label>
                ))}
              </div>
              <input
                type="hidden"
                name="role_ids"
                defaultValue={(record?.role_ids || []).join(",")}
              />
            </fieldset>
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

function RoleDialog({ record, permissions, open, onOpenChange }) {
  const createRole = useCreateTenantRole();
  const updateRole = useUpdateTenantRole();
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      name_ur: form.get("name_ur"),
      slug: form.get("slug"),
      description: form.get("description"),
      permission_codes: form.getAll("permission_codes"),
    };
    try {
      if (record)
        await updateRole.mutateAsync({ id: record.id, data: payload });
      else await createRole.mutateAsync(payload);
      toast.success(record ? "کردار اپ ڈیٹ ہو گیا" : "نیا کردار بن گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error("کردار محفوظ نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  const grouped = permissions.reduce((groups, item) => {
    groups[item.module] = [...(groups[item.module] || []), item];
    return groups;
  }, {});
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{record ? "کردار میں ترمیم" : "نیا کردار"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              required
              name="name"
              defaultValue={record?.name || ""}
              className={inputClass}
              placeholder="English name"
            />
            <input
              name="name_ur"
              defaultValue={record?.name_ur || ""}
              className={inputClass}
              placeholder="اردو نام"
            />
            <input
              required
              name="slug"
              defaultValue={record?.slug || ""}
              readOnly={record?.is_system}
              className={inputClass}
              placeholder="role-code"
            />
          </div>
          <textarea
            name="description"
            defaultValue={record?.description || ""}
            className="min-h-20 w-full rounded-lg border border-input bg-background p-3 text-sm"
            placeholder="تفصیل"
          />
          <div className="max-h-80 space-y-4 overflow-y-auto rounded-xl border border-border p-4">
            {Object.entries(grouped).map(([module, items]) => (
              <fieldset key={module}>
                <legend className="mb-2 font-bold text-primary">
                  {module}
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((permission) => (
                    <label
                      key={permission.code}
                      className="flex items-start gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="permission_codes"
                        value={permission.code}
                        defaultChecked={record?.permission_codes?.includes(
                          permission.code,
                        )}
                      />
                      <span>
                        {permission.name}
                        <small
                          className="block text-muted-foreground"
                          dir="ltr"
                        >
                          {permission.code}
                        </small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              منسوخ
            </Button>
            <Button disabled={createRole.isPending || updateRole.isPending}>
              محفوظ کریں
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MadrasaUsersPage() {
  const { user, hasPermission } = useAuthContext();
  const [dialog, setDialog] = useState({ open: false, record: null });
  const [roleDialog, setRoleDialog] = useState({ open: false, record: null });
  const canView = hasPermission("users.view");
  const canManageUsers = hasPermission("users.manage");
  const canViewRoles = hasPermission("roles.view");
  const canManageRoles = hasPermission("roles.manage");
  const {
    data: users = [],
    isLoading,
    isError,
  } = useMadrasaUsers({ enabled: canView });
  const { data: tenantRoles = [] } = useTenantRoles({ enabled: canViewRoles });
  const { data: permissions = [] } = usePermissionCatalogue({
    enabled: canViewRoles,
  });
  const deleteRole = useDeleteTenantRole();
  if (!canView)
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
        {canManageUsers && (
          <Button onClick={() => setDialog({ open: true, record: null })}>
            <Plus />
            نیا صارف
          </Button>
        )}
      </header>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">صارفین</TabsTrigger>
          {canViewRoles && (
            <TabsTrigger value="roles">کردار اور اجازتیں</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="users" className="space-y-4">
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
                      <td className="px-5 py-4">
                        {roles[item.role] || item.role}
                      </td>
                      <td className="px-5 py-4">
                        {item.is_active ? (
                          <span className="text-success">فعال</span>
                        ) : (
                          <span className="text-destructive">غیر فعال</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {item.id === user?.id || !canManageUsers ? (
                          <span className="text-xs text-muted-foreground">
                            اپنا پروفائل صفحہ استعمال کریں
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="ترمیم"
                            onClick={() =>
                              setDialog({ open: true, record: item })
                            }
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
        </TabsContent>
        {canViewRoles && (
          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-end">
              {canManageRoles && (
                <Button
                  onClick={() => setRoleDialog({ open: true, record: null })}
                >
                  <Plus /> نیا کردار
                </Button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {tenantRoles.map((role) => (
                <article
                  key={role.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{role.name_ur || role.name}</h3>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {role.slug} · {role.user_count} users
                      </p>
                    </div>
                    {canManageRoles && (
                      <div className="flex">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setRoleDialog({ open: true, record: role })
                          }
                        >
                          <Pencil />
                        </Button>
                        {!role.is_system && (
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={async () => {
                              try {
                                await deleteRole.mutateAsync(role.id);
                                toast.success("کردار حذف ہو گیا");
                              } catch (error) {
                                toast.error(
                                  "کردار حذف نہیں ہو سکا",
                                  getApiErrorMessage(error),
                                );
                              }
                            }}
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {role.description ||
                      `${role.permission_codes.length} اجازتیں`}
                  </p>
                </article>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
      <UserDialog
        record={dialog.record}
        open={dialog.open}
        tenantRoles={tenantRoles}
        onOpenChange={(open) =>
          !open && setDialog({ open: false, record: null })
        }
      />
      <RoleDialog
        record={roleDialog.record}
        permissions={permissions}
        open={roleDialog.open}
        onOpenChange={(open) =>
          !open && setRoleDialog({ open: false, record: null })
        }
      />
    </div>
  );
}
