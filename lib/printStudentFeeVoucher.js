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

export function getStudentFeeVoucherHtml(student, feeLog, profile) {
  const outstandingBalance = Number(
    feeLog.outstanding_balance ?? feeLog.amount_due ?? 0,
  );
  const totalDue = Number(feeLog.total_due ?? feeLog.amount_due ?? 0);
  const amountPaid = Number(
    feeLog.amount_paid ?? (feeLog.is_paid ? totalDue : 0),
  );
  const status = outstandingBalance === 0 ? "ادا شدہ" : "واجب الادا";
  const hasMonthlyBreakdown = "tuition_fee" in feeLog;

  return `<!doctype html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>فیس واؤچر - ${escapeHtml(student.registration_number)}</title>
  <style>
    @page { size: A5; margin: 7mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #111; background: #fff; font-family: Arial, "Noto Nastaliq Urdu", serif; }
    .voucher { border: 1.5px solid #111; padding: 10px; }
    header { border-bottom: 1px solid #111; padding-bottom: 7px; text-align: center; }
    h1 { margin: 0; font-size: 18px; }
    h2 { margin: 4px 0 0; font-size: 14px; }
    p { margin: 3px 0 0; font-size: 11px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 10px; border: 1px solid #777; }
    .field { min-height: 48px; padding: 6px 8px; border-bottom: 1px solid #777; }
    .field:nth-child(odd) { border-left: 1px solid #777; }
    .field:nth-last-child(-n+2) { border-bottom: 0; }
    .label { display: block; margin-bottom: 4px; color: #555; font-size: 10px; }
    strong { font-size: 12px; }
    .breakdown { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
    .breakdown th, .breakdown td { border: 1px solid #777; padding: 5px 7px; text-align: right; }
    .breakdown th { width: 64%; background: #eee; font-weight: 700; }
    .amount { margin-top: 10px; padding: 8px; background: #eee; text-align: center; font-size: 14px; font-weight: 800; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 30px; }
    .signature { border-top: 1px solid #111; padding-top: 5px; text-align: center; font-size: 10px; }
    ${madrasaPrintHeaderCss}
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <main class="voucher">
    ${getMadrasaPrintHeaderHtml(profile, { title: "طالب علم فیس واؤچر", subtitle: "نظامِ انتظام" })}
    <section class="grid">
      <div class="field"><span class="label">طالب علم کا نام</span><strong>${escapeHtml(student.full_name)}</strong></div>
      <div class="field"><span class="label">والد / سرپرست</span><strong>${escapeHtml(student.guardian_name)}</strong></div>
      <div class="field"><span class="label">رجسٹریشن نمبر</span><strong dir="ltr">${escapeHtml(student.registration_number)}</strong></div>
      <div class="field"><span class="label">جماعت</span><strong>${escapeHtml(student.class_name)}</strong></div>
      <div class="field"><span class="label">آخری تاریخ</span><strong dir="ltr">${escapeHtml(feeLog.due_date)}</strong></div>
      <div class="field"><span class="label">حیثیت</span><strong>${status}</strong></div>
    </section>
    <table class="breakdown">
      <tbody>
        ${hasMonthlyBreakdown ? `<tr><th>ماہانہ ٹیوشن فیس</th><td dir="ltr">${escapeHtml(feeLog.tuition_fee)}</td></tr><tr><th>ماہانہ ہاسٹل فیس</th><td dir="ltr">${escapeHtml(feeLog.hostel_fee)}</td></tr><tr><th>ڈسکاؤنٹ</th><td dir="ltr">− ${escapeHtml(feeLog.discount)}</td></tr><tr><th>پچھلے مہینوں کا بقایا</th><td dir="ltr">${escapeHtml(feeLog.previous_balance)}</td></tr>` : ""}
        <tr><th>کل قابلِ ادا رقم</th><td dir="ltr">${escapeHtml(totalDue)}</td></tr>
        <tr><th>وصول شدہ رقم</th><td dir="ltr">${escapeHtml(amountPaid)}</td></tr>
        <tr><th>باقی قابلِ وصول رقم</th><td dir="ltr">${escapeHtml(outstandingBalance)}</td></tr>
      </tbody>
    </table>
    <div class="amount">اس واؤچر کی قابلِ وصول رقم: <span dir="ltr">${escapeHtml(outstandingBalance)}</span> روپے</div>
    <footer class="signatures"><div class="signature">والد / سرپرست کے دستخط</div><div class="signature">اکاؤنٹس آفس کے دستخط</div></footer>
  </main>
</body>
</html>`;
}
