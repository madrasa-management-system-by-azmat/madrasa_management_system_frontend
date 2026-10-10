"use client";

import { useMemo, useState } from "react";
import {
  BookCopy,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock3,
  Library,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
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
  useCreateLibraryBook,
  useCreateLibraryCategory,
  useCreateLibraryCopy,
  useCreateLibraryLoan,
  useCreateLibraryMember,
  useCreateLibraryShelf,
  useLibraryBooks,
  useLibraryCategories,
  useLibraryCopies,
  useLibraryDashboard,
  useLibraryFines,
  useLibraryLoans,
  useLibraryMembers,
  useLibraryPeopleLookup,
  useLibraryShelves,
  usePayLibraryFine,
  useRenewLibraryLoan,
  useReturnLibraryLoan,
} from "@/hooks/useLibrary";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const today = () => new Date().toISOString().slice(0, 10);
const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const loanLabels = {
  issued: "جاری",
  returned: "واپس",
  overdue: "تاخیر",
  lost: "گم شدہ",
};
const memberLabels = { student: "طالب علم", staff: "عملہ", external: "بیرونی" };

function LibraryDialog({
  type,
  open,
  onOpenChange,
  categories,
  shelves,
  books,
  copies,
  members,
  people,
  mutations,
}) {
  const [memberType, setMemberType] = useState("student");
  const titles = {
    category: "نیا زمرہ",
    shelf: "نئی الماری",
    book: "نئی کتاب",
    copy: "کتاب کی نئی نقل",
    member: "نئی رکنیت",
    loan: "کتاب جاری کریں",
  };
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    let mutation = mutations[type];
    let data = values;
    if (type === "book")
      data = {
        ...values,
        category: Number(values.category),
        publication_year: values.publication_year
          ? Number(values.publication_year)
          : null,
      };
    if (type === "copy")
      data = {
        ...values,
        book: Number(values.book),
        shelf: values.shelf ? Number(values.shelf) : null,
        purchase_price: Number(values.purchase_price || 0),
      };
    if (type === "member")
      data = {
        ...values,
        student: values.student ? Number(values.student) : null,
        staff: values.staff ? Number(values.staff) : null,
        borrowing_limit: Number(values.borrowing_limit),
        loan_days: Number(values.loan_days),
      };
    if (type === "loan")
      data = {
        copy: Number(values.copy),
        member: Number(values.member),
        issued_on: values.issued_on,
        notes: values.notes,
      };
    try {
      await mutation.mutateAsync(data);
      toast.success("ریکارڈ محفوظ ہو گیا");
      onOpenChange(false);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  const availableCopies = copies.filter((item) => item.status === "available");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
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
            {type === "shelf" && (
              <>
                <input
                  name="name"
                  required
                  placeholder="الماری کا نام"
                  className={inputClass}
                />
                <input
                  name="code"
                  required
                  placeholder="الماری کوڈ"
                  className={inputClass}
                />
                <input
                  name="location"
                  placeholder="مقام"
                  className={inputClass}
                />
              </>
            )}
            {type === "book" && (
              <>
                <input
                  name="title"
                  required
                  placeholder="کتاب کا عنوان"
                  className={inputClass}
                />
                <input
                  name="author"
                  placeholder="مصنف"
                  className={inputClass}
                />
                <select name="category" required className={inputClass}>
                  <option value="">زمرہ</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  name="publisher"
                  placeholder="ناشر"
                  className={inputClass}
                />
                <input
                  name="isbn"
                  placeholder="ISBN"
                  dir="ltr"
                  className={inputClass}
                />
                <select
                  name="language"
                  defaultValue="urdu"
                  className={inputClass}
                >
                  <option value="urdu">اردو</option>
                  <option value="arabic">عربی</option>
                  <option value="english">انگریزی</option>
                  <option value="persian">فارسی</option>
                  <option value="other">دیگر</option>
                </select>
                <input
                  name="publication_year"
                  type="number"
                  placeholder="سن اشاعت"
                  className={inputClass}
                />
              </>
            )}
            {type === "copy" && (
              <>
                <select name="book" required className={inputClass}>
                  <option value="">کتاب منتخب کریں</option>
                  {books.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <input
                  name="accession_number"
                  required
                  placeholder="اندراج نمبر"
                  className={inputClass}
                />
                <input
                  name="barcode"
                  placeholder="بارکوڈ"
                  className={inputClass}
                />
                <select name="shelf" className={inputClass}>
                  <option value="">الماری</option>
                  {shelves.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} — {item.name}
                    </option>
                  ))}
                </select>
                <input
                  name="acquisition_date"
                  type="date"
                  defaultValue={today()}
                  className={inputClass}
                />
                <input
                  name="purchase_price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="قیمت"
                  className={inputClass}
                />
              </>
            )}
            {type === "member" && (
              <>
                <select
                  name="member_type"
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value)}
                  className={inputClass}
                >
                  <option value="student">طالب علم</option>
                  <option value="staff">عملہ</option>
                  <option value="external">بیرونی</option>
                </select>
                <input
                  name="membership_number"
                  required
                  placeholder="رکنیت نمبر"
                  className={inputClass}
                />
                {memberType === "student" && (
                  <select name="student" required className={inputClass}>
                    <option value="">طالب علم</option>
                    {people.students.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name} — {item.registration_number}
                      </option>
                    ))}
                  </select>
                )}
                {memberType === "staff" && (
                  <select name="staff" required className={inputClass}>
                    <option value="">عملہ</option>
                    {people.staff.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>
                )}
                {memberType === "external" && (
                  <>
                    <input
                      name="external_name"
                      required
                      placeholder="نام"
                      className={inputClass}
                    />
                    <input
                      name="phone"
                      placeholder="فون"
                      className={inputClass}
                    />
                  </>
                )}
                <input
                  name="borrowing_limit"
                  type="number"
                  min="1"
                  defaultValue="3"
                  placeholder="کتب کی حد"
                  className={inputClass}
                />
                <input
                  name="loan_days"
                  type="number"
                  min="1"
                  defaultValue="14"
                  placeholder="ادھار دن"
                  className={inputClass}
                />
              </>
            )}
            {type === "loan" && (
              <>
                <select name="copy" required className={inputClass}>
                  <option value="">دستیاب نقل</option>
                  {availableCopies.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.book_title} — {item.accession_number}
                    </option>
                  ))}
                </select>
                <select name="member" required className={inputClass}>
                  <option value="">رکن منتخب کریں</option>
                  {members
                    .filter((item) => item.status === "active")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.display_name} — {item.membership_number}
                      </option>
                    ))}
                </select>
                <input
                  name="issued_on"
                  type="date"
                  defaultValue={today()}
                  required
                  className={inputClass}
                />
                <textarea
                  name="notes"
                  placeholder="نوٹس"
                  className="min-h-20 rounded-lg border border-input bg-background p-3"
                />
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

function Stat({ icon: Icon, label, value, tone }) {
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

export default function LibraryManagementPage() {
  const [dialog, setDialog] = useState(null);
  const [search, setSearch] = useState("");
  const { data: dashboard, isLoading } = useLibraryDashboard();
  const { data: categories = [] } = useLibraryCategories();
  const { data: shelves = [] } = useLibraryShelves();
  const { data: books = [] } = useLibraryBooks();
  const { data: copies = [] } = useLibraryCopies();
  const { data: members = [] } = useLibraryMembers();
  const { data: loans = [] } = useLibraryLoans();
  const { data: fines = [] } = useLibraryFines();
  const { data: people = { students: [], staff: [] } } =
    useLibraryPeopleLookup();
  const mutations = {
    category: useCreateLibraryCategory(),
    shelf: useCreateLibraryShelf(),
    book: useCreateLibraryBook(),
    copy: useCreateLibraryCopy(),
    member: useCreateLibraryMember(),
    loan: useCreateLibraryLoan(),
  };
  const returnLoan = useReturnLibraryLoan();
  const renewLoan = useRenewLibraryLoan();
  const payFine = usePayLibraryFine();
  const filteredBooks = useMemo(
    () =>
      books.filter((item) =>
        `${item.title} ${item.author} ${item.isbn}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [books, search],
  );
  async function action(mutation, payload, message) {
    try {
      await mutation.mutateAsync(payload);
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
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
          <p className="text-sm font-medium text-primary">کتب خانہ</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            لائبریری انتظام
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            کتابوں، نسخوں، اراکین، اجرا، واپسی، ریزرویشن اور جرمانوں کا مکمل
            نظام
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialog("category")}>
            <Plus />
            زمرہ
          </Button>
          <Button variant="outline" onClick={() => setDialog("shelf")}>
            <Plus />
            الماری
          </Button>
          <Button variant="outline" onClick={() => setDialog("member")}>
            <UsersRound />
            رکن
          </Button>
          <Button onClick={() => setDialog("loan")}>
            <BookOpen />
            کتاب جاری کریں
          </Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          icon={Library}
          label="کتابیں"
          value={dashboard?.titles || 0}
          tone="bg-primary/10 text-primary"
        />
        <Stat
          icon={BookCopy}
          label="کل نسخے"
          value={dashboard?.copies || 0}
          tone="bg-info/10 text-info"
        />
        <Stat
          icon={CheckCircle2}
          label="دستیاب"
          value={dashboard?.available || 0}
          tone="bg-success/10 text-success"
        />
        <Stat
          icon={BookOpen}
          label="جاری"
          value={dashboard?.issued || 0}
          tone="bg-warning/10 text-warning"
        />
        <Stat
          icon={Clock3}
          label="تاخیر"
          value={dashboard?.overdue || 0}
          tone="bg-destructive/10 text-destructive"
        />
        <Stat
          icon={UsersRound}
          label="اراکین"
          value={dashboard?.members || 0}
          tone="bg-primary/10 text-primary"
        />
      </section>
      <Tabs defaultValue="catalog">
        <TabsList className="flex-wrap">
          <TabsTrigger value="catalog">کتب کی فہرست</TabsTrigger>
          <TabsTrigger value="loans">اجرا و واپسی</TabsTrigger>
          <TabsTrigger value="members">اراکین</TabsTrigger>
          <TabsTrigger value="fines">جرمانے</TabsTrigger>
        </TabsList>
        <TabsContent value="catalog">
          <section className="rounded-2xl border bg-card">
            <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="عنوان، مصنف یا ISBN تلاش کریں"
                  className={`${inputClass} pr-9`}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDialog("copy")}>
                  <BookCopy />
                  نیا نسخہ
                </Button>
                <Button onClick={() => setDialog("book")}>
                  <Plus />
                  نئی کتاب
                </Button>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.length ? (
                filteredBooks.map((book) => (
                  <article key={book.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-bold">{book.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {book.author || "مصنف نامعلوم"}
                        </p>
                      </div>
                      <Bookmark className="size-5 text-primary" />
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {book.category_name} · {book.language}
                    </p>
                    <div className="mt-3 flex gap-4 text-sm">
                      <span>کل {book.total_copies}</span>
                      <span className="text-success">
                        دستیاب {book.available_copies}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="col-span-full py-10 text-center text-muted-foreground">
                  کوئی کتاب موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="loans">
          <section className="overflow-hidden rounded-2xl border bg-card">
            <div className="border-b p-5">
              <h2 className="font-bold">اجرا اور واپسی</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-220 text-right text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {[
                      "کتاب",
                      "رکن",
                      "اجرا",
                      "واپسی کی تاریخ",
                      "حیثیت",
                      "کارروائی",
                    ].map((label) => (
                      <th key={label} className="px-4 py-3">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-4 py-4 font-semibold">
                        {loan.book_title}
                        <small className="block text-muted-foreground">
                          {loan.accession_number}
                        </small>
                      </td>
                      <td className="px-4">{loan.member_name}</td>
                      <td className="px-4" dir="ltr">
                        {loan.issued_on}
                      </td>
                      <td className="px-4" dir="ltr">
                        {loan.due_on}
                      </td>
                      <td
                        className={
                          loan.status === "overdue"
                            ? "px-4 text-destructive"
                            : "px-4"
                        }
                      >
                        {loanLabels[loan.status]}
                      </td>
                      <td className="px-4">
                        <div className="flex gap-2">
                          {["issued", "overdue"].includes(loan.status) && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  action(renewLoan, loan.id, "مدت بڑھا دی گئی")
                                }
                              >
                                <RefreshCw />
                                تجدید
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  action(
                                    returnLoan,
                                    {
                                      id: loan.id,
                                      data: {
                                        returned_on: today(),
                                        fine_per_day: 10,
                                      },
                                    },
                                    "کتاب واپس ہو گئی",
                                  )
                                }
                              >
                                <RotateCcw />
                                واپسی
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loans.length && (
                <p className="p-10 text-center text-muted-foreground">
                  کوئی اجرا ریکارڈ موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="members">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.length ? (
              members.map((member) => (
                <article
                  key={member.id}
                  className="rounded-2xl border bg-card p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-bold">{member.display_name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {member.membership_number} ·{" "}
                        {memberLabels[member.member_type]}
                      </p>
                    </div>
                    <UsersRound className="size-5 text-primary" />
                  </div>
                  <p className="mt-4 text-sm">
                    جاری کتب: <strong>{member.active_loans}</strong> /{" "}
                    {member.borrowing_limit}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    مدت: {member.loan_days} دن
                  </p>
                </article>
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-muted-foreground">
                کوئی رکن موجود نہیں۔
              </p>
            )}
          </section>
        </TabsContent>
        <TabsContent value="fines">
          <section className="rounded-2xl border bg-card">
            <div className="border-b p-5">
              <h2 className="font-bold">
                جرمانے{" "}
                <span className="mr-2 text-destructive" dir="ltr">
                  {money(dashboard?.unpaid_fines)}
                </span>
              </h2>
            </div>
            <div className="divide-y">
              {fines.length ? (
                fines.map((fine) => (
                  <div
                    key={fine.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {fine.member_name} — {fine.book_title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fine.reason} · {fine.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong dir="ltr">{money(fine.amount)}</strong>
                      {fine.status === "unpaid" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            action(
                              payFine,
                              { id: fine.id, receipt_number: "" },
                              "جرمانہ ادا ہو گیا",
                            )
                          }
                        >
                          ادا کریں
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-10 text-center text-muted-foreground">
                  کوئی جرمانہ موجود نہیں۔
                </p>
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>
      <LibraryDialog
        type={dialog}
        open={Boolean(dialog)}
        onOpenChange={(open) => !open && setDialog(null)}
        categories={categories}
        shelves={shelves}
        books={books}
        copies={copies}
        members={members}
        people={people}
        mutations={mutations}
      />
    </div>
  );
}
