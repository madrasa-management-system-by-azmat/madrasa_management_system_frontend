"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMadrasaProfile } from "@/hooks/useSettings";
import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";

const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export default function AttendanceReportButton({ report, disabled = false }) {
  const { data: profile } = useMadrasaProfile();
  function printReport() {
    if (!report) return;
    const rows = report.students
      .map(
        (student, index) =>
          `<tr><td>${index + 1}</td><td>${escapeHtml(student.student_name)}</td><td dir="ltr">${escapeHtml(student.registration_number)}</td><td dir="ltr">${student.present}</td><td dir="ltr">${student.absent}</td><td dir="ltr">${student.leave}</td><td dir="ltr">${student.percentage}%</td></tr>`,
      )
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(report.label)}</title><style>@page{size:A4 portrait;margin:10mm}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}${madrasaPrintHeaderCss}table{width:100%;border-collapse:collapse;margin-top:15px;font-size:12px}th,td{border:1px solid #777;padding:7px;text-align:right}th{background:#eee}.summary{display:flex;gap:12px;justify-content:center;margin-top:12px;font-size:12px}.summary span{border:1px solid #777;padding:5px 10px}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: report.label, subtitle: `${report.class_name} · ${report.date_from} تا ${report.date_to}` })}<div class="summary"><span>حاضر: ${report.totals.present}</span><span>غیر حاضر: ${report.totals.absent}</span><span>رخصت: ${report.totals.leave}</span></div><table><thead><tr><th>#</th><th>طالب علم</th><th>رجسٹریشن نمبر</th><th>حاضر</th><th>غیر حاضر</th><th>رخصت</th><th>فیصد</th></tr></thead><tbody>${rows || '<tr><td colspan="7" style="text-align:center">کوئی حاضری ریکارڈ موجود نہیں۔</td></tr>'}</tbody></table></body></html>`,
    );
    win.document.close();
    win.focus();
    window.setTimeout(() => win.print(), 350);
  }
  return (
    <Button
      type="button"
      variant="outline"
      onClick={printReport}
      disabled={disabled || !report}
    >
      <Printer />
      رپورٹ پرنٹ کریں
    </Button>
  );
}
