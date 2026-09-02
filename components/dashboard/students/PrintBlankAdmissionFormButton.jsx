"use client";

import { FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMadrasaProfile } from "@/lib/api/settings";
import {
  admissionPrintHeaderCss,
  getAdmissionPrintHeaderHtml,
} from "@/lib/admissionPrintHeader";
import { getPrintThemeCss } from "@/lib/printTheme";
import { getApiErrorMessage, toast } from "@/lib/toast";

const blankLine = (label, className = "") =>
  `<div class="blank-field ${className}"><span>${label}</span><i></i></div>`;
const blankRows = (columns, rows) =>
  `<table><thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead><tbody>${Array.from(
    { length: rows },
    (_, index) =>
      `<tr><td>${index + 1}</td>${columns
        .slice(1)
        .map(() => "<td></td>")
        .join("")}</tr>`,
  ).join("")}</tbody></table>`;

function getBlankAdmissionFormHtml(profile) {
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>خالی داخلہ فارم</title><style>${getPrintThemeCss(profile)}@page{size:A4 portrait;margin:6mm}*{box-sizing:border-box}body{margin:0;color:#111;background:#fff;font-family:Arial,"Noto Nastaliq Urdu",serif;font-size:10px}.form{width:100%;border:1px solid #222;padding:4mm}${admissionPrintHeaderCss}.photo-row{margin-top:3mm}.section-title{margin:2.5mm 0 1mm;border-right:2.5mm solid var(--print-primary);background:var(--print-primary-soft);padding:1mm 2.5mm;font-size:11px}.fields{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #888;border-right:1px solid #888}.blank-field{display:flex;min-height:7.5mm;align-items:flex-end;gap:2mm;border-bottom:1px solid #888;border-left:1px solid #888;padding:1mm 2mm}.blank-field span{flex:none;color:#333;font-weight:700}.blank-field i{display:block;min-width:15mm;flex:1;border-bottom:.25mm dotted #555}.wide{grid-column:1/-1}.address{min-height:9mm}table{width:100%;border-collapse:collapse;font-size:8.5px}th,td{height:6.5mm;border:1px solid #888;padding:.7mm 1.5mm;text-align:right}th{height:6mm;background:#f3f4f6}.declaration{margin-top:2mm;border:1px solid #888;padding:1.5mm 2.5mm;line-height:1.5}.signatures{display:grid;grid-template-columns:repeat(3,1fr);gap:12mm;margin-top:6mm;text-align:center}.signature{border-top:1px solid #333;padding-top:1mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><main class="form">${getAdmissionPrintHeaderHtml(profile)}<div class="photo-row"><div class="fields">${blankLine("طالب علم / طالبہ کا نام")}${blankLine("ولدیت / سرپرست")}${blankLine("تاریخ پیدائش")}${blankLine("جنس: طالب / طالبہ")}${blankLine("شناختی کارڈ / ب فارم")}${blankLine("رابطہ نمبر")}${blankLine("سرپرست سے رشتہ")}${blankLine("سرپرست کا شناختی کارڈ")}${blankLine("سرپرست کا رابطہ نمبر")}${blankLine("قوم")}${blankLine("مذہب")}${blankLine("قومیت / ملک")}</div></div><h2 class="section-title">داخلہ و تعلیمی معلومات</h2><div class="fields">${blankLine("مطلوبہ درجہ")}${blankLine("شعبہ / جماعت")}${blankLine("حلقہ")}${blankLine("تاریخ داخلہ")}${blankLine("عصری تعلیم")}${blankLine("دیگر اسناد")}${blankLine("رہائشی کیفیت: مقیم / غیر مقیم")}${blankLine("کوئی بیماری")}${blankLine("موجودہ پتہ", "wide address")}${blankLine("مستقل پتہ", "wide address")}</div><h2 class="section-title">سابقہ مدارس</h2>${blankRows(["#", "مدرسہ کا نام", "سال", "درجہ", "نمبرات / تقدیر"], 1)}<h2 class="section-title">رشتہ دار اور ایمرجنسی رابطہ</h2>${blankRows(["#", "نام", "رشتہ", "پتہ / شہر", "رابطہ نمبر", "پیشہ", "ایمرجنسی ✓"], 1)}<h2 class="section-title">داخلہ ٹیسٹ اور دفتری استعمال</h2><div class="fields">${blankLine("داخلہ ٹیسٹ کی رپورٹ", "wide address")}${blankLine("داخلہ فیصلہ")}${blankLine("جاری کردہ رجسٹریشن نمبر")}${blankLine("دفتری نوٹس", "wide address")}</div><p class="declaration">میں تصدیق کرتا / کرتی ہوں کہ درج بالا معلومات درست ہیں اور مدرسہ کے قواعد و ضوابط کی پابندی کی جائے گی۔</p><footer class="signatures"><div class="signature">طالب علم / طالبہ کے دستخط</div><div class="signature">والد / سرپرست کے دستخط</div><div class="signature">مہتمم / ناظم کے دستخط و مہر</div></footer></main></body></html>`;
}

export default function PrintBlankAdmissionFormButton() {
  async function printBlankForm() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error(
        "داخلہ فارم پرنٹ نہیں ہو سکا",
        "براہِ کرم browser میں popups کی اجازت دیں۔",
      );
      return;
    }
    printWindow.document.write(
      "<title>داخلہ فارم</title><p style='font-family:sans-serif;padding:24px'>داخلہ فارم تیار ہو رہا ہے...</p>",
    );
    try {
      const profile = await getMadrasaProfile();
      printWindow.document.open();
      printWindow.document.write(getBlankAdmissionFormHtml(profile));
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 400);
    } catch (error) {
      printWindow.close();
      toast.error(
        "داخلہ فارم پرنٹ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
      onClick={printBlankForm}
    >
      <FileText />
      <Printer />
      خالی داخلہ فارم
    </Button>
  );
}
