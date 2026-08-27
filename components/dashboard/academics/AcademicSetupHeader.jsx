import { BookCopy } from "lucide-react";

const text = {
  description: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06D2 \u0627\u0646\u062F\u0631\u0627\u062C \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0627\u067E\u0646\u06D2 \u0634\u0639\u0628\u06D2\u060C \u062C\u0645\u0627\u0639\u062A\u06CC\u06BA \u0627\u0648\u0631 \u062D\u0644\u0642\u06D2 \u0628\u0646\u0627\u0626\u06CC\u06BA\u06D4",
  eyebrow: "\u062A\u0639\u0644\u06CC\u0645\u06CC \u062A\u0631\u062A\u06CC\u0628",
  title: "\u0634\u0639\u0628\u06D2\u060C \u062C\u0645\u0627\u0639\u062A\u06CC\u06BA \u0627\u0648\u0631 \u062D\u0644\u0642\u06D2",
};

export default function AcademicSetupHeader() {
  return (
    <section className="flex items-start gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <BookCopy className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{text.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{text.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{text.description}</p>
      </div>
    </section>
  );
}
