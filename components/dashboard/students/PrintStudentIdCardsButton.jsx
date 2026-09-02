"use client";

import { CreditCard, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllStudents } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getMediaUrl } from "@/lib/apiClient";
import { getPrintThemeCss } from "@/lib/printTheme";
import { getApiErrorMessage, toast } from "@/lib/toast";

const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const batchesOfFour = (items) =>
  Array.from({ length: Math.ceil(items.length / 4) }, (_, index) =>
    items.slice(index * 4, index * 4 + 4),
  );

function frontCard(profile) {
  const logo = profile?.logo
    ? `<img class="madrasa-logo" src="${escapeHtml(getMediaUrl(profile.logo))}" alt="" />`
    : `<div class="logo-placeholder">${escapeHtml((profile?.name || "م").charAt(0))}</div>`;
  return `<article class="id-card front"><div class="front-corner front-corner-top"></div><div class="front-corner front-corner-bottom"></div><div class="front-content"><div class="logo-ring">${logo}</div><div class="front-rule"></div><h1>${escapeHtml(profile?.name || "مدرسہ")}</h1>${profile?.name_english ? `<p dir="ltr">${escapeHtml(profile.name_english)}</p>` : ""}<span>طالب علم شناختی کارڈ</span></div></article>`;
}

function backCard(student, profile) {
  const issueDate = new Date();
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const formatDate = (date) => date.toISOString().slice(0, 10);
  const photo = student.photo
    ? `<img class="student-photo" src="${escapeHtml(getMediaUrl(student.photo))}" alt="${escapeHtml(student.full_name)}" />`
    : `<div class="student-photo photo-placeholder">تصویر</div>`;
  const qrValue = encodeURIComponent(
    `Madrasa Student ID\nName: ${student.full_name}\nID: ${student.registration_number}\nClass: ${student.class_name || "—"}`,
  );
  const watermark = profile?.logo
    ? `<img class="back-watermark" src="${escapeHtml(getMediaUrl(profile.logo))}" alt="" />`
    : `<div class="back-watermark watermark-letter">${escapeHtml((profile?.name || "م").charAt(0))}</div>`;
  return `<article class="id-card back">${watermark}<div class="back-top"><div><strong>${escapeHtml(profile?.name || "مدرسہ")}</strong><span>طالب علم شناختی کارڈ</span></div><span class="card-number" dir="ltr">${escapeHtml(student.registration_number)}</span></div><div class="back-body"><div class="identity-column">${photo}<span class="student-type">${student.gender === "female" ? "طالبہ" : "طالب علم"}</span></div><div class="student-data"><h2>${escapeHtml(student.full_name)}</h2><dl><div><dt>والد / سرپرست</dt><dd>${escapeHtml(student.guardian_name)}</dd></div><div><dt>جماعت</dt><dd>${escapeHtml(student.class_name)}</dd></div><div><dt>تاریخ پیدائش</dt><dd dir="ltr">${escapeHtml(student.date_of_birth)}</dd></div><div><dt>اجرا کی تاریخ</dt><dd dir="ltr">${formatDate(issueDate)}</dd></div><div><dt>تاریخ تنسیخ</dt><dd dir="ltr">${formatDate(expiryDate)}</dd></div><div class="address-row"><dt>پتہ</dt><dd>${escapeHtml(student.current_address || student.permanent_address)}</dd></div></dl></div><div class="qr-column"><div class="qr-frame"><img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrValue}" alt="QR Code" /></div><small>Scan to verify</small></div></div><div class="back-footer"><span class="madrasa-contact">${escapeHtml(profile?.phone || "")}</span><span class="madrasa-signature">دستخط و مہرِ مدرسہ</span></div></article>`;
}

const dynamicBrandCss = `.front:before{border-color:var(--print-primary-border)}.back-top{background:var(--print-primary)}.watermark-letter{border-color:var(--print-primary);color:var(--print-primary)}.student-photo{box-shadow:0 0 0 .3mm var(--print-primary),0 1mm 2mm color-mix(in srgb,var(--print-sidebar) 18%,transparent)}.photo-placeholder,.student-type{background:var(--print-primary-soft)}.student-type{color:var(--print-primary)}.student-data h2,.student-data dd{color:var(--print-sidebar)}.student-data dt,.qr-column small,.back-footer{color:var(--print-sidebar-muted)}.student-data dl div,.qr-frame{border-color:var(--print-primary-border)}.madrasa-signature{border-color:var(--print-sidebar-muted)}`;

const sharedCss = `*{box-sizing:border-box}body{margin:0;background:#e5e7eb;font-family:Arial,"Noto Nastaliq Urdu",serif;color:#15233d}.id-card{position:relative;width:85.6mm;height:54mm;overflow:hidden;border:.32mm solid #226ce0;border-radius:2.4mm;background:#fff}.front{color:#10234a;background:linear-gradient(145deg,#fff 0%,#f4f8ff 58%,#e5efff 100%);box-shadow:inset 0 0 0 .7mm #fff,inset 0 0 0 1mm #226ce0}.front:before{content:"";position:absolute;inset:2.2mm;border:.18mm solid rgb(34 108 224 / .35);border-radius:1.4mm}.front-corner{position:absolute;width:35mm;height:35mm;border-radius:50%;background:#226ce0}.front-corner-top{top:-25mm;left:-20mm}.front-corner-bottom{right:-23mm;bottom:-26mm;background:#b7d1fa}.front-content{position:relative;z-index:2;display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;padding:4mm;text-align:center}.logo-ring{display:grid;width:18.5mm;height:18.5mm;place-items:center;border:.5mm solid #226ce0;border-radius:50%;background:#fff;box-shadow:0 1.2mm 3mm rgb(34 108 224 / .16)}.madrasa-logo,.logo-placeholder{display:grid;width:15.5mm;height:15.5mm;place-items:center;border-radius:50%;background:#fff;color:#226ce0;object-fit:contain;font-size:8mm;font-weight:800}.madrasa-logo{padding:1mm}.front-rule{width:11mm;height:.7mm;margin-top:2.1mm;border-radius:99px;background:#226ce0}.front h1{margin:1.3mm 0 0;font-size:5mm;line-height:1.2}.front p{margin:.5mm 0 0;color:#587099;font-size:2.15mm}.front span{margin-top:1.6mm;border-radius:99px;background:#226ce0;padding:.8mm 3mm;color:#fff;font-size:2.4mm;letter-spacing:.15mm}.back{display:flex;flex-direction:column;background:linear-gradient(180deg,#fff,#f8fbff)}.back:after{content:"";position:absolute;inset:0;border-bottom:2.2mm solid #226ce0;pointer-events:none}.back-watermark{position:absolute;z-index:0;top:50%;left:50%;width:31mm;height:31mm;transform:translate(-50%,-45%);object-fit:contain;opacity:.055;filter:grayscale(1)}.watermark-letter{display:grid;place-items:center;border:1mm solid #226ce0;border-radius:50%;color:#226ce0;font-size:20mm;font-weight:800}.back-top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;min-height:9mm;background:#226ce0;padding:1.2mm 3mm;color:#fff}.back-top>div{display:flex;flex-direction:column}.back-top strong{max-width:53mm;overflow:hidden;font-size:2.7mm;line-height:1.25;text-overflow:ellipsis;white-space:nowrap}.back-top span{font-size:1.75mm;opacity:.85}.back-top .card-number{border:.2mm solid rgb(255 255 255 / .55);border-radius:99px;padding:.5mm 2mm;font-size:2mm;opacity:1}.back-body{position:relative;z-index:1;display:grid;grid-template-columns:16.5mm minmax(0,1fr) 17mm;gap:2.2mm;align-items:center;flex:1;padding:1.6mm 3mm 1mm}.identity-column{display:flex;flex-direction:column;align-items:center;gap:.7mm}.student-photo{width:16.5mm;height:20mm;border:.5mm solid #fff;border-radius:1.6mm;object-fit:cover;box-shadow:0 0 0 .3mm #226ce0,0 1mm 2mm rgb(15 35 70 / .18)}.photo-placeholder{display:grid;place-items:center;background:#eef4ff;color:#64748b;font-size:2.2mm}.student-type{border-radius:99px;background:#e8f1ff;padding:.35mm 1.5mm;color:#226ce0;font-size:1.7mm;font-weight:700}.student-data{min-width:0}.student-data h2{margin:0 0 .8mm;color:#153d7d;font-size:3.45mm;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.student-data dl{margin:0}.student-data dl div{display:grid;grid-template-columns:14mm 1fr;align-items:baseline;border-bottom:.15mm solid #dce5f2;padding:.18mm 0}.student-data dt{color:#64748b;font-size:1.55mm}.student-data dd{margin:0;overflow:hidden;color:#15233d;font-size:1.85mm;font-weight:700;line-height:1.15;text-overflow:ellipsis;white-space:nowrap}.student-data .address-row dd{font-size:1.6mm}.qr-column{display:flex;flex-direction:column;align-items:center;gap:.4mm}.qr-frame{display:grid;width:15.5mm;height:15.5mm;place-items:center;border:.3mm solid #d5e2f5;border-radius:1mm;background:#fff;padding:.7mm}.qr{width:13.5mm;height:13.5mm}.qr-column small{color:#64748b;font-size:1.25mm}.back-footer{position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:space-between;gap:3mm;min-height:6.3mm;padding:.7mm 3mm 1.8mm;color:#52637d;font-size:1.55mm}.madrasa-contact{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.madrasa-signature{min-width:25mm;border-top:.25mm solid #52637d;padding-top:.7mm;text-align:center;font-size:1.75mm;font-weight:700;white-space:nowrap}`;

function getA4IdCardsHtml(students, profile) {
  const sheets = batchesOfFour(students)
    .map(
      (batch) =>
        `<section class="sheet">${batch.map((student) => `<div class="pair">${frontCard(profile)}${backCard(student, profile)}</div>`).join("")}${Array.from({ length: 4 - batch.length }, () => '<div class="pair blank"></div>').join("")}</section>`,
    )
    .join("");
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>طالب علم شناختی کارڈ</title><style>${getPrintThemeCss(profile)}@page{size:A4 portrait;margin:0}${sharedCss}${dynamicBrandCss}.id-card{border-color:var(--print-primary)}.front{color:var(--print-sidebar);background:linear-gradient(145deg,#fff 0%,var(--print-primary-softer) 58%,var(--print-primary-soft) 100%);box-shadow:inset 0 0 0 .7mm #fff,inset 0 0 0 1mm var(--print-primary)}.front-corner,.front-rule,.front span{background:var(--print-primary)}.front-corner-bottom{background:var(--print-primary-border)}.logo-ring{border-color:var(--print-primary)}.madrasa-logo,.logo-placeholder{color:var(--print-primary)}.front h1,.back-top strong,.student-data h2{color:var(--print-sidebar)}.front p{color:var(--print-sidebar-muted)}.back{background:linear-gradient(180deg,#fff,var(--print-primary-softer))}.back:after{border-bottom-color:var(--print-primary)}.sheet{width:210mm;height:297mm;padding:37.5mm 18.4mm;display:grid;grid-template-columns:173.2mm;grid-template-rows:54mm 54mm 54mm 54mm;row-gap:2mm;background:#fff;page-break-after:always}.sheet:last-child{page-break-after:auto}.pair{display:grid;grid-template-columns:85.6mm 85.6mm;column-gap:2mm;direction:ltr}.pair.blank{border:0}.pair.blank:before,.pair.blank:after{content:"";border:.2mm dashed #cbd5e1}.pair .id-card{direction:rtl}@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${sheets}</body></html>`;
}

function getA6IdCardHtml(student, profile) {
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>شناختی کارڈ — ${escapeHtml(student.full_name)}</title><style>${getPrintThemeCss(profile)}@page{size:A6 portrait;margin:0}${sharedCss}${dynamicBrandCss}.id-card{border-color:var(--print-primary)}.front{color:var(--print-sidebar);background:linear-gradient(145deg,#fff 0%,var(--print-primary-softer) 58%,var(--print-primary-soft) 100%);box-shadow:inset 0 0 0 .7mm #fff,inset 0 0 0 1mm var(--print-primary)}.front-corner,.front-rule,.front span{background:var(--print-primary)}.front-corner-bottom{background:var(--print-primary-border)}.logo-ring{border-color:var(--print-primary)}.madrasa-logo,.logo-placeholder{color:var(--print-primary)}.front h1,.back-top strong,.student-data h2{color:var(--print-sidebar)}.front p{color:var(--print-sidebar-muted)}.back{background:linear-gradient(180deg,#fff,var(--print-primary-softer))}.back:after{border-bottom-color:var(--print-primary)}.sheet{width:105mm;height:148mm;padding:18mm 9.7mm;display:grid;grid-template-columns:85.6mm;grid-template-rows:54mm 54mm;row-gap:2mm;background:#fff}.sheet .id-card{direction:rtl}.sheet .back{transform:rotate(180deg)}@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><section class="sheet">${frontCard(profile)}${backCard(student, profile)}</section></body></html>`;
}

function openPrint(html, errorTitle) {
  const win = window.open("", "_blank");
  if (!win) {
    toast.error(errorTitle, "براہِ کرم browser میں popups کی اجازت دیں۔");
    return;
  }
  win.document.write(
    "<title>شناختی کارڈ</title><p style='font-family:sans-serif;padding:24px'>شناختی کارڈ تیار ہو رہے ہیں...</p>",
  );
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 500);
}

export function PrintSingleStudentIdCardButton({
  student,
  profile,
  disabled = false,
}) {
  async function printCard() {
    try {
      const currentProfile = profile || (await getMadrasaProfile());
      openPrint(
        getA6IdCardHtml(student, currentProfile),
        "شناختی کارڈ پرنٹ نہیں ہو سکا",
      );
    } catch (error) {
      toast.error(
        "شناختی کارڈ پرنٹ نہیں ہو سکا",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={printCard}
      disabled={disabled}
    >
      <Printer />
      A6 کارڈ
    </Button>
  );
}

export default function PrintStudentIdCardsButton({
  academicClassId,
  disabled = false,
}) {
  async function printIdCards() {
    if (!academicClassId) {
      toast.error(
        "جماعت منتخب کریں",
        "شناختی کارڈ پرنٹ کرنے سے پہلے ایک جماعت منتخب کریں۔",
      );
      return;
    }
    try {
      const [students, profile] = await Promise.all([
        getAllStudents({ currentClass: academicClassId, status: "active" }),
        getMadrasaProfile(),
      ]);
      if (!students.length)
        throw new Error("منتخب جماعت میں کوئی فعال طالب علم موجود نہیں ہے۔");
      openPrint(
        getA4IdCardsHtml(students, profile),
        "شناختی کارڈ پرنٹ نہیں ہو سکے",
      );
    } catch (error) {
      toast.error(
        "شناختی کارڈ پرنٹ نہیں ہو سکے",
        error.message || getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
      onClick={printIdCards}
      disabled={disabled || !academicClassId}
    >
      <CreditCard />
      <Printer />
      A4 کارڈ پرنٹ کریں
    </Button>
  );
}
