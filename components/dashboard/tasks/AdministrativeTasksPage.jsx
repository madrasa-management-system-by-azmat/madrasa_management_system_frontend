"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCheck,
  ClipboardCheck,
  FolderKanban,
  ListChecks,
  MessageSquareText,
  Plus,
  RefreshCw,
  Search,
  Send,
  UserRoundCheck,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdministrativeTask,
  useAdministrativeTasks,
  useCreateAdministrativeTask,
  useCreateTaskCategory,
  useCreateTaskChecklistItem,
  useCreateTaskComment,
  useCreateTaskDependency,
  useCreateTaskProject,
  useCreateTaskRecurrence,
  useGenerateRecurringTasks,
  useTaskAction,
  useTaskCategories,
  useTaskDashboard,
  useTaskPeople,
  useTaskProjects,
  useUpdateTaskChecklistItem,
} from "@/hooks/useTasks";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const statusLabels = {
  draft: "مسودہ",
  assigned: "تفویض شدہ",
  in_progress: "جاری",
  blocked: "رکا ہوا",
  pending_review: "جائزے کے لیے",
  changes_requested: "ترمیم مطلوب",
  completed: "مکمل",
  cancelled: "منسوخ",
  archived: "محفوظ",
};
const priorityLabels = {
  low: "کم",
  normal: "عام",
  high: "اہم",
  critical: "نہایت اہم",
};
const localInput = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
function Metric({ icon: Icon, label, value, tone }) {
  return (
    <article className="rounded-2xl border bg-card p-5">
      <span className={`grid size-10 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold" dir="ltr">
        {value}
      </p>
    </article>
  );
}

function CreateDialog({
  type,
  open,
  onOpenChange,
  categories,
  projects,
  people,
  mutations,
}) {
  const titles = {
    category: "نیا زمرہ",
    project: "نیا منصوبہ",
    task: "نیا انتظامی کام",
  };
  async function submit(event) {
    event.preventDefault();
    const v = Object.fromEntries(new FormData(event.currentTarget));
    let m = mutations[type],
      data = v;
    if (type === "project")
      data = {
        ...v,
        owner: Number(v.owner),
        starts_on: v.starts_on || null,
        due_on: v.due_on || null,
      };
    if (type === "task")
      data = {
        title: v.title,
        description: v.description,
        category: Number(v.category),
        project: v.project ? Number(v.project) : null,
        priority: v.priority,
        visibility: v.visibility,
        due_at: v.due_at || null,
        estimated_hours: Number(v.estimated_hours || 0),
        requires_review: v.requires_review === "on",
        reviewer: v.reviewer ? Number(v.reviewer) : null,
      };
    try {
      await m.mutateAsync(data);
      toast.success("ریکارڈ محفوظ ہو گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] overflow-y-auto text-right"
      >
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
          <DialogDescription>مطلوبہ معلومات درج کریں۔</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {type === "category" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="زمرے کا نام"
                  className={inputClass}
                />
                <input name="code" placeholder="کوڈ" className={inputClass} />
                <textarea
                  name="description"
                  placeholder="تفصیل"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
              </>
            )}
            {type === "project" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="منصوبے کا نام"
                  className={inputClass}
                />
                <input name="code" placeholder="کوڈ" className={inputClass} />
                <textarea
                  name="description"
                  placeholder="تفصیل"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <select name="owner" required className={inputClass}>
                  <option value="">منصوبہ ذمہ دار</option>
                  {people.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="starts_on" type="date" className={inputClass} />
                  <input name="due_on" type="date" className={inputClass} />
                </div>
                <select
                  name="status"
                  defaultValue="planned"
                  className={inputClass}
                >
                  <option value="planned">منصوبہ بند</option>
                  <option value="active">جاری</option>
                </select>
              </>
            )}
            {type === "task" && (
              <>
                <input
                  name="title"
                  required
                  placeholder="کام کا عنوان"
                  className={inputClass}
                />
                <textarea
                  name="description"
                  placeholder="تفصیل اور مطلوبہ نتیجہ"
                  className="min-h-28 rounded-lg border border-input bg-background p-3"
                />
                <select name="category" required className={inputClass}>
                  <option value="">زمرہ</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select name="project" className={inputClass}>
                  <option value="">منصوبہ (اختیاری)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    name="priority"
                    defaultValue="normal"
                    className={inputClass}
                  >
                    <option value="low">کم</option>
                    <option value="normal">عام</option>
                    <option value="high">اہم</option>
                    <option value="critical">نہایت اہم</option>
                  </select>
                  <select
                    name="visibility"
                    defaultValue="assignees"
                    className={inputClass}
                  >
                    <option value="assignees">ذمہ دار افراد</option>
                    <option value="staff">تمام عملہ</option>
                    <option value="confidential">خفیہ</option>
                  </select>
                  <input
                    name="due_at"
                    type="datetime-local"
                    defaultValue={localInput()}
                    className={inputClass}
                  />
                  <input
                    name="estimated_hours"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="تخمینی گھنٹے"
                    className={inputClass}
                  />
                </div>
                <select name="reviewer" className={inputClass}>
                  <option value="">جائزہ کنندہ</option>
                  {people.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input name="requires_review" type="checkbox" />
                  تکمیل کے بعد جائزہ ضروری ہے
                </label>
              </>
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
            <Button type="submit">محفوظ کریں</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Workspace({ id, people, tasks, onClose }) {
  const { data: item, isLoading } = useAdministrativeTask(id);
  const action = useTaskAction();
  const checklist = useCreateTaskChecklistItem();
  const updateChecklist = useUpdateTaskChecklistItem();
  const comment = useCreateTaskComment();
  const dependency = useCreateTaskDependency();
  const recurrence = useCreateTaskRecurrence();
  const [assignees, setAssignees] = useState([]);
  async function run(name, data = {}, message = "عمل مکمل ہو گیا") {
    try {
      await action.mutateAsync({ id, action: name, data });
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function addChecklist(event) {
    event.preventDefault();
    const v = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await checklist.mutateAsync({
        task: id,
        sequence: (item.checklist_items?.length || 0) + 1,
        title: v.title,
      });
      event.currentTarget.reset();
      toast.success("چیک لسٹ شامل ہو گئی");
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function addComment(event) {
    event.preventDefault();
    const v = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await comment.mutateAsync({ task: id, body: v.body, is_internal: false });
      event.currentTarget.reset();
      toast.success("تبصرہ شامل ہو گیا");
    } catch (error) {
      toast.error("تبصرہ شامل نہیں ہوا", getApiErrorMessage(error));
    }
  }
  if (isLoading) return <Skeleton className="h-150" />;
  if (!item) return null;
  return (
    <section className="space-y-5 rounded-2xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-primary" dir="ltr">
            {item.task_number}
          </p>
          <h2 className="text-xl font-bold">{item.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.category_name} · {priorityLabels[item.priority]} ·{" "}
            {statusLabels[item.status]}
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          بند کریں
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {["draft", "assigned"].includes(item.status) && (
          <>
            <select
              multiple
              value={assignees}
              onChange={(e) =>
                setAssignees(
                  Array.from(e.target.selectedOptions, (o) => Number(o.value)),
                )
              }
              className="min-h-20 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {people.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <Button
              onClick={() => run("assign", { assignees }, "کام تفویض ہو گیا")}
            >
              <UserRoundCheck />
              تفویض
            </Button>
          </>
        )}
        {["assigned", "blocked", "changes_requested"].includes(item.status) && (
          <Button onClick={() => run("start", {}, "کام شروع ہو گیا")}>
            <ClipboardCheck />
            شروع کریں
          </Button>
        )}
        {item.status === "in_progress" && (
          <>
            <Button
              variant="outline"
              onClick={() =>
                run("block", { comment: "رکاوٹ درج کی گئی" }, "کام روکا گیا")
              }
            >
              <AlertTriangle />
              رکا ہوا
            </Button>
            <Button
              onClick={() =>
                run(
                  "submit",
                  { completion_notes: "کام مکمل" },
                  item.requires_review
                    ? "جائزے کے لیے بھیج دیا گیا"
                    : "کام مکمل ہو گیا",
                )
              }
            >
              <Send />
              جمع کریں
            </Button>
          </>
        )}
        {item.status === "pending_review" && (
          <Button onClick={() => run("verify", {}, "کام تصدیق ہو گیا")}>
            <CheckCheck />
            تصدیق
          </Button>
        )}
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">خلاصہ</TabsTrigger>
          <TabsTrigger value="checklist">چیک لسٹ</TabsTrigger>
          <TabsTrigger value="dependencies">انحصار</TabsTrigger>
          <TabsTrigger value="comments">تبصرے</TabsTrigger>
          <TabsTrigger value="history">تاریخ</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 rounded-xl bg-muted/40 p-5 sm:grid-cols-2">
            <p>
              <strong>تفصیل:</strong> {item.description || "—"}
            </p>
            <p>
              <strong>منصوبہ:</strong> {item.project_name || "—"}
            </p>
            <p>
              <strong>ذمہ دار:</strong> {item.assignee_names.join("، ") || "—"}
            </p>
            <p>
              <strong>آخری تاریخ:</strong>{" "}
              <span dir="ltr">
                {item.due_at ? new Date(item.due_at).toLocaleString() : "—"}
              </span>
            </p>
            <div className="sm:col-span-2">
              <div className="mb-2 flex justify-between">
                <span>پیش رفت</span>
                <span>{item.progress_percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.progress_percentage}%` }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="checklist">
          <form onSubmit={addChecklist} className="mb-4 flex gap-2">
            <input
              name="title"
              required
              placeholder="نیا مرحلہ"
              className={inputClass}
            />
            <Button type="submit">
              <Plus />
              شامل
            </Button>
          </form>
          <div className="space-y-2">
            {item.checklist_items.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <input
                  type="checkbox"
                  checked={c.is_completed}
                  onChange={() =>
                    updateChecklist.mutate({
                      id: c.id,
                      data: { is_completed: !c.is_completed },
                    })
                  }
                />
                <span
                  className={
                    c.is_completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {c.title}
                </span>
              </label>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="dependencies">
          <div className="flex gap-2">
            <select id="dependency-task" className={inputClass}>
              <option value="">متعلقہ سابقہ کام</option>
              {tasks
                .filter((t) => t.id !== id)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.task_number} — {t.title}
                  </option>
                ))}
            </select>
            <Button
              onClick={() =>
                dependency.mutate({
                  task: id,
                  depends_on: Number(
                    document.getElementById("dependency-task").value,
                  ),
                })
              }
            >
              شامل
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {item.dependencies.map((d) => (
              <p key={d.id} className="rounded-lg border p-3">
                {d.depends_on_title} — {statusLabels[d.depends_on_status]}
              </p>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="comments">
          <form onSubmit={addComment} className="mb-4 flex gap-2">
            <input
              name="body"
              required
              placeholder="تبصرہ/اپ ڈیٹ"
              className={inputClass}
            />
            <Button type="submit">
              <MessageSquareText />
              ارسال
            </Button>
          </form>
          {item.comments.map((c) => (
            <div key={c.id} className="mb-2 rounded-lg border p-3">
              <strong>{c.created_by_name}</strong>
              <p>{c.body}</p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="history">
          {item.audit_events.map((e) => (
            <div key={e.id} className="mb-2 rounded-lg border p-3">
              <strong>
                {e.action} — {e.actor_name}
              </strong>
              <p className="text-xs text-muted-foreground" dir="ltr">
                {new Date(e.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default function AdministrativeTasksPage() {
  const [selected, setSelected] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState("list");
  const { data: dashboard, isLoading } = useTaskDashboard();
  const { data: categories = [] } = useTaskCategories();
  const { data: projects = [] } = useTaskProjects();
  const { data: tasks = [] } = useAdministrativeTasks();
  const { data: people = [] } = useTaskPeople();
  const createCategory = useCreateTaskCategory();
  const createProject = useCreateTaskProject();
  const createTask = useCreateAdministrativeTask();
  const generateRecurring = useGenerateRecurringTasks();
  const mutations = {
    category: createCategory,
    project: createProject,
    task: createTask,
  };
  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (!status || t.status === status) &&
          `${t.task_number} ${t.title} ${t.category_name} ${t.project_name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [tasks, search, status],
  );
  const columns = {
    draft: [],
    assigned: [],
    in_progress: [],
    blocked: [],
    pending_review: [],
    changes_requested: [],
    completed: [],
  };
  filtered.forEach((t) => columns[t.status]?.push(t));
  if (isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">انتظامی نظم</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">انتظامی کام</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            منصوبے، ذمہ داریاں، چیک لسٹ، جائزہ، تکراری کام اور تکمیل
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => generateRecurring.mutate()}>
            <RefreshCw />
            تکراری کام
          </Button>
          <Button variant="outline" onClick={() => setDialog("category")}>
            <Plus />
            زمرہ
          </Button>
          <Button variant="outline" onClick={() => setDialog("project")}>
            <FolderKanban />
            منصوبہ
          </Button>
          <Button onClick={() => setDialog("task")}>
            <Plus />
            نیا کام
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric
          icon={ListChecks}
          label="کل کام"
          value={dashboard?.total || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={ClipboardCheck}
          label="کھلے کام"
          value={dashboard?.open || 0}
          tone="bg-info/10 text-info"
        />
        <Metric
          icon={UserRoundCheck}
          label="میرے کام"
          value={dashboard?.mine || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={RefreshCw}
          label="جاری"
          value={dashboard?.in_progress || 0}
          tone="bg-warning/10 text-warning"
        />
        <Metric
          icon={AlertTriangle}
          label="تاخیر"
          value={dashboard?.overdue || 0}
          tone="bg-destructive/10 text-destructive"
        />
        <Metric
          icon={CheckCheck}
          label="مکمل"
          value={dashboard?.completed || 0}
          tone="bg-success/10 text-success"
        />
      </section>
      {selected && (
        <Workspace
          id={selected}
          people={people}
          tasks={tasks}
          onClose={() => setSelected(null)}
        />
      )}
      <section className="rounded-2xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نمبر، عنوان، زمرہ یا منصوبہ تلاش کریں"
              className={`${inputClass} pr-9`}
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${inputClass} lg:w-52`}
          >
            <option value="">تمام حالتیں</option>
            {Object.entries(statusLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
            >
              فہرست
            </Button>
            <Button
              variant={view === "board" ? "default" : "outline"}
              onClick={() => setView("board")}
            >
              بورڈ
            </Button>
          </div>
        </div>
        {view === "list" ? (
          <div className="divide-y">
            {filtered.length ? (
              filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className="grid w-full gap-2 p-5 text-right hover:bg-muted/40 sm:grid-cols-[9rem_1fr_10rem_8rem_6rem]"
                >
                  <span className="font-mono text-xs" dir="ltr">
                    {t.task_number}
                  </span>
                  <span>
                    <strong>{t.title}</strong>
                    <small className="block text-muted-foreground">
                      {t.category_name} · {t.project_name || "بلا منصوبہ"}
                    </small>
                  </span>
                  <span>{t.assignee_names.join("، ") || "غیر تفویض"}</span>
                  <span>{statusLabels[t.status]}</span>
                  <span className={t.is_overdue ? "text-destructive" : ""}>
                    {t.progress_percentage}%
                  </span>
                </button>
              ))
            ) : (
              <p className="p-10 text-center text-muted-foreground">
                کوئی کام موجود نہیں۔
              </p>
            )}
          </div>
        ) : (
          <div className="grid min-w-max grid-cols-7 gap-4 overflow-x-auto p-5">
            {Object.entries(columns).map(([key, items]) => (
              <div key={key} className="w-64 rounded-xl bg-muted/40 p-3">
                <h3 className="mb-3 font-bold">
                  {statusLabels[key]} ({items.length})
                </h3>
                <div className="space-y-2">
                  {items.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t.id)}
                      className="w-full rounded-lg border bg-card p-3 text-right"
                    >
                      <strong className="text-sm">{t.title}</strong>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.assignee_names.join("، ") || "غیر تفویض"}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${t.progress_percentage}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <CreateDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        categories={categories}
        projects={projects}
        people={people}
        mutations={mutations}
      />
    </div>
  );
}
