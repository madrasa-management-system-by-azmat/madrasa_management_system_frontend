"use client";

import { Award, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getMediaUrl } from "@/lib/apiClient";
import { getPrintThemeCss } from "@/lib/printTheme";
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
    `یہ سند <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b> کو عطا کی جاتی ہے کہ انہوں نے قرآنِ مجید ناظرہ کی تعلیم بحسن و خوبی مکمل کی۔`,
  hifz: (student) =>
    `یہ سند <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b> کو عطا کی جاتی ہے کہ انہوں نے حفظِ قرآنِ مجید کی سعادت حاصل کی۔`,
  tarjama: (student) =>
    `یہ سند <b>${student.full_name}</b> ولد / زیرِ کفالت <b>${student.guardian_name}</b> کو عطا کی جاتی ہے کہ انہوں نے ترجمۂ قرآنِ مجید کا نصاب کامیابی سے مکمل کیا۔`,
};
const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function certificateHtml(student, type, profile) {
  const title = certificateTitles[type];
  if (!title || !certificateBody[type])
    throw new Error("Invalid certificate type.");
  const logoUrl = profile?.logo ? escapeHtml(getMediaUrl(profile.logo)) : "";
  const logo = logoUrl
    ? `<img src="${logoUrl}" alt="" class="logo" />`
    : `<div class="logo-fallback">❖</div>`;
  const watermark = logoUrl
    ? `<img src="${logoUrl}" alt="" class="watermark" />`
    : `<div class="watermark watermark-symbol">❖</div>`;
  const address = [profile?.address, profile?.city, profile?.phone]
    .filter(Boolean)
    .join(" · ");
  const issueDate = new Intl.DateTimeFormat("en-CA").format(new Date());
  const safeStudent = Object.fromEntries(
    Object.entries(student).map(([key, value]) => [key, escapeHtml(value)]),
  );
  const styles = `${getPrintThemeCss(profile)}@page{size:A4 landscape;margin:8mm}*{box-sizing:border-box}body{margin:0;background:#fff;color:#18392f;font-family:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",serif}.certificate{position:relative;min-height:194mm;overflow:hidden;background:#fffdf5;padding:12mm 17mm;text-align:center}.outer-frame{position:absolute;inset:2mm;border:1.2mm solid #174c3c}.middle-frame{position:absolute;inset:4.2mm;border:.4mm solid #c59837}.inner-frame{position:absolute;inset:6mm;border:.2mm solid #174c3c}.pattern{position:absolute;inset:7.5mm;opacity:.13;background-image:linear-gradient(45deg,#c59837 25%,transparent 25%),linear-gradient(-45deg,#c59837 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#c59837 75%),linear-gradient(-45deg,transparent 75%,#c59837 75%);background-position:0 0,0 4mm,4mm -4mm,-4mm 0;background-size:8mm 8mm;mask:linear-gradient(#000 0 0) top/100% 2.4mm no-repeat,linear-gradient(#000 0 0) bottom/100% 2.4mm no-repeat,linear-gradient(#000 0 0) left/2.4mm 100% no-repeat,linear-gradient(#000 0 0) right/2.4mm 100% no-repeat}.corner{position:absolute;z-index:2;width:18mm;height:18mm;color:#c59837;font-size:13mm;line-height:18mm}.corner-tr{top:1.3mm;right:1.5mm}.corner-tl{top:1.3mm;left:1.5mm;transform:rotate(90deg)}.corner-br{right:1.5mm;bottom:1.3mm;transform:rotate(-90deg)}.corner-bl{bottom:1.3mm;left:1.5mm;transform:rotate(180deg)}.watermark{position:absolute;z-index:0;top:53%;left:50%;width:90mm;height:90mm;transform:translate(-50%,-50%);object-fit:contain;opacity:.045;filter:grayscale(1)}.watermark-symbol{display:grid;place-items:center;color:#174c3c;font-size:60mm}.content{position:relative;z-index:3}.bismillah{margin:0;color:#174c3c;font-size:5mm}.header{display:grid;grid-template-columns:24mm 1fr 24mm;align-items:center;margin-top:3mm;border-bottom:.35mm double #c59837;padding-bottom:4mm}.logo,.logo-fallback{display:grid;width:22mm;height:22mm;place-items:center;border:.45mm solid #c59837;border-radius:50%;background:#fff;object-fit:contain;padding:1.3mm;color:#c59837;font-size:10mm}.brand h1{margin:0;color:#174c3c;font-size:9mm;line-height:1.25}.brand p{margin:.8mm 0 0;color:#795f28;font-size:2.9mm}.seal{display:grid;width:21mm;height:21mm;place-items:center;border:.5mm double #c59837;border-radius:50%;color:#174c3c;font-size:2.5mm;font-weight:700}.ornament{display:flex;align-items:center;justify-content:center;gap:3mm;margin:5mm 0 1mm;color:#c59837}.ornament:before,.ornament:after{content:"";width:40mm;height:.25mm;background:linear-gradient(90deg,transparent,#c59837,transparent)}.ornament span{font-size:6mm}.title{margin:1mm 0;color:#174c3c;font-size:9mm;line-height:1.3}.subtitle{margin:0;color:#8b6b2c;font-size:3.1mm;letter-spacing:.2mm}.student{display:inline-block;margin:8mm 0 5mm;border-bottom:.5mm solid #c59837;padding:0 12mm 2mm;color:#143b30;font-size:7.5mm;font-weight:700}.body{margin:0 auto;max-width:230mm;color:#293f38;font-size:4.4mm;line-height:2.25;text-align:center}.body b{color:#174c3c;font-size:4.8mm}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin:8mm auto 0;max-width:225mm}.meta-item{border:.25mm solid #cdbb8c;background:rgb(255 255 255 / .72);padding:2.5mm 4mm}.meta-item small{display:block;color:#806b3a;font-size:2.5mm}.meta-item strong{display:block;margin-top:1mm;color:#174c3c;font-size:3.3mm}.signatures{position:absolute;right:18mm;bottom:16mm;left:18mm;z-index:4;display:grid;grid-template-columns:repeat(3,1fr);gap:17mm}.signature{border-top:.35mm solid #174c3c;padding-top:2.5mm;color:#293f38;font-size:3mm}.dua{position:absolute;right:0;bottom:8mm;left:0;color:#9b7a32;font-size:2.5mm}.outer-frame,.inner-frame{border-color:var(--print-sidebar)}.middle-frame,.logo,.logo-fallback,.seal{border-color:var(--print-primary)}.pattern{background-image:linear-gradient(45deg,var(--print-primary) 25%,transparent 25%),linear-gradient(-45deg,var(--print-primary) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--print-primary) 75%),linear-gradient(-45deg,transparent 75%,var(--print-primary) 75%)}.corner,.logo-fallback,.ornament,.title,.student{color:var(--print-primary)}.bismillah,.brand h1,.seal{color:var(--print-sidebar)}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>${escapeHtml(title)} — ${escapeHtml(student.full_name)}</title><style>${styles}</style></head><body><main class="certificate"><div class="outer-frame"></div><div class="middle-frame"></div><div class="inner-frame"></div><div class="pattern"></div><div class="corner corner-tr">❖</div><div class="corner corner-tl">❖</div><div class="corner corner-br">❖</div><div class="corner corner-bl">❖</div>${watermark}<div class="content"><p class="bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ</p><header class="header">${logo}<div class="brand"><h1>${escapeHtml(profile?.name || "مدرسہ")}</h1>${profile?.name_english ? `<p dir="ltr">${escapeHtml(profile.name_english)}</p>` : ""}${address ? `<p>${escapeHtml(address)}</p>` : ""}</div><div class="seal">سند<br>تصدیق</div></header><div class="ornament"><span>❖</span></div><h2 class="title">${escapeHtml(title)}</h2><p class="subtitle">الحمد للّٰہ رب العالمین</p><p class="student">${escapeHtml(student.full_name)}</p><p class="body">${certificateBody[type](safeStudent)}</p><div class="meta"><div class="meta-item"><small>رجسٹریشن نمبر</small><strong dir="ltr">${escapeHtml(student.registration_number)}</strong></div><div class="meta-item"><small>جماعت</small><strong>${escapeHtml(student.class_name)}</strong></div><div class="meta-item"><small>تاریخ اجرا</small><strong dir="ltr">${issueDate}</strong></div></div></div><footer class="signatures"><div class="signature">کلاس انچارج کے دستخط</div><div class="signature">مہتمم / پرنسپل کے دستخط</div><div class="signature">مہرِ مدرسہ</div></footer><p class="dua">بارک اللّٰہ فی علمہ وعملہ</p></main></body></html>`;
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
      const html = certificateHtml(student, certificateType, profile);
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 450);
    } catch (error) {
      printWindow.close();
      toast.error(
        "سند پرنٹ نہیں ہو سکی",
        getApiErrorMessage(error, error?.message || "عمل مکمل نہیں ہو سکا۔"),
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
