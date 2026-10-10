"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  BookOpenCheck,
  CheckCheck,
  ClipboardCheck,
  FilePenLine,
  FilePlus2,
  LibraryBig,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Tags,
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
  useCreateFatwaCategory,
  useCreateFatwaInquiry,
  useCreateFatwaReference,
  useCreateFatwaRevision,
  useCreateFatwaTag,
  useFatwaAction,
  useFatwaAssignees,
  useFatwaCategories,
  useFatwaDashboard,
  useFatwaInquiries,
  useFatwaInquiry,
  useFatwaPublications,
  useFatwaTags,
} from "@/hooks/useFatwas";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const statusLabels = {
  received: "موصول",
  triaged: "درجہ بند",
  assigned: "تفویض شدہ",
  researching: "تحقیق جاری",
  drafting: "مسودہ",
  in_review: "زیر جائزہ",
  changes_requested: "ترمیم مطلوب",
  reviewed: "جائزہ مکمل",
  approved: "منظور",
  published: "شائع شدہ",
  rejected: "مسترد",
  cancelled: "منسوخ",
  archived: "محفوظ",
};
const priorityLabels = {
  normal: "عام",
  urgent: "فوری",
  critical: "نہایت فوری",
};
const today = () => new Date().toISOString().slice(0, 10);

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

function SimpleDialog({
  type,
  open,
  onOpenChange,
  categories,
  tags,
  mutations,
}) {
  const titles = {
    category: "نیا موضوع",
    tag: "نیا ٹیگ",
    inquiry: "نیا استفتاء",
  };
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    let mutation = mutations[type];
    let data = values;
    if (type === "inquiry")
      data = {
        subject: values.subject,
        question_text: values.question_text,
        category: Number(values.category),
        language: values.language,
        channel: values.channel,
        priority: values.priority,
        visibility: values.visibility,
        requester: {
          name: values.requester_name,
          phone: values.phone,
          email: values.email,
          address: values.address,
          consent_to_contact: true,
          consent_to_publish_question:
            values.consent_to_publish_question === "on",
          anonymize_on_publication: values.anonymize_on_publication === "on",
        },
      };
    try {
      await mutation.mutateAsync(data);
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
          <DialogDescription>
            دارالافتاء کا مطلوبہ ریکارڈ درج کریں۔
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            {type === "category" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="موضوع کا نام"
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
            {type === "tag" && (
              <input
                name="name"
                required
                placeholder="ٹیگ"
                className={inputClass}
              />
            )}
            {type === "inquiry" && (
              <>
                <input
                  name="subject"
                  required
                  placeholder="استفتاء کا عنوان"
                  className={inputClass}
                />
                <textarea
                  name="question_text"
                  required
                  placeholder="مکمل سوال"
                  className="min-h-36 rounded-lg border border-input bg-background p-3"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <select name="category" required className={inputClass}>
                    <option value="">موضوع منتخب کریں</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="priority"
                    defaultValue="normal"
                    className={inputClass}
                  >
                    <option value="normal">عام</option>
                    <option value="urgent">فوری</option>
                    <option value="critical">نہایت فوری</option>
                  </select>
                  <select
                    name="channel"
                    defaultValue="walk_in"
                    className={inputClass}
                  >
                    <option value="walk_in">بالمشافہ</option>
                    <option value="phone">فون</option>
                    <option value="email">ای میل</option>
                    <option value="letter">خط</option>
                    <option value="web">آن لائن</option>
                  </select>
                  <select
                    name="language"
                    defaultValue="urdu"
                    className={inputClass}
                  >
                    <option value="urdu">اردو</option>
                    <option value="arabic">عربی</option>
                    <option value="english">انگریزی</option>
                  </select>
                  <select
                    name="visibility"
                    defaultValue="internal"
                    className={inputClass}
                  >
                    <option value="internal">داخلی</option>
                    <option value="confidential">خفیہ</option>
                  </select>
                </div>
                <h3 className="mt-2 font-bold">سائل کی خفیہ معلومات</h3>
                <input
                  name="requester_name"
                  placeholder="نام"
                  className={inputClass}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="phone"
                    placeholder="فون"
                    dir="ltr"
                    className={inputClass}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="ای میل"
                    dir="ltr"
                    className={inputClass}
                  />
                </div>
                <textarea
                  name="address"
                  placeholder="پتہ"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="consent_to_publish_question" />
                  سوال شائع کرنے کی اجازت
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="anonymize_on_publication"
                    defaultChecked
                  />
                  اشاعت میں نام مخفی رکھیں
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

function CaseWorkspace({ id, categories, assignees, onClose }) {
  const { data: item, isLoading } = useFatwaInquiry(id);
  const action = useFatwaAction();
  const revision = useCreateFatwaRevision();
  const reference = useCreateFatwaReference();
  async function run(name, data = {}, message = "عمل مکمل ہو گیا") {
    try {
      await action.mutateAsync({ id, action: name, data });
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function saveDraft(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await revision.mutateAsync({
        inquiry: id,
        revision_type: "draft",
        answer_text: values.answer_text,
        summary: values.summary,
        internal_notes: values.internal_notes,
      });
      toast.success("نیا مسودہ محفوظ ہو گیا");
    } catch (error) {
      toast.error("مسودہ محفوظ نہیں ہوا", getApiErrorMessage(error));
    }
  }
  async function addReference(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await reference.mutateAsync({
        inquiry: id,
        reference_type: values.reference_type,
        title: values.title,
        author: values.author,
        citation_text: values.citation_text,
        quotation: values.quotation,
      });
      event.currentTarget.reset();
      toast.success("حوالہ شامل ہو گیا");
    } catch (error) {
      toast.error("حوالہ شامل نہیں ہوا", getApiErrorMessage(error));
    }
  }
  if (isLoading) return <Skeleton className="h-150" />;
  if (!item) return null;
  const current = item.revisions?.find((entry) => entry.is_current);
  return (
    <section className="space-y-5 rounded-2xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            {item.case_number}
          </p>
          <h2 className="text-xl font-bold">{item.subject}</h2>
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
        {item.status === "received" && (
          <Button
            size="sm"
            onClick={() =>
              run(
                "triage",
                { category: item.category },
                "استفتاء درجہ بند ہو گیا",
              )
            }
          >
            <ClipboardCheck />
            درجہ بندی
          </Button>
        )}
        {["received", "triaged", "assigned"].includes(item.status) && (
          <>
            <select
              id="mufti-assignee"
              className={inputClass + " max-w-48"}
              defaultValue={item.assigned_mufti || ""}
            >
              <option value="">مفتی منتخب کریں</option>
              {assignees.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <select
              id="reviewer-assignee"
              className={inputClass + " max-w-48"}
              defaultValue={item.assigned_reviewer || ""}
            >
              <option value="">جائزہ کنندہ</option>
              {assignees.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={() =>
                run(
                  "assign",
                  {
                    assigned_mufti: Number(
                      document.getElementById("mufti-assignee").value,
                    ),
                    assigned_reviewer:
                      Number(
                        document.getElementById("reviewer-assignee").value,
                      ) || null,
                  },
                  "استفتاء تفویض ہو گیا",
                )
              }
            >
              <UserRoundCheck />
              تفویض
            </Button>
          </>
        )}
        {item.status === "assigned" && (
          <Button
            size="sm"
            onClick={() => run("start_research", {}, "تحقیق شروع ہو گئی")}
          >
            <LibraryBig />
            تحقیق
          </Button>
        )}
        {["researching", "changes_requested"].includes(item.status) && (
          <Button
            size="sm"
            onClick={() => run("start_draft", {}, "مسودہ شروع ہو گیا")}
          >
            <FilePenLine />
            مسودہ
          </Button>
        )}
        {item.status === "drafting" && (
          <Button
            size="sm"
            onClick={() =>
              run("submit_review", {}, "جائزے کے لیے بھیج دیا گیا")
            }
          >
            <Send />
            جائزے کو بھیجیں
          </Button>
        )}
        {item.status === "in_review" && (
          <Button
            size="sm"
            onClick={() => run("mark_reviewed", {}, "جائزہ مکمل ہو گیا")}
          >
            <CheckCheck />
            جائزہ مکمل
          </Button>
        )}
        {item.status === "reviewed" && (
          <Button
            size="sm"
            onClick={() => run("approve", {}, "فتویٰ منظور ہو گیا")}
          >
            <ShieldCheck />
            منظور کریں
          </Button>
        )}
        {item.status === "approved" && (
          <Button
            size="sm"
            onClick={() => run("publish", {}, "فتویٰ شائع ہو گیا")}
          >
            <BookOpenCheck />
            شائع کریں
          </Button>
        )}
      </div>
      <Tabs defaultValue="question">
        <TabsList className="flex-wrap">
          <TabsTrigger value="question">سوال</TabsTrigger>
          <TabsTrigger value="requester">سائل</TabsTrigger>
          <TabsTrigger value="draft">تحقیق و جواب</TabsTrigger>
          <TabsTrigger value="history">تاریخ</TabsTrigger>
        </TabsList>
        <TabsContent value="question">
          <div className="rounded-xl bg-muted/50 p-5 whitespace-pre-wrap leading-8">
            {item.question_text}
          </div>
        </TabsContent>
        <TabsContent value="requester">
          <div className="grid gap-3 rounded-xl border border-warning/30 bg-warning/5 p-5 sm:grid-cols-2">
            <p>
              <strong>نام:</strong> {item.requester?.name || "مخفی"}
            </p>
            <p dir="ltr">
              <strong>فون:</strong> {item.requester?.phone || "—"}
            </p>
            <p dir="ltr">
              <strong>ای میل:</strong> {item.requester?.email || "—"}
            </p>
            <p>
              <strong>اشاعت کی اجازت:</strong>{" "}
              {item.requester?.consent_to_publish_question ? "ہاں" : "نہیں"}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="draft">
          <div className="grid gap-5 lg:grid-cols-2">
            <form
              onSubmit={saveDraft}
              className="space-y-3 rounded-xl border p-4"
            >
              <h3 className="font-bold">نیا جواب/مسودہ</h3>
              <textarea
                name="answer_text"
                required
                defaultValue={current?.answer_text || ""}
                placeholder="تفصیلی شرعی جواب"
                className="min-h-64 w-full rounded-lg border border-input bg-background p-3 leading-8"
              />
              <textarea
                name="summary"
                defaultValue={current?.summary || ""}
                placeholder="مختصر خلاصہ"
                className="min-h-20 w-full rounded-lg border border-input bg-background p-3"
              />
              <textarea
                name="internal_notes"
                placeholder="داخلی نوٹس"
                className="min-h-20 w-full rounded-lg border border-input bg-background p-3"
              />
              <Button type="submit">
                <FilePenLine />
                نیا ورژن محفوظ کریں
              </Button>
            </form>
            <div className="space-y-4">
              <form
                onSubmit={addReference}
                className="space-y-3 rounded-xl border p-4"
              >
                <h3 className="font-bold">حوالہ شامل کریں</h3>
                <select name="reference_type" className={inputClass}>
                  <option value="quran">قرآن</option>
                  <option value="hadith">حدیث</option>
                  <option value="fiqh">فقہی کتاب</option>
                  <option value="fatwa">سابقہ فتویٰ</option>
                  <option value="law">قانون</option>
                  <option value="other">دیگر</option>
                </select>
                <input
                  name="title"
                  required
                  placeholder="کتاب/حوالہ"
                  className={inputClass}
                />
                <input
                  name="author"
                  placeholder="مصنف"
                  className={inputClass}
                />
                <textarea
                  name="citation_text"
                  placeholder="جلد، صفحہ، باب"
                  className="min-h-16 w-full rounded-lg border border-input bg-background p-3"
                />
                <textarea
                  name="quotation"
                  placeholder="اقتباس"
                  className="min-h-24 w-full rounded-lg border border-input bg-background p-3"
                />
                <Button type="submit" variant="outline">
                  <Plus />
                  حوالہ
                </Button>
              </form>
              <div className="space-y-2">
                {item.references?.map((ref) => (
                  <div key={ref.id} className="rounded-lg bg-muted p-3">
                    <p className="font-semibold">{ref.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ref.citation_text || ref.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="space-y-2">
            {item.workflow_events?.map((event) => (
              <div key={event.id} className="rounded-lg border p-3">
                <p className="font-semibold">
                  {event.action} — {event.actor_name}
                </p>
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {new Date(event.created_at).toLocaleString()}
                </p>
                {event.comment && (
                  <p className="mt-2 text-sm">{event.comment}</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default function FatwaManagementPage() {
  const [dialog, setDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data: dashboard, isLoading } = useFatwaDashboard();
  const { data: categories = [] } = useFatwaCategories();
  const { data: tags = [] } = useFatwaTags();
  const { data: inquiries = [] } = useFatwaInquiries();
  const { data: assignees = [] } = useFatwaAssignees();
  const { data: publications = [] } = useFatwaPublications();
  const mutations = {
    category: useCreateFatwaCategory(),
    tag: useCreateFatwaTag(),
    inquiry: useCreateFatwaInquiry(),
  };
  const filtered = useMemo(
    () =>
      inquiries.filter(
        (item) =>
          (!statusFilter || item.status === statusFilter) &&
          `${item.case_number} ${item.subject} ${item.category_name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [inquiries, search, statusFilter],
  );
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
          <p className="text-sm font-medium text-primary">دارالافتاء</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            استفتاء اور فتاویٰ
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            سوال کی وصولی، تحقیق، مسودہ، جائزہ، منظوری اور محفوظ اشاعت
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialog("category")}>
            <Plus />
            موضوع
          </Button>
          <Button variant="outline" onClick={() => setDialog("tag")}>
            <Tags />
            ٹیگ
          </Button>
          <Button onClick={() => setDialog("inquiry")}>
            <FilePlus2 />
            نیا استفتاء
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric
          icon={Archive}
          label="کل استفتاء"
          value={dashboard?.total || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={FilePlus2}
          label="نئے"
          value={dashboard?.received || 0}
          tone="bg-info/10 text-info"
        />
        <Metric
          icon={FilePenLine}
          label="زیر عمل"
          value={dashboard?.active || 0}
          tone="bg-warning/10 text-warning"
        />
        <Metric
          icon={ClipboardCheck}
          label="زیر جائزہ"
          value={dashboard?.in_review || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={ShieldCheck}
          label="منظوری کے منتظر"
          value={dashboard?.awaiting_approval || 0}
          tone="bg-destructive/10 text-destructive"
        />
        <Metric
          icon={BookOpenCheck}
          label="شائع شدہ"
          value={dashboard?.published || 0}
          tone="bg-success/10 text-success"
        />
      </section>
      {selected && (
        <CaseWorkspace
          id={selected}
          categories={categories}
          assignees={assignees}
          onClose={() => setSelected(null)}
        />
      )}
      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">کام کی فہرست</TabsTrigger>
          <TabsTrigger value="archive">شائع شدہ ذخیرہ</TabsTrigger>
        </TabsList>
        <TabsContent value="queue">
          <section className="rounded-2xl border bg-card">
            <div className="grid gap-3 border-b p-5 sm:grid-cols-[1fr_14rem]">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="نمبر، عنوان یا موضوع تلاش کریں"
                  className={`${inputClass} pr-9`}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={inputClass}
              >
                <option value="">تمام حالتیں</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="divide-y">
              {filtered.length ? (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item.id)}
                    className="grid w-full gap-2 p-5 text-right hover:bg-muted/40 sm:grid-cols-[10rem_1fr_10rem_10rem]"
                  >
                    <span className="font-mono text-xs" dir="ltr">
                      {item.case_number}
                    </span>
                    <span>
                      <strong>{item.subject}</strong>
                      <small className="block text-muted-foreground">
                        {item.category_name}
                      </small>
                    </span>
                    <span className="text-sm">
                      {priorityLabels[item.priority]}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {statusLabels[item.status]}
                    </span>
                  </button>
                ))
              ) : (
                <p className="p-10 text-center text-muted-foreground">
                  کوئی استفتاء موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="archive">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {publications.length ? (
              publications.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border bg-card p-5"
                >
                  <p className="text-xs font-semibold text-primary" dir="ltr">
                    {item.public_number}
                  </p>
                  <h2 className="mt-2 font-bold">{item.public_question}</h2>
                  <p className="mt-2 line-clamp-4 text-sm leading-7 text-muted-foreground">
                    {item.public_summary || item.public_answer}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {item.category_name}
                  </p>
                </article>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-muted-foreground">
                کوئی شائع شدہ فتویٰ موجود نہیں۔
              </p>
            )}
          </section>
        </TabsContent>
      </Tabs>
      <SimpleDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        categories={categories}
        tags={tags}
        mutations={mutations}
      />
    </div>
  );
}
