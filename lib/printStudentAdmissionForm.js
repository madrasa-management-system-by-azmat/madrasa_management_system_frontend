import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";

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
      @page { size: A4 portrait; margin: 5mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111; background: #fff; font-family: Arial, "Noto Nastaliq Urdu", serif; }
      .form { width: 100%; }
      .header { display: grid; grid-template-columns: 100px 1fr 100px; align-items: center; gap: 12px; border-bottom: 1px solid #111; padding: 3px 0 9px; }
      .brand { text-align: center; }
      .brand h1 { margin: 0; font-size: 22px; font-weight: 800; }
      .brand p { margin: 7px 0 0; font-size: 13px; }
      .brand h2 { margin: 12px 0 0; font-size: 17px; }
      .photo { width: 75px; height: 90px; object-fit: cover; border: 1px solid #111; justify-self: end; }
      .photo-placeholder { display: grid; place-items: center; font-size: 12px; }
      .form-number { font-size: 12px; text-align: left; direction: ltr; }
      h3 { margin: 9px 0 4px; font-size: 13px; }
      .grid { display: grid; grid-template-columns: repeat(2, 1fr); border: 1px solid #aaa; border-bottom: 0; }
      .field { min-height: 39px; padding: 4px 7px; border-bottom: 1px solid #aaa; }
      .field:nth-child(odd) { border-left: 1px solid #aaa; }
      .label { display: block; margin-bottom: 2px; color: #555; font-size: 10px; }
      strong { display: block; font-size: 11px; font-weight: 600; line-height: 1.3; }
      .wide { border: 1px solid #aaa; min-height: 38px; padding: 4px 7px; }
      .remarks { min-height: 44px; }
      .records { width: 100%; border-collapse: collapse; margin-top: 3px; font-size: 10px; }
      .records th, .records td { border: 1px solid #aaa; padding: 3px 5px; text-align: right; vertical-align: top; }
      .records th { background: #eee; }
      .empty-record { border: 1px solid #aaa; padding: 4px; color: #555; font-size: 10px; }
      .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 42px; margin-top: 24px; }
      .signature { border-top: 1px solid #111; padding-top: 4px; text-align: center; font-size: 11px; }
      ${madrasaPrintHeaderCss}
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
  </head>
  <body>
    <main class="form">
      <header class="header">
        <div class="form-number">Admission No: ${escapeHtml(student.registration_number)}</div>
        <div class="brand">${getMadrasaPrintHeaderHtml(profile, { title: "طالب علم داخلہ فارم", subtitle: "نظامِ انتظام" })}</div>
        ${photo}
      </header>
      <h3>طالب علم کی معلومات</h3>
      <section class="grid">
        ${field("طالب علم کا نام", student.full_name)}
        ${field("والد / سرپرست کا نام", student.guardian_name)}
        ${field("سرپرست سے رشتہ", student.guardian_relation)}
        ${field("رجسٹریشن نمبر", student.registration_number, "ltr")}
        ${field("تاریخ داخلہ", student.admission_date, "ltr")}
        ${field("شناختی کارڈ / ب فارم نمبر", student.cnic, "ltr")}
        ${field("موبائل نمبر", student.phone, "ltr")}
        ${field("سرپرست کا شناختی کارڈ", student.guardian_cnic, "ltr")}
        ${field("سرپرست کا رابطہ نمبر", student.guardian_phone, "ltr")}
        ${field("جنس", student.gender === "male" ? "طالب" : student.gender === "female" ? "طالبہ" : student.gender)}
        ${field("تاریخ پیدائش", student.date_of_birth, "ltr")}
        ${field("قوم", student.caste)}
        ${field("مذہب", student.religion)}
        ${field("قومیت", student.nationality)}
        ${field("ملک", student.country)}
        ${field("جماعت", student.class_name)}
        ${field("مطلوبہ درجہ", student.requested_class)}
        ${field("حلقہ", student.halaqa_name)}
      </section>
      <h3>رہائشی اور پتہ کی معلومات</h3>
      <section class="grid">
        ${field("رہائشی کیفیت", student.residential_status === "resident" ? "ہاسٹل میں مقیم" : "روزانہ آنے والا")}
        ${field("کوئی بیماری / طبی کیفیت", student.health_conditions)}
      </section>
      <section class="wide"><span class="label">موجودہ پتہ</span><strong>${escapeHtml(student.current_address)}</strong></section>
      <section class="wide"><span class="label">مستقل پتہ</span><strong>${escapeHtml(student.permanent_address)}</strong></section>
      <h3>تعلیمی معلومات</h3>
      <section class="grid">
        ${field("عصری تعلیم", student.modern_education)}
        ${field("دیگر اسناد", student.other_certificates)}
      </section>
      <h3>سابقہ مدارس</h3>
      ${recordsTable(
        ["مدرسہ", "سال", "درجہ", "تقدیر / نتیجہ"],
        (student.previous_madrasas || []).map((item) => [
          item.name,
          item.year,
          item.grade,
          item.result,
        ]),
      )}
      <h3>رشتہ دار اور ایمرجنسی رابطہ</h3>
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
      <h3>داخلہ اور دفتری ریکارڈ</h3>
      <section class="wide"><span class="label">داخلہ ٹیسٹ کی رپورٹ</span><strong>${escapeHtml(student.admission_test_report)}</strong></section>
      <section class="wide remarks"><span class="label">دفتری نوٹس</span><strong>${escapeHtml(student.office_notes || student.notes || "")}</strong></section>
      <section class="wide"><span class="label">داخلہ فیصلہ</span><strong>${escapeHtml(student.admission_decision)}</strong></section>
      <footer class="signatures"><div class="signature">والد / سرپرست کے دستخط</div><div class="signature">منتظم کے دستخط</div></footer>
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
        `<tr><td>${index + 1}</td><td dir="ltr">${escapeHtml(student.registration_number)}</td><td>${escapeHtml(student.full_name)}</td><td>${escapeHtml(student.guardian_name)}</td><td>${escapeHtml(student.class_name)}</td><td>${escapeHtml(student.halaqa_name)}</td><td dir="ltr">${escapeHtml(student.phone)}</td></tr>`,
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
    <table><thead><tr><th>#</th><th>رجسٹریشن نمبر</th><th>طالب علم</th><th>والد / سرپرست</th><th>جماعت</th><th>حلقہ</th><th>موبائل نمبر</th></tr></thead><tbody>${rows}</tbody></table>
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
