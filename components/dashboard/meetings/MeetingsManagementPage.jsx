"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCheck,
  ClipboardList,
  FileCheck2,
  FilePenLine,
  ListChecks,
  Plus,
  Printer,
  Search,
  Send,
  UsersRound,
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
  useCreateAgendaItem,
  useCreateMeeting,
  useCreateMeetingActionItem,
  useCreateMeetingDecision,
  useCreateMeetingMinutes,
  useCreateMeetingParticipant,
  useCreateMeetingType,
  useMarkMeetingAttendance,
  useMeeting,
  useMeetingAction,
  useMeetingActionItems,
  useMeetingDashboard,
  useMeetingPeople,
  useMeetings,
  useMeetingTypes,
  useUpdateMeetingActionItem,
} from "@/hooks/useMeetings";
import { getMadrasaProfile } from "@/lib/api/settings";
import {
  escapePrintHtml,
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const statusLabels = {
  draft: "مسودہ",
  scheduled: "مقرر",
  held: "منعقد",
  minutes_draft: "روداد کا مسودہ",
  pending_approval: "منظوری کے لیے",
  changes_requested: "ترمیم مطلوب",
  finalized: "حتمی",
  cancelled: "منسوخ",
  archived: "محفوظ",
};
const attendanceLabels = {
  unmarked: "غیر درج",
  present: "حاضر",
  absent: "غیر حاضر",
  late: "تاخیر",
  excused: "معذور",
  remote: "آن لائن",
};
const localInput = (offset = 0) => {
  const d = new Date(Date.now() + offset);
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
  types,
  people,
  meeting,
  mutations,
}) {
  const titles = {
    type: "اجلاس کی قسم",
    meeting: "نیا اجلاس",
    agenda: "ایجنڈا مد",
    participant: "شریک",
    minutes: "روداد کا نیا ورژن",
    decision: "نیا فیصلہ",
    action: "نیا عملی کام",
  };
  async function submit(event) {
    event.preventDefault();
    const v = Object.fromEntries(new FormData(event.currentTarget));
    let m = mutations[type],
      data = v;
    if (type === "type")
      data = {
        ...v,
        default_duration_minutes: Number(v.default_duration_minutes),
        default_quorum: Number(v.default_quorum),
      };
    if (type === "meeting")
      data = {
        ...v,
        meeting_type: Number(v.meeting_type),
        chairperson: v.chairperson ? Number(v.chairperson) : null,
        secretary: v.secretary ? Number(v.secretary) : null,
        approver: v.approver ? Number(v.approver) : null,
        quorum_required: Number(v.quorum_required),
      };
    if (type === "agenda")
      data = {
        meeting: meeting.id,
        sequence: Number(v.sequence),
        title: v.title,
        description: v.description,
        allocated_minutes: Number(v.allocated_minutes),
        item_type: v.item_type,
      };
    if (type === "participant")
      data = {
        meeting: meeting.id,
        user: v.user ? Number(v.user) : null,
        participant_role: v.participant_role,
      };
    if (type === "minutes")
      data = {
        meeting: meeting.id,
        title: v.title,
        content: v.content,
        summary: v.summary,
        discussion_notes: v.discussion_notes,
      };
    if (type === "decision")
      data = {
        meeting: meeting.id,
        agenda_item: v.agenda_item ? Number(v.agenda_item) : null,
        title: v.title,
        decision_text: v.decision_text,
        rationale: v.rationale,
        effective_date: v.effective_date || null,
        is_confidential: v.is_confidential === "on",
      };
    if (type === "action")
      data = {
        meeting: meeting.id,
        decision: v.decision ? Number(v.decision) : null,
        title: v.title,
        description: v.description,
        owner: Number(v.owner),
        due_date: v.due_date || null,
        priority: v.priority,
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
            {type === "type" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="قسم کا نام"
                  className={inputClass}
                />
                <input name="code" placeholder="کوڈ" className={inputClass} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="default_duration_minutes"
                    type="number"
                    min="10"
                    defaultValue="60"
                    placeholder="مدت منٹ"
                    className={inputClass}
                  />
                  <input
                    name="default_quorum"
                    type="number"
                    min="1"
                    defaultValue="1"
                    placeholder="نصاب"
                    className={inputClass}
                  />
                </div>
              </>
            )}
            {type === "meeting" && (
              <>
                <input
                  name="title"
                  required
                  placeholder="اجلاس کا عنوان"
                  className={inputClass}
                />
                <textarea
                  name="description"
                  placeholder="مقصد اور تفصیل"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <select name="meeting_type" required className={inputClass}>
                  <option value="">قسم منتخب کریں</option>
                  {types.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="scheduled_start"
                    type="datetime-local"
                    required
                    defaultValue={localInput()}
                    className={inputClass}
                  />
                  <input
                    name="scheduled_end"
                    type="datetime-local"
                    required
                    defaultValue={localInput(3600000)}
                    className={inputClass}
                  />
                </div>
                <input name="venue" placeholder="مقام" className={inputClass} />
                <select name="chairperson" className={inputClass}>
                  <option value="">صدر</option>
                  {people.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <select name="secretary" className={inputClass}>
                  <option value="">سیکریٹری</option>
                  {people.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <select name="approver" className={inputClass}>
                  <option value="">منظور کنندہ</option>
                  {people.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <input
                  name="quorum_required"
                  type="number"
                  min="1"
                  defaultValue="1"
                  placeholder="ضروری نصاب"
                  className={inputClass}
                />
              </>
            )}
            {type === "agenda" && (
              <>
                <input
                  name="sequence"
                  type="number"
                  min="1"
                  defaultValue={(meeting?.agenda_items?.length || 0) + 1}
                  required
                  className={inputClass}
                />
                <input
                  name="title"
                  required
                  placeholder="ایجنڈا عنوان"
                  className={inputClass}
                />
                <textarea
                  name="description"
                  placeholder="تفصیل"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <select name="item_type" className={inputClass}>
                  <option value="discussion">بحث</option>
                  <option value="decision">فیصلہ</option>
                  <option value="information">اطلاع</option>
                  <option value="report">رپورٹ</option>
                </select>
                <input
                  name="allocated_minutes"
                  type="number"
                  min="1"
                  defaultValue="10"
                  className={inputClass}
                />
              </>
            )}
            {type === "participant" && (
              <>
                <select name="user" required className={inputClass}>
                  <option value="">صارف منتخب کریں</option>
                  {people.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <select name="participant_role" className={inputClass}>
                  <option value="member">رکن</option>
                  <option value="chair">صدر</option>
                  <option value="secretary">سیکریٹری</option>
                  <option value="approver">منظور کنندہ</option>
                  <option value="presenter">پیش کنندہ</option>
                  <option value="observer">مبصر</option>
                </select>
              </>
            )}
            {type === "minutes" && (
              <>
                <input
                  name="title"
                  required
                  defaultValue={`${meeting?.title || "اجلاس"} کی روداد`}
                  className={inputClass}
                />
                <textarea
                  name="content"
                  required
                  placeholder="مکمل روداد"
                  className="min-h-64 rounded-lg border border-input bg-background p-3 leading-8"
                />
                <textarea
                  name="summary"
                  placeholder="خلاصہ"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <textarea
                  name="discussion_notes"
                  placeholder="بحث کے نوٹس"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
              </>
            )}
            {type === "decision" && (
              <>
                <select name="agenda_item" className={inputClass}>
                  <option value="">ایجنڈا مد (اختیاری)</option>
                  {meeting?.agenda_items?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.sequence}. {a.title}
                    </option>
                  ))}
                </select>
                <input
                  name="title"
                  required
                  placeholder="فیصلے کا عنوان"
                  className={inputClass}
                />
                <textarea
                  name="decision_text"
                  required
                  placeholder="فیصلے کا مکمل متن"
                  className="min-h-28 rounded-lg border border-input bg-background p-3"
                />
                <textarea
                  name="rationale"
                  placeholder="وجہ/پس منظر"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <input
                  name="effective_date"
                  type="date"
                  className={inputClass}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_confidential" />
                  خفیہ فیصلہ
                </label>
              </>
            )}
            {type === "action" && (
              <>
                <select name="decision" className={inputClass}>
                  <option value="">متعلقہ فیصلہ</option>
                  {meeting?.decisions?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
                <input
                  name="title"
                  required
                  placeholder="عملی کام"
                  className={inputClass}
                />
                <textarea
                  name="description"
                  placeholder="تفصیل"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
                <select name="owner" required className={inputClass}>
                  <option value="">ذمہ دار</option>
                  {people.users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <input name="due_date" type="date" className={inputClass} />
                <select name="priority" className={inputClass}>
                  <option value="normal">عام</option>
                  <option value="high">اہم</option>
                  <option value="critical">نہایت اہم</option>
                </select>
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

async function printMinutes(meeting) {
  const current = meeting.minutes_revisions?.find((m) => m.is_current);
  if (!current) {
    toast.error("روداد موجود نہیں");
    return;
  }
  const w = window.open("", "_blank");
  if (!w) {
    toast.error("Popups کی اجازت دیں");
    return;
  }
  const profile = await getMadrasaProfile();
  const participants = meeting.participants
    .map(
      (p) =>
        `<tr><td>${escapePrintHtml(p.display_name)}</td><td>${escapePrintHtml(attendanceLabels[p.attendance_status])}</td></tr>`,
    )
    .join("");
  const decisions = meeting.decisions
    .map(
      (d) =>
        `<section><h3>${escapePrintHtml(d.decision_number)} — ${escapePrintHtml(d.title)}</h3><p>${escapePrintHtml(d.decision_text)}</p></section>`,
    )
    .join("");
  w.document.write(
    `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>${escapePrintHtml(meeting.title)}</title><style>${madrasaPrintHeaderCss}body{font-family:serif;padding:24px;color:#111}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0}.box{border:1px solid #aaa;padding:10px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #aaa;padding:8px;text-align:right}h2,h3{margin-top:20px}p{white-space:pre-wrap;line-height:1.9}@media print{body{padding:0}}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: "اجلاس کی حتمی روداد", subtitle: meeting.title, meta: escapePrintHtml(meeting.meeting_number) })}<div class="meta"><div class="box">تاریخ: ${escapePrintHtml(new Date(meeting.scheduled_start).toLocaleDateString())}</div><div class="box">مقام: ${escapePrintHtml(meeting.venue || "—")}</div><div class="box">نصاب: ${meeting.quorum_met ? "مکمل" : "نامکمل"}</div></div><h2>${escapePrintHtml(current.title)}</h2><p>${escapePrintHtml(current.content)}</p><h2>شرکاء</h2><table><thead><tr><th>نام</th><th>حاضری</th></tr></thead><tbody>${participants}</tbody></table><h2>فیصلے</h2>${decisions || "<p>کوئی فیصلہ نہیں</p>"}</body></html>`,
  );
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function Workspace({ id, people, onClose }) {
  const { data: item, isLoading } = useMeeting(id);
  const action = useMeetingAction();
  const agenda = useCreateAgendaItem();
  const participant = useCreateMeetingParticipant();
  const attendance = useMarkMeetingAttendance();
  const minutes = useCreateMeetingMinutes();
  const decision = useCreateMeetingDecision();
  const actionItem = useCreateMeetingActionItem();
  const [dialog, setDialog] = useState(null);
  const mutations = {
    agenda,
    participant,
    minutes,
    decision,
    action: actionItem,
  };
  async function run(name, data = {}, message = "عمل مکمل ہو گیا") {
    try {
      await action.mutateAsync({ id, action: name, data });
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function markAll() {
    try {
      for (const p of item.participants.filter(
        (p) => p.attendance_status === "unmarked",
      )) {
        await attendance.mutateAsync({
          id: p.id,
          attendance_status: "present",
        });
      }
      toast.success("تمام شرکاء حاضر درج ہو گئے");
    } catch (error) {
      toast.error("حاضری مکمل نہیں ہوئی", getApiErrorMessage(error));
    }
  }
  if (isLoading) return <Skeleton className="h-150" />;
  if (!item) return null;
  return (
    <section className="space-y-5 rounded-2xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-primary" dir="ltr">
            {item.meeting_number}
          </p>
          <h2 className="text-xl font-bold">{item.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.meeting_type_name} · {statusLabels[item.status]} ·{" "}
            {new Date(item.scheduled_start).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {item.status === "finalized" && (
            <Button variant="outline" onClick={() => printMinutes(item)}>
              <Printer />
              پرنٹ
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            بند کریں
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.status === "draft" && (
          <Button onClick={() => run("schedule", {}, "اجلاس مقرر ہو گیا")}>
            <CalendarCheck />
            مقرر کریں
          </Button>
        )}
        {item.status === "scheduled" && (
          <>
            <Button variant="outline" onClick={markAll}>
              <UsersRound />
              سب حاضر
            </Button>
            <Button onClick={() => run("mark_held", {}, "اجلاس منعقد ہو گیا")}>
              <CheckCheck />
              منعقد کریں
            </Button>
          </>
        )}
        {["held", "changes_requested"].includes(item.status) && (
          <Button onClick={() => run("start_minutes", {}, "روداد شروع ہو گئی")}>
            <FilePenLine />
            روداد شروع
          </Button>
        )}
        {item.status === "minutes_draft" && (
          <Button
            onClick={() =>
              run("submit_minutes", {}, "روداد منظوری کے لیے بھیج دی گئی")
            }
          >
            <Send />
            جمع کریں
          </Button>
        )}
        {item.status === "pending_approval" && (
          <Button
            onClick={() => run("finalize", {}, "اجلاس کی روداد حتمی ہو گئی")}
          >
            <FileCheck2 />
            حتمی کریں
          </Button>
        )}
      </div>
      <Tabs defaultValue="agenda">
        <TabsList className="flex-wrap">
          <TabsTrigger value="agenda">ایجنڈا</TabsTrigger>
          <TabsTrigger value="participants">شرکاء</TabsTrigger>
          <TabsTrigger value="minutes">روداد</TabsTrigger>
          <TabsTrigger value="decisions">فیصلے</TabsTrigger>
          <TabsTrigger value="actions">عملی کام</TabsTrigger>
          <TabsTrigger value="history">تاریخ</TabsTrigger>
        </TabsList>
        <TabsContent value="agenda">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setDialog("agenda")}>
              <Plus />
              ایجنڈا
            </Button>
          </div>
          <div className="space-y-2">
            {item.agenda_items.map((a) => (
              <div key={a.id} className="rounded-lg border p-3">
                <strong>
                  {a.sequence}. {a.title}
                </strong>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="participants">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setDialog("participant")}>
              <Plus />
              شریک
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {item.participants.map((p) => (
              <div key={p.id} className="rounded-lg border p-3">
                <div className="flex justify-between">
                  <strong>{p.display_name}</strong>
                  <span>{attendanceLabels[p.attendance_status]}</span>
                </div>
                {item.status === "scheduled" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["present", "absent", "late", "excused", "remote"].map(
                      (s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            attendance.mutate({
                              id: p.id,
                              attendance_status: s,
                            })
                          }
                        >
                          {attendanceLabels[s]}
                        </Button>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="minutes">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setDialog("minutes")}>
              <Plus />
              نیا ورژن
            </Button>
          </div>
          {item.minutes_revisions.map((m) => (
            <article key={m.id} className="mb-3 rounded-lg border p-4">
              <div className="flex justify-between">
                <strong>
                  {m.title} — ورژن {m.version}
                </strong>
                <span>{m.status}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-7">{m.content}</p>
            </article>
          ))}
        </TabsContent>
        <TabsContent value="decisions">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setDialog("decision")}>
              <Plus />
              فیصلہ
            </Button>
          </div>
          {item.decisions.map((d) => (
            <article key={d.id} className="mb-3 rounded-lg border p-4">
              <p className="text-xs text-primary" dir="ltr">
                {d.decision_number}
              </p>
              <h3 className="font-bold">{d.title}</h3>
              <p className="mt-2 leading-7">{d.decision_text}</p>
            </article>
          ))}
        </TabsContent>
        <TabsContent value="actions">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setDialog("action")}>
              <Plus />
              عملی کام
            </Button>
          </div>
          {item.action_items.map((a) => (
            <div key={a.id} className="mb-2 rounded-lg border p-3">
              <div className="flex justify-between">
                <strong>{a.title}</strong>
                <span>{a.progress_percentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ذمہ دار: {a.owner_name} · آخری تاریخ: {a.due_date || "—"}
              </p>
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
      <CreateDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        people={people}
        meeting={item}
        types={[]}
        mutations={mutations}
      />
    </section>
  );
}

export default function MeetingsManagementPage() {
  const [selected, setSelected] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { data: dashboard, isLoading } = useMeetingDashboard();
  const { data: types = [] } = useMeetingTypes();
  const { data: meetings = [] } = useMeetings();
  const { data: people = { users: [], staff: [] } } = useMeetingPeople();
  const { data: actions = [] } = useMeetingActionItems();
  const createType = useCreateMeetingType();
  const createMeeting = useCreateMeeting();
  const updateAction = useUpdateMeetingActionItem();
  const mutations = { type: createType, meeting: createMeeting };
  const filtered = useMemo(
    () =>
      meetings.filter(
        (m) =>
          (!status || m.status === status) &&
          `${m.meeting_number} ${m.title} ${m.meeting_type_name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [meetings, search, status],
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
          <p className="text-sm font-medium text-primary">ادارہ جاتی نظم</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            اجلاس اور فیصلے
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            شیڈول، ایجنڈا، حاضری، روداد، حتمی فیصلے اور عملی کام
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialog("type")}>
            <Plus />
            قسم
          </Button>
          <Button onClick={() => setDialog("meeting")}>
            <Plus />
            نیا اجلاس
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric
          icon={CalendarCheck}
          label="کل اجلاس"
          value={dashboard?.total || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={CalendarCheck}
          label="آنے والے"
          value={dashboard?.upcoming || 0}
          tone="bg-info/10 text-info"
        />
        <Metric
          icon={FilePenLine}
          label="روداد باقی"
          value={dashboard?.pending_minutes || 0}
          tone="bg-warning/10 text-warning"
        />
        <Metric
          icon={FileCheck2}
          label="منظوری کے لیے"
          value={dashboard?.awaiting_approval || 0}
          tone="bg-primary/10 text-primary"
        />
        <Metric
          icon={ListChecks}
          label="کھلے کام"
          value={dashboard?.open_actions || 0}
          tone="bg-success/10 text-success"
        />
        <Metric
          icon={ClipboardList}
          label="تاخیر والے کام"
          value={dashboard?.overdue_actions || 0}
          tone="bg-destructive/10 text-destructive"
        />
      </section>
      {selected && (
        <Workspace
          id={selected}
          people={people}
          onClose={() => setSelected(null)}
        />
      )}
      <Tabs defaultValue="meetings">
        <TabsList>
          <TabsTrigger value="meetings">اجلاس</TabsTrigger>
          <TabsTrigger value="actions">عملی کام</TabsTrigger>
        </TabsList>
        <TabsContent value="meetings">
          <section className="rounded-2xl border bg-card">
            <div className="grid gap-3 border-b p-5 sm:grid-cols-[1fr_14rem]">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="نمبر، عنوان یا قسم تلاش کریں"
                  className={`${inputClass} pr-9`}
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="">تمام حالتیں</option>
                {Object.entries(statusLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="divide-y">
              {filtered.length ? (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelected(m.id)}
                    className="grid w-full gap-2 p-5 text-right hover:bg-muted/40 sm:grid-cols-[9rem_1fr_12rem_8rem]"
                  >
                    <span className="font-mono text-xs" dir="ltr">
                      {m.meeting_number}
                    </span>
                    <span>
                      <strong>{m.title}</strong>
                      <small className="block text-muted-foreground">
                        {m.meeting_type_name} · {m.venue || "مقام غیر مقرر"}
                      </small>
                    </span>
                    <span className="text-sm" dir="ltr">
                      {new Date(m.scheduled_start).toLocaleString()}
                    </span>
                    <span className="font-semibold text-primary">
                      {statusLabels[m.status]}
                    </span>
                  </button>
                ))
              ) : (
                <p className="p-10 text-center text-muted-foreground">
                  کوئی اجلاس موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="actions">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {actions.length ? (
              actions.map((a) => (
                <article
                  key={a.id}
                  className={`rounded-2xl border bg-card p-5 ${a.is_overdue ? "border-destructive/40" : ""}`}
                >
                  <div className="flex justify-between">
                    <h2 className="font-bold">{a.title}</h2>
                    <span>{a.progress_percentage}%</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    ذمہ دار: {a.owner_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    آخری تاریخ: {a.due_date || "—"}
                  </p>
                  <div className="mt-4 h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${a.progress_percentage}%` }}
                    />
                  </div>
                  {a.status !== "completed" && (
                    <Button
                      className="mt-4"
                      size="sm"
                      onClick={() =>
                        updateAction.mutate({
                          id: a.id,
                          data: {
                            status: "completed",
                            progress_percentage: 100,
                          },
                        })
                      }
                    >
                      مکمل کریں
                    </Button>
                  )}
                </article>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-muted-foreground">
                کوئی عملی کام موجود نہیں۔
              </p>
            )}
          </section>
        </TabsContent>
      </Tabs>
      <CreateDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        types={types}
        people={people}
        meeting={null}
        mutations={mutations}
      />
    </div>
  );
}
