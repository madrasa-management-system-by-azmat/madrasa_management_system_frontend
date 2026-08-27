"use client";

import { CreditCard, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllStudents } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getMediaUrl } from "@/lib/apiClient";
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
  return `<article class="id-card front"><div class="front-pattern"></div><div class="front-content">${logo}<h1>${escapeHtml(profile?.name || "مدرسہ")}</h1>${profile?.name_english ? `<p dir="ltr">${escapeHtml(profile.name_english)}</p>` : ""}<span>طالب علم شناختی کارڈ</span></div></article>`;
}

function backCard(student, profile) {
  const photo = student.photo
    ? `<img class="student-photo" src="${escapeHtml(getMediaUrl(student.photo))}" alt="${escapeHtml(student.full_name)}" />`
    : `<div class="student-photo photo-placeholder">تصویر</div>`;
  const qrValue = encodeURIComponent(
    `Madrasa Student ID\nName: ${student.full_name}\nID: ${student.registration_number}\nClass: ${student.class_name || "—"}`,
  );
  return `<article class="id-card back"><div class="back-top"><strong>${escapeHtml(profile?.name || "مدرسہ")}</strong><span>طالب علم شناختی کارڈ</span></div><div class="back-body">${photo}<div class="student-data"><h2>${escapeHtml(student.full_name)}</h2><p><b>آئی ڈی:</b> <span dir="ltr">${escapeHtml(student.registration_number)}</span></p><p><b>والد / سرپرست:</b> ${escapeHtml(student.guardian_name)}</p><p><b>جماعت:</b> ${escapeHtml(student.class_name)}</p><p><b>رابطہ:</b> <span dir="ltr">${escapeHtml(student.phone)}</span></p></div><img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrValue}" alt="QR Code" /></div><div class="back-footer">${escapeHtml(profile?.phone || "")} ${profile?.address ? `· ${escapeHtml(profile.address)}` : ""}</div></article>`;
}

const sharedCss = `*{box-sizing:border-box}body{margin:0;background:#ddd;font-family:Arial,"Noto Nastaliq Urdu",serif;color:#102044}.id-card{position:relative;width:85.6mm;height:54mm;overflow:hidden;border:.35mm solid #226ce0;background:#fff}.front{background:linear-gradient(135deg,#226ce0,#164ba0);color:#fff}.front-pattern{position:absolute;inset:auto -18mm -25mm auto;width:65mm;height:65mm;border:6mm solid rgb(255 255 255 / .12);border-radius:50%}.front-content{position:relative;z-index:1;display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;padding:5mm;text-align:center}.madrasa-logo,.logo-placeholder{display:grid;width:17mm;height:17mm;place-items:center;border-radius:50%;background:#fff;color:#226ce0;object-fit:contain;font-size:9mm;font-weight:700}.madrasa-logo{padding:1mm}.front h1{margin:2.5mm 0 0;font-size:5.2mm}.front p{margin:1mm 0;font-size:2.2mm}.front span{margin-top:2mm;font-size:2.6mm}.back{display:flex;flex-direction:column}.back-top{display:flex;justify-content:space-between;align-items:center;background:#226ce0;color:#fff;padding:2mm 3mm;font-size:2.3mm}.back-top strong{font-size:2.7mm}.back-body{display:grid;grid-template-columns:16mm 1fr 16mm;gap:2.3mm;align-items:center;padding:3mm}.student-photo{width:16mm;height:20mm;object-fit:cover;border:.25mm solid #226ce0}.photo-placeholder{display:grid;place-items:center;font-size:2.2mm;color:#64748b}.student-data{min-width:0}.student-data h2{margin:0 0 1.5mm;font-size:3.4mm;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.student-data p{margin:.6mm 0;font-size:2.15mm;line-height:1.4}.qr{width:15mm;height:15mm}.back-footer{margin-top:auto;border-top:.2mm solid #cbd5e1;padding:1.4mm 3mm;color:#475569;font-size:1.8mm;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`;

function getA4IdCardsHtml(students, profile) {
  const sheets = batchesOfFour(students)
    .map(
      (batch) =>
        `<section class="sheet">${batch.map((student) => `<div class="pair">${frontCard(profile)}${backCard(student, profile)}</div>`).join("")}${Array.from({ length: 4 - batch.length }, () => '<div class="pair blank"></div>').join("")}</section>`,
    )
    .join("");
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>طالب علم شناختی کارڈ</title><style>@page{size:A4 portrait;margin:0}${sharedCss}.sheet{width:210mm;height:297mm;padding:37.5mm 18.4mm;display:grid;grid-template-columns:173.2mm;grid-template-rows:54mm 54mm 54mm 54mm;row-gap:2mm;background:#fff;page-break-after:always}.sheet:last-child{page-break-after:auto}.pair{display:grid;grid-template-columns:85.6mm 85.6mm;column-gap:2mm;direction:ltr}.pair.blank{border:0}.pair.blank:before,.pair.blank:after{content:"";border:.2mm dashed #cbd5e1}.pair .id-card{direction:rtl}@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${sheets}</body></html>`;
}

function getA6IdCardHtml(student, profile) {
  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>شناختی کارڈ — ${escapeHtml(student.full_name)}</title><style>@page{size:A6 portrait;margin:0}${sharedCss}.sheet{width:105mm;height:148mm;padding:18mm 9.7mm;display:grid;grid-template-columns:85.6mm;grid-template-rows:54mm 54mm;row-gap:2mm;background:#fff}.sheet .id-card{direction:rtl}@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><section class="sheet">${frontCard(profile)}${backCard(student, profile)}</section></body></html>`;
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
