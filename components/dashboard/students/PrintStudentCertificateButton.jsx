"use client";

import { Award, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getMediaUrl } from "@/lib/apiClient";
import { getApiErrorMessage, toast } from "@/lib/toast";

const certificateTitles = {
  leaving: "مدرسہ چھوڑنے کا سرٹیفکیٹ",
  nazera: "سندِ ناظرۂ قرآن",
  hifz: "سندِ حفظِ قرآن",
  tarjama: "سندِ ترجمۂ قرآن",
};

const certificateBody = {
  leaving: (student) =>
    `یہ تصدیق کی جاتی ہے کہ <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b>، رجسٹریشن نمبر <span dir="ltr">${student.registration_number}</span>، جماعت <b>${student.class_name || "—"}</b>، نے مدرسہ سے اپنی تعلیم مکمل / ترک کر دی ہے۔ طالب علم کا کردار اور ریکارڈ مدرسہ کے دستیاب ریکارڈ کے مطابق ہے۔`,
  nazera: (student) =>
    `یہ سند <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b> کو عطا کی جاتی ہے کہ انہوں نے قرآنِ مجید ناظرہ کی تعلیم مکمل کی۔`,
  hifz: (student) =>
    `یہ سند <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b> کو عطا کی جاتی ہے کہ انہوں نے حفظِ قرآنِ مجید کی تکمیل کی۔`,
  tarjama: (student) =>
    `یہ سند <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b> کو عطا کی جاتی ہے کہ انہوں نے ترجمۂ قرآنِ مجید کا کورس مکمل کیا۔`,
};

const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function certificateHtml(student, type, profile) {
  const logo = profile?.logo
    ? `<img src="${escapeHtml(getMediaUrl(profile.logo))}" alt="" class="logo" />`
    : "";
  const title = certificateTitles[type];
  const address = [profile?.address, profile?.city, profile?.phone]
    .filter(Boolean)
    .join(" · ");
  const issueDate = new Intl.DateTimeFormat("en-CA").format(new Date());
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>${escapeHtml(title)} — ${escapeHtml(student.full_name)}</title><style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,"Noto Nastaliq Urdu",serif;color:#172554;background:#fff}.certificate{position:relative;min-height:186mm;border:1.2mm double #226ce0;padding:13mm 16mm;text-align:center;overflow:hidden}.certificate:before,.certificate:after{content:"";position:absolute;width:55mm;height:55mm;border:2mm solid rgb(34 108 224 / .12);border-radius:50%}.certificate:before{top:-25mm;right:-20mm}.certificate:after{bottom:-25mm;left:-20mm}.header{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:5mm;border-bottom:.35mm solid #226ce0;padding-bottom:5mm}.logo{width:20mm;height:20mm;object-fit:contain}.brand h1{margin:0;color:#226ce0;font-size:8mm}.brand p{margin:1mm 0 0;font-size:3mm;color:#475569}.title{position:relative;z-index:1;margin:10mm 0 3mm;color:#226ce0;font-size:8mm}.subtitle{position:relative;z-index:1;margin:0;color:#64748b;font-size:3.2mm}.student{position:relative;z-index:1;margin:11mm 0 7mm;font-size:6.5mm;font-weight:700;text-decoration:underline;text-decoration-color:#226ce0;text-underline-offset:3mm}.body{position:relative;z-index:1;margin:0 auto;max-width:230mm;font-size:4.2mm;line-height:2.1;text-align:justify}.meta{position:relative;z-index:1;display:flex;justify-content:space-between;margin-top:9mm;border-top:.25mm solid #cbd5e1;padding-top:4mm;font-size:3.2mm}.signatures{position:absolute;right:16mm;bottom:15mm;left:16mm;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:14mm}.signature{border-top:.3mm solid #1e293b;padding-top:3mm;font-size:3.1mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><main class="certificate"><header class="header">${logo}<div class="brand"><h1>${escapeHtml(profile?.name || "مدرسہ")}</h1>${profile?.name_english ? `<p dir="ltr">${escapeHtml(profile.name_english)}</p>` : ""}${address ? `<p>${escapeHtml(address)}</p>` : ""}</div></header><h2 class="title">${escapeHtml(title)}</h2><p class="subtitle">بسم اللہ الرحمن الرحیم</p><p class="student">${escapeHtml(student.full_name)}</p><p class="body">${certificateBody[type](Object.fromEntries(Object.entries(student).map(([key, value]) => [key, escapeHtml(value)])))}</p><div class="meta"><span>رجسٹریشن نمبر: <b dir="ltr">${escapeHtml(student.registration_number)}</b></span><span>جماعت: ${escapeHtml(student.class_name)}</span><span>تاریخ اجرا: <b dir="ltr">${issueDate}</b></span></div><footer class="signatures"><div class="signature">کلاس انچارج کے دستخط</div><div class="signature">مہتمم / پرنسپل کے دستخط</div><div class="signature">مہرِ مدرسہ</div></footer></main></body></html>`;
}

export default function PrintStudentCertificateButton({
  student,
  certificateType,
  disabled = false,
}) {
  async function printCertificate() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error(
        "سند پرنٹ نہیں ہو سکی",
        "براہِ کرم browser میں popups کی اجازت دیں۔",
      );
      return;
    }
    printWindow.document.write(
      "<title>سند تیار ہو رہی ہے</title><p style='font-family:sans-serif;padding:24px'>سند تیار ہو رہی ہے...</p>",
    );
    try {
      const profile = await getMadrasaProfile();
      printWindow.document.open();
      printWindow.document.write(
        certificateHtml(student, certificateType, profile),
      );
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 450);
    } catch (error) {
      printWindow.close();
      toast.error(
        "سند پرنٹ نہیں ہو سکی",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <Button
      type="button"
      onClick={printCertificate}
      disabled={disabled || !student || !certificateType}
    >
      <Award />
      <Printer />
      سند پرنٹ کریں
    </Button>
  );
}

export { certificateTitles };
