import { BookOpenCheck, Building2, ShieldCheck, UsersRound } from "lucide-react";

const highlights = [
  { icon: UsersRound, text: "طلبہ اور عملہ کا منظم ریکارڈ" },
  { icon: BookOpenCheck, text: "تعلیمی اور حفظ کی مکمل نگرانی" },
  { icon: ShieldCheck, text: "محفوظ اور بااعتماد انتظامی نظام" },
];

export default function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full border border-primary-foreground/20" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 size-96 rounded-full border border-primary-foreground/15" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-primary-foreground text-primary">
            <Building2 className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold">مدرسہ فیضان القرآن</p>
            <p className="mt-1 text-sm text-primary-foreground/80">نظامِ انتظام</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <p className="text-sm font-medium text-primary-foreground/80">ایک جامع ڈیجیٹل نظام</p>
        <h1 className="mt-4 text-3xl font-bold leading-relaxed xl:text-4xl">مدرسہ کے ہر اہم شعبے کو ایک جگہ منظم کریں۔</h1>
        <p className="mt-5 text-sm leading-8 text-primary-foreground/85">طلبہ، حاضری، حفظ، امتحانات، ہاسٹل اور مالیات کا واضح اور آسان انتظام۔</p>

        <ul className="mt-9 space-y-4">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="grid size-9 place-items-center rounded-lg bg-primary-foreground text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-primary-foreground/75">© 2026 مدرسہ فیضان القرآن۔ جملہ حقوق محفوظ ہیں۔</p>
    </aside>
  );
}
