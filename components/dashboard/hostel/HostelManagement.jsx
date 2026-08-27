"use client";

import { useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  DoorOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import {
  useCreateGatePass,
  useCreateHostelAllocation,
  useCreateHostelRoom,
  useCreateHostelWing,
  useDeleteGatePass,
  useDeleteHostelAllocation,
  useDeleteHostelRoom,
  useDeleteHostelWing,
  useGatePasses,
  useHostelAllocations,
  useHostelRooms,
  useHostelWings,
  useUpdateGatePass,
  useUpdateHostelAllocation,
  useUpdateHostelRoom,
  useUpdateHostelWing,
} from "@/hooks/useHostel";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  eyebrow: "ہاسٹل / دارالاقامہ",
  title: "ہاسٹل انتظام",
  description: "ونگز، کمروں، رہائشی طلبہ اور گیٹ پاس کا ریکارڈ منظم کریں۔",
  wings: "ونگز",
  rooms: "کمرے",
  allocations: "رہائشی الاٹمنٹ",
  gatePasses: "گیٹ پاس",
  add: "شامل کریں",
  edit: "ترمیم کریں",
  delete: "حذف کریں",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  wingName: "ونگ کا نام",
  roomNumber: "کمرہ نمبر",
  capacity: "گنجائش",
  wing: "ونگ",
  student: "طالب علم",
  room: "کمرہ",
  bed: "بستر نمبر",
  allocatedDate: "الاٹمنٹ تاریخ",
  active: "فعال",
  inactive: "غیر فعال",
  purpose: "جانے کا مقصد",
  outDate: "باہر جانے کا وقت",
  inDate: "واپسی کا وقت",
  authorizedBy: "اجازت دینے والا استاد",
  loading: "ریکارڈ لوڈ ہو رہا ہے...",
  empty: "کوئی ریکارڈ موجود نہیں۔",
  operationError: "عمل مکمل نہیں ہو سکا۔",
  created: "ریکارڈ شامل ہو گیا",
  updated: "ریکارڈ میں ترمیم ہو گئی",
  deleted: "ریکارڈ حذف ہو گیا",
  confirm: "کیا آپ یہ ریکارڈ حذف کرنا چاہتے ہیں؟",
  choose: "منتخب کریں",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function SearchableStudentField({ field, record }) {
  const selectedOption = field.options.find(
    (option) => String(option.value) === String(record?.[field.name] ?? ""),
  );
  const [search, setSearch] = useState(selectedOption?.label || "");
  const [selectedId, setSelectedId] = useState(
    record?.[field.name] ? String(record[field.name]) : "",
  );
  const [isOpen, setIsOpen] = useState(false);
  const options = useMemo(() => {
    const query = search.toLowerCase().trim();
    return field.options
      .filter((option) => !query || option.label.toLowerCase().includes(query))
      .slice(0, 30);
  }, [field.options, search]);

  return (
    <label className="grid gap-2 text-right text-sm font-medium">
      {field.label}
      <input type="hidden" name={field.name} value={selectedId} />
      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          role="combobox"
          dir="rtl"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedId("");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-controls={`${field.name}-options`}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          placeholder="طالب علم تلاش کریں"
          className={`${inputClass} pr-9 pl-9`}
        />
        {search && (
          <button
            type="button"
            aria-label="تلاش صاف کریں"
            onClick={() => {
              setSearch("");
              setSelectedId("");
              setIsOpen(false);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XCircle className="size-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div
          id={`${field.name}-options`}
          role="listbox"
          className="max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {options.length ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={String(option.value) === selectedId}
                onClick={() => {
                  setSelectedId(String(option.value));
                  setSearch(option.label);
                  setIsOpen(false);
                }}
                className="flex w-full rounded-md px-3 py-2 text-right hover:bg-accent hover:text-accent-foreground"
              >
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              کوئی طالب علم نہیں ملا
            </p>
          )}
        </div>
      )}
    </label>
  );
}

function RecordDialog({
  open,
  onOpenChange,
  title,
  description,
  record,
  fields,
  isPending,
  error,
  onSubmit,
}) {
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    Object.keys(data).forEach((key) => {
      if (data[key] === "true" || data[key] === "false")
        data[key] = data[key] === "true";
    });
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form key={record?.id || "new"} onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {fields.map((field) =>
              field.type === "student-select" ? (
                <SearchableStudentField
                  key={field.name}
                  field={field}
                  record={record}
                />
              ) : (
                <label
                  key={field.name}
                  className="grid gap-2 text-right text-sm font-medium"
                >
                  {field.label}
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      defaultValue={String(
                        record?.[field.name] ?? field.defaultValue ?? "",
                      )}
                      required={field.required}
                      className={inputClass}
                    >
                      {field.placeholder && (
                        <option value="" disabled>
                          {field.placeholder}
                        </option>
                      )}
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      defaultValue={record?.[field.name] ?? ""}
                      required={field.required}
                      className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
                    />
                  ) : (
                    <input
                      name={field.name}
                      type={field.type || "text"}
                      dir={field.ltr ? "ltr" : "rtl"}
                      defaultValue={
                        record?.[field.name] ?? field.defaultValue ?? ""
                      }
                      required={field.required}
                      className={inputClass}
                    />
                  )}
                </label>
              ),
            )}
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.operationError)}
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

function RecordsTable({ columns, items, isLoading, onEdit, onDelete }) {
  if (isLoading)
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        {text.loading}
      </p>
    );
  if (!items.length)
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        {text.empty}
      </p>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] text-right text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 font-medium">
                {column.label}
              </th>
            ))}
            <th className="px-5 py-4 font-medium">کارروائی</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/40">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-5 py-4"
                  dir={column.ltr ? "ltr" : undefined}
                >
                  {column.render
                    ? column.render(item)
                    : item[column.key] || "—"}
                </td>
              ))}
              <td className="px-5 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={text.edit}
                  onClick={() => onEdit(item)}
                >
                  <Pencil />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  aria-label={text.delete}
                  onClick={() => onDelete(item)}
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HostelManagement() {
  const [dialog, setDialog] = useState({ type: null, record: null });
  const { data: wings = [], isLoading: wingsLoading } = useHostelWings();
  const { data: rooms = [], isLoading: roomsLoading } = useHostelRooms();
  const { data: allocations = [], isLoading: allocationsLoading } =
    useHostelAllocations();
  const { data: gatePasses = [], isLoading: passesLoading } = useGatePasses();
  const { data: students = [] } = useAllStudents();
  const { data: teachers = [] } = useTeachers();
  const createWing = useCreateHostelWing();
  const updateWing = useUpdateHostelWing();
  const deleteWing = useDeleteHostelWing();
  const createRoom = useCreateHostelRoom();
  const updateRoom = useUpdateHostelRoom();
  const deleteRoom = useDeleteHostelRoom();
  const createAllocation = useCreateHostelAllocation();
  const updateAllocation = useUpdateHostelAllocation();
  const deleteAllocation = useDeleteHostelAllocation();
  const createPass = useCreateGatePass();
  const updatePass = useUpdateGatePass();
  const deletePass = useDeleteGatePass();
  const resources = {
    wing: { create: createWing, update: updateWing, remove: deleteWing },
    room: { create: createRoom, update: updateRoom, remove: deleteRoom },
    allocation: {
      create: createAllocation,
      update: updateAllocation,
      remove: deleteAllocation,
    },
    pass: { create: createPass, update: updatePass, remove: deletePass },
  };
  const activeResource = dialog.type ? resources[dialog.type] : null;
  const wingOptions = wings.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const roomOptions = rooms.map((item) => ({
    value: item.id,
    label: `${item.wing_name} — ${item.room_number}`,
  }));
  const studentOptions = students.map((item) => ({
    value: item.id,
    label: `${item.full_name} — ${item.registration_number}`,
  }));
  const teacherOptions = teachers.map((item) => ({
    value: item.id,
    label: item.full_name,
  }));
  const fields = {
    wing: [{ name: "name", label: text.wingName, required: true }],
    room: [
      {
        name: "wing",
        label: text.wing,
        type: "select",
        options: wingOptions,
        placeholder: text.choose,
        required: true,
      },
      { name: "room_number", label: text.roomNumber, required: true },
      {
        name: "capacity",
        label: text.capacity,
        type: "number",
        defaultValue: 1,
        ltr: true,
        required: true,
      },
    ],
    allocation: [
      {
        name: "student",
        label: text.student,
        type: "student-select",
        options: studentOptions,
        required: true,
      },
      {
        name: "room",
        label: text.room,
        type: "select",
        options: roomOptions,
        placeholder: text.choose,
        required: true,
      },
      { name: "bed_number", label: text.bed, required: true },
      {
        name: "allocated_date",
        label: text.allocatedDate,
        type: "date",
        defaultValue: new Date().toISOString().slice(0, 10),
        ltr: true,
        required: true,
      },
      {
        name: "is_active",
        label: text.active,
        type: "select",
        options: [
          { value: "true", label: text.active },
          { value: "false", label: text.inactive },
        ],
        required: true,
      },
    ],
    pass: [
      {
        name: "student",
        label: text.student,
        type: "student-select",
        options: studentOptions,
        required: true,
      },
      {
        name: "purpose",
        label: text.purpose,
        type: "textarea",
        required: true,
      },
      {
        name: "out_date",
        label: text.outDate,
        type: "datetime-local",
        ltr: true,
        required: true,
      },
      {
        name: "in_date",
        label: text.inDate,
        type: "datetime-local",
        ltr: true,
      },
      {
        name: "authorized_by",
        label: text.authorizedBy,
        type: "select",
        options: teacherOptions,
        placeholder: text.choose,
        required: true,
      },
    ],
  };
  function open(type, record = null) {
    setDialog({ type, record });
  }
  async function save(data) {
    const type = dialog.type;
    const numericFields = {
      room: ["wing", "capacity"],
      allocation: ["student", "room"],
      pass: ["student", "authorized_by"],
    };
    numericFields[type]?.forEach((key) => {
      if (data[key]) data[key] = Number(data[key]);
    });
    if (data.in_date === "") delete data.in_date;
    try {
      if (dialog.record) {
        await resources[type].update.mutateAsync({
          id: dialog.record.id,
          data,
        });
        toast.success(text.updated);
      } else {
        await resources[type].create.mutateAsync(data);
        toast.success(text.created);
      }
    } catch (error) {
      toast.error(
        text.operationError,
        getApiErrorMessage(error, text.operationError),
      );
      throw error;
    }
  }
  async function remove(type, item) {
    if (!window.confirm(text.confirm)) return;
    try {
      await resources[type].remove.mutateAsync(item.id);
      toast.success(text.deleted);
    } catch (error) {
      toast.error(
        text.operationError,
        getApiErrorMessage(error, text.operationError),
      );
    }
  }
  const tabs = [
    { value: "wings", label: text.wings, icon: Building2 },
    { value: "rooms", label: text.rooms, icon: BedDouble },
    { value: "allocations", label: text.allocations, icon: BedDouble },
    { value: "passes", label: text.gatePasses, icon: DoorOpen },
  ];
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">{text.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <Tabs defaultValue="wings">
        <TabsList>
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="wings">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">{text.wings}</h2>
              <Button size="sm" onClick={() => open("wing")}>
                <Plus />
                {text.add}
              </Button>
            </div>
            <RecordsTable
              items={wings}
              isLoading={wingsLoading}
              columns={[{ key: "name", label: text.wingName }]}
              onEdit={(item) => open("wing", item)}
              onDelete={(item) => remove("wing", item)}
            />
          </section>
        </TabsContent>
        <TabsContent value="rooms">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">{text.rooms}</h2>
              <Button
                size="sm"
                disabled={!wings.length}
                onClick={() => open("room")}
              >
                <Plus />
                {text.add}
              </Button>
            </div>
            <RecordsTable
              items={rooms}
              isLoading={roomsLoading}
              columns={[
                { key: "wing_name", label: text.wing },
                { key: "room_number", label: text.roomNumber },
                { key: "capacity", label: text.capacity, ltr: true },
              ]}
              onEdit={(item) => open("room", item)}
              onDelete={(item) => remove("room", item)}
            />
          </section>
        </TabsContent>
        <TabsContent value="allocations">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">{text.allocations}</h2>
              <Button
                size="sm"
                disabled={!students.length || !rooms.length}
                onClick={() => open("allocation")}
              >
                <Plus />
                {text.add}
              </Button>
            </div>
            <RecordsTable
              items={allocations}
              isLoading={allocationsLoading}
              columns={[
                { key: "student_name", label: text.student },
                { key: "room_number", label: text.room },
                { key: "bed_number", label: text.bed },
                { key: "allocated_date", label: text.allocatedDate, ltr: true },
                {
                  key: "is_active",
                  label: text.active,
                  render: (item) =>
                    item.is_active ? text.active : text.inactive,
                },
              ]}
              onEdit={(item) => open("allocation", item)}
              onDelete={(item) => remove("allocation", item)}
            />
          </section>
        </TabsContent>
        <TabsContent value="passes">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">{text.gatePasses}</h2>
              <Button
                size="sm"
                disabled={!students.length || !teachers.length}
                onClick={() => open("pass")}
              >
                <Plus />
                {text.add}
              </Button>
            </div>
            <RecordsTable
              items={gatePasses}
              isLoading={passesLoading}
              columns={[
                { key: "student_name", label: text.student },
                { key: "purpose", label: text.purpose },
                { key: "out_date", label: text.outDate, ltr: true },
                { key: "in_date", label: text.inDate, ltr: true },
                { key: "authorized_by_name", label: text.authorizedBy },
              ]}
              onEdit={(item) => open("pass", item)}
              onDelete={(item) => remove("pass", item)}
            />
          </section>
        </TabsContent>
      </Tabs>
      <RecordDialog
        open={Boolean(dialog.type)}
        onOpenChange={(isOpen) =>
          !isOpen && setDialog({ type: null, record: null })
        }
        title={dialog.record ? text.edit : text.add}
        description={text.description}
        record={dialog.record}
        fields={dialog.type ? fields[dialog.type] : []}
        isPending={
          activeResource?.create.isPending || activeResource?.update.isPending
        }
        error={activeResource?.create.error || activeResource?.update.error}
        onSubmit={save}
      />
    </div>
  );
}
