import {
  admissionPrintHeaderCss,
  getAdmissionPrintHeaderHtml,
} from "@/lib/admissionPrintHeader";
import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";
import { getPrintThemeCss } from "@/lib/printTheme";

function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(label, value, direction = "rtl") {
  return `<div class="field"><span class="label">${escapeHtml(label)}</span><strong dir="${direction}">${escapeHtml(value)}</strong></div>`;
}

function recordsTable(headers, rows) {
  if (!rows?.length)
    return '<p class="empty-record">کوئی ریکارڈ موجود نہیں۔</p>';
  return `<table class="records"><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

export function getStudentAdmissionFormHtml(student, profile) {
  const photo = student.photo
    ? `<img class="photo" src="${escapeHtml(student.photo)}" alt="${escapeHtml(student.full_name)}" />`
    : '<div class="photo photo-placeholder">تصویر</div>';

  return `<!doctype html>
<html lang="ur" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>داخلہ فارم - ${escapeHtml(student.registration_number)}</title>
    <style>
      ${getPrintThemeCss(profile)}
      @page { size: A4 portrait; margin: 6mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111; background: #fff; font-family: Arial, "Noto Nastaliq Urdu", serif; font-size: 10px; }
      .form { width: 100%; border: 1px solid #222; padding: 4mm; }
      .photo-row { margin-top: 3mm; }
      .photo { position:absolute;z-index:5;top:7.5mm;left:9mm;width:21mm;height:25mm;object-fit:cover;border:.25mm solid #7892b9;border-radius:1mm; }
      .photo-placeholder { display: grid; place-items: center; font-size: 12px; }
      .section-title { margin: 2.5mm 0 1mm; border-right: 2.5mm solid #226ce0; background: #eef4ff; padding: 1mm 2.5mm; font-size: 11px; }
      .grid { display: grid; grid-template-columns: repeat(2, 1fr); border: 1px solid #aaa; border-bottom: 0; }
      .field { min-height: 7.5mm; padding: 1mm 2mm; border-bottom: 1px solid #aaa; }
      .field:nth-child(odd) { border-left: 1px solid #aaa; }
      .label { display: block; margin-bottom: .5mm; color: #555; font-size: 8px; }
      strong { display: block; font-size: 10px; font-weight: 700; line-height: 1.25; }
      .wide { border: 1px solid #aaa; min-height: 9mm; padding: 1mm 2mm; }
      .remarks { min-height: 10mm; }
      .records { width: 100%; border-collapse: collapse; font-size: 8.5px; }
      .records th, .records td { height: 6.5mm; border: 1px solid #888; padding: .7mm 1.5mm; text-align: right; vertical-align: top; }
      .records th { height: 6mm; background: #f3f4f6; }
      .empty-record { border: 1px solid #aaa; padding: 3px; color: #555; font-size: 9px; }
      .declaration { margin-top: 2mm; border: 1px solid #888; padding: 1.5mm 2.5mm; line-height: 1.5; }
      .signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12mm; margin-top: 6mm; text-align: center; }
      .signature { border-top: 1px solid #333; padding-top: 1mm; font-size: 10px; }
      ${admissionPrintHeaderCss}
      .photo { border-color: var(--print-primary-border); }
      .section-title { border-right-color: var(--print-primary); background: var(--print-primary-soft); color: var(--print-sidebar); }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
  </head>
  <body>
    <main class="form">
      ${getAdmissionPrintHeaderHtml(profile, { recordNumber: student.registration_number })}
      ${photo}
      <div class="photo-row"><section class="grid">
        ${field("طالب علم کا نام", student.full_name)}
        ${field("والد / سرپرست کا نام", student.guardian_name)}
        ${field("سرپرست سے رشتہ", student.guardian_relation)}
        ${field("تاریخ پیدائش", student.date_of_birth, "ltr")}
        ${field("جنس", student.gender === "male" ? "طالب" : student.gender === "female" ? "طالبہ" : student.gender)}
        ${field("شناختی کارڈ / ب فارم نمبر", student.cnic, "ltr")}
        ${field("موبائل نمبر", student.phone, "ltr")}
        ${field("سرپرست کا شناختی کارڈ", student.guardian_cnic, "ltr")}
        ${field("سرپرست کا رابطہ نمبر", student.guardian_phone, "ltr")}
        ${field("قوم", student.caste)}
        ${field("مذہب", student.religion)}
        ${field("قومیت / ملک", `${student.nationality || "—"} / ${student.country || "—"}`)}
      </section></div>
      <h2 class="section-title">داخلہ و تعلیمی معلومات</h2>
      <section class="grid">
        ${field("رجسٹریشن نمبر", student.registration_number, "ltr")}
        ${field("تاریخ داخلہ", student.admission_date, "ltr")}
        ${field("جماعت", student.class_name)}
        ${field("مطلوبہ درجہ", student.requested_class)}
        ${field("حلقہ", student.halaqa_name)}
        ${field("رہائشی کیفیت", student.residential_status === "resident" ? "ہاسٹل میں مقیم" : "روزانہ آنے والا")}
        ${field("عصری تعلیم", student.modern_education)}
        ${field("دیگر اسناد", student.other_certificates)}
        ${field("کوئی بیماری / طبی کیفیت", student.health_conditions)}
      </section>
      <section class="wide"><span class="label">موجودہ پتہ</span><strong>${escapeHtml(student.current_address)}</strong></section>
      <section class="wide"><span class="label">مستقل پتہ</span><strong>${escapeHtml(student.permanent_address)}</strong></section>
      <h2 class="section-title">سابقہ مدارس</h2>
      ${recordsTable(
        ["مدرسہ", "سال", "درجہ", "تقدیر / نتیجہ"],
        (student.previous_madrasas || []).map((item) => [
          item.name,
          item.year,
          item.grade,
          item.result,
        ]),
      )}
      <h2 class="section-title">رشتہ دار اور ایمرجنسی رابطہ</h2>
      ${recordsTable(
        ["نام", "رشتہ", "پتہ / شہر", "رابطہ نمبر", "پیشہ", "ایمرجنسی"],
        (student.relatives || []).map((item) => [
          item.name,
          item.relation,
          item.address,
          item.phone,
          item.occupation,
          item.is_emergency ? "✓" : "",
        ]),
      )}
      <h2 class="section-title">داخلہ ٹیسٹ اور دفتری استعمال</h2>
      <section class="wide"><span class="label">داخلہ ٹیسٹ کی رپورٹ</span><strong>${escapeHtml(student.admission_test_report)}</strong></section>
      <section class="wide remarks"><span class="label">دفتری نوٹس</span><strong>${escapeHtml(student.office_notes || student.notes || "")}</strong></section>
      <section class="wide"><span class="label">داخلہ فیصلہ</span><strong>${escapeHtml(student.admission_decision)}</strong></section>
      <p class="declaration">تصدیق کی جاتی ہے کہ درج بالا معلومات طالب علم / سرپرست کی فراہم کردہ تفصیل کے مطابق محفوظ کی گئی ہیں۔</p>
      <footer class="signatures"><div class="signature">طالب علم / طالبہ کے دستخط</div><div class="signature">والد / سرپرست کے دستخط</div><div class="signature">مہتمم / ناظم کے دستخط و مہر</div></footer>
    </main>
  </body>
</html>`;
}

export function getStudentsListHtml(
  students,
  listHeading = "تمام طالب علم",
  profile,
) {
  const rows = students
    .map(
      (student, index) =>
        `<tr><td>${index + 1}</td><td dir="ltr">${escapeHtml(student.registration_number)}</td><td>${escapeHtml(student.full_name)}</td><td>${escapeHtml(student.guardian_name)}</td><td>${escapeHtml(student.class_name)}</td><td>${escapeHtml(student.halaqa_name)}</td><td dir="ltr">${escapeHtml(student.guardian_phone)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ur" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>طلبہ کی فہرست</title>
    <style>
      @page { size: A4 landscape; margin: 10mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111; background: #fff; font-family: Arial, "Noto Nastaliq Urdu", serif; }
      header { display: flex; align-items: end; justify-content: space-between; border-bottom: 1px solid #111; padding-bottom: 12px; }
      h1 { margin: 0; font-size: 22px; }
      p { margin: 6px 0 0; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
      th, td { border: 1px solid #777; padding: 8px; text-align: right; vertical-align: middle; }
      th { background: #eee; font-weight: 700; }
      th:first-child, td:first-child { width: 42px; text-align: center; direction: ltr; }
      ${madrasaPrintHeaderCss}
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
  </head>
  <body>
    ${getMadrasaPrintHeaderHtml(profile, { title: listHeading })}
    <table><thead><tr><th>#</th><th>رجسٹریشن نمبر</th><th>طالب علم</th><th>والد / سرپرست</th><th>جماعت</th><th>حلقہ</th><th>سرپرست کا رابطہ نمبر</th></tr></thead><tbody>${rows}</tbody></table>
  </body>
</html>`;
}

export function getHifzReportHtml(
  student,
  logs,
  periodLabel,
  dateFrom,
  dateTo,
  profile,
) {
  const rows = logs
    .map(
      (log, index) =>
        `<tr><td>${index + 1}</td><td dir="ltr">${escapeHtml(log.date)}</td><td>${escapeHtml(log.sabaq_portion)}</td><td>${escapeHtml(log.sabaqi_portion)}</td><td>${escapeHtml(log.manzil_portion)}</td><td>${escapeHtml(log.verified_by_name)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ur" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>حفظ رپورٹ - ${escapeHtml(student.full_name)}</title>
    <style>
      @page { size: A4 landscape; margin: 10mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111; background: #fff; font-family: Arial, "Noto Nastaliq Urdu", serif; }
      header { display: flex; align-items: end; justify-content: space-between; border-bottom: 1px solid #111; padding-bottom: 12px; }
      h1 { margin: 0; font-size: 22px; }
      h2 { margin: 6px 0 0; font-size: 17px; }
      p { margin: 6px 0 0; font-size: 13px; }
      .meta { text-align: left; direction: ltr; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
      th, td { border: 1px solid #777; padding: 8px; text-align: right; vertical-align: middle; }
      th { background: #eee; font-weight: 700; }
      th:first-child, td:first-child { width: 42px; text-align: center; direction: ltr; }
      .empty { margin-top: 28px; border: 1px solid #777; padding: 18px; text-align: center; }
      ${madrasaPrintHeaderCss}
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
  </head>
  <body>
    ${getMadrasaPrintHeaderHtml(profile, { title: `حفظ ڈائری رپورٹ — ${periodLabel}`, subtitle: `${student.full_name} · ${student.registration_number}`, meta: `${escapeHtml(dateFrom)} — ${escapeHtml(dateTo)}` })}
    ${logs.length ? `<table><thead><tr><th>#</th><th>تاریخ</th><th>سبق</th><th>سبقی</th><th>منزل</th><th>تصدیق کنندہ</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="empty">اس مدت کے لیے کوئی حفظ ڈائری ریکارڈ موجود نہیں۔</p>'}
  </body>
</html>`;
}
