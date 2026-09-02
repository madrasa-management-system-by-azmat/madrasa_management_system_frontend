import { getMediaUrl } from "@/lib/apiClient";
import { getPrintThemeCss } from "@/lib/printTheme";

function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getStudentFeeVoucherHtml(student, feeLog, profile) {
  const outstandingBalance = Number(
    feeLog.outstanding_balance ?? feeLog.amount_due ?? 0,
  );
  const totalDue = Number(feeLog.total_due ?? feeLog.amount_due ?? 0);
  const amountPaid = Number(
    feeLog.amount_paid ?? (feeLog.is_paid ? totalDue : 0),
  );
  const isPaid = outstandingBalance === 0;
  const hasMonthlyBreakdown = "tuition_fee" in feeLog;
  const logoUrl = profile?.logo ? escapeHtml(getMediaUrl(profile.logo)) : "";
  const logo = logoUrl
    ? `<img class="logo" src="${logoUrl}" alt="" />`
    : `<div class="logo fallback">م</div>`;
  const watermark = logoUrl
    ? `<img class="watermark" src="${logoUrl}" alt="" />`
    : "";
  const address = [profile?.address, profile?.city, profile?.phone]
    .filter(Boolean)
    .join(" · ");
  const voucherNo = feeLog.receipt_number || `FEE-${feeLog.id || student.id}`;
  const billingMonth = feeLog.billing_month || feeLog.month || "—";

  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>فیس واؤچر - ${escapeHtml(student.registration_number)}</title><style>${getPrintThemeCss(profile)}@page{size:A5 portrait;margin:6mm}*{box-sizing:border-box}body{margin:0;background:#fff;color:#17233b;font-family:Arial,"Noto Nastaliq Urdu",serif}.voucher{position:relative;min-height:198mm;overflow:hidden;border:.45mm solid var(--print-primary);border-radius:2mm;background:linear-gradient(180deg,#fff,var(--print-primary-softer));padding:5mm}.voucher:before{content:"";position:absolute;inset:2mm;border:.18mm solid rgb(34 108 224 / .28);border-radius:1mm;pointer-events:none}.watermark{position:absolute;z-index:0;top:53%;left:50%;width:75mm;height:75mm;transform:translate(-50%,-50%);object-fit:contain;opacity:.035;filter:grayscale(1)}.content{position:relative;z-index:1}.header{display:grid;grid-template-columns:21mm 1fr 22mm;align-items:center;gap:3mm;border-bottom:.5mm double var(--print-primary);padding:1mm 1mm 4mm}.logo{width:19mm;height:19mm;border:.35mm solid #c99b3c;border-radius:50%;background:#fff;padding:1mm;object-fit:contain}.fallback{display:grid;place-items:center;color:var(--print-primary);font-size:9mm;font-weight:800}.brand{text-align:center}.brand h1{margin:0;color:var(--print-sidebar);font-size:6mm;line-height:1.2}.brand p{margin:.8mm 0 0;color:#62738e;font-size:2.2mm}.brand h2{display:inline-block;margin:2mm 0 0;border-radius:99px;background:var(--print-primary);padding:.8mm 4mm;color:#fff;font-size:3mm}.voucher-meta{text-align:left;font-size:2mm}.voucher-meta span{display:block;color:#64748b}.voucher-meta strong{display:block;margin:.5mm 0 1.5mm;color:#1e365e;font-size:2.4mm}.status{display:inline-block!important;border-radius:99px;padding:.7mm 2mm;color:#fff!important;text-align:center}.paid{background:#15803d}.due{background:#dc2626}.student-strip{display:grid;grid-template-columns:repeat(2,1fr);margin-top:4mm;border:.2mm solid #b8c7dc;border-radius:1mm;overflow:hidden;background:rgb(255 255 255 / .82)}.field{min-height:12mm;border-bottom:.2mm solid #d5deea;padding:2mm 2.5mm}.field:nth-child(odd){border-left:.2mm solid #d5deea}.field:nth-last-child(-n+2){border-bottom:0}.field small{display:block;color:#6b7b91;font-size:2.1mm}.field strong{display:block;margin-top:.8mm;color:#17233b;font-size:2.8mm;line-height:1.3}.section-heading{display:flex;align-items:center;gap:2mm;margin:5mm 0 2mm;color:var(--print-sidebar);font-size:3mm;font-weight:800}.section-heading:after{content:"";height:.2mm;flex:1;background:linear-gradient(90deg,#b7c9e3,transparent)}.breakdown{width:100%;border-collapse:separate;border-spacing:0;overflow:hidden;border:.2mm solid #b8c7dc;border-radius:1mm;background:rgb(255 255 255 / .84);font-size:2.6mm}.breakdown th,.breakdown td{border-bottom:.2mm solid #d5deea;padding:2mm 3mm;text-align:right}.breakdown tr:last-child th,.breakdown tr:last-child td{border-bottom:0}.breakdown th{width:65%;color:#40516b;font-weight:600}.breakdown td{border-right:.2mm solid #d5deea;color:#17233b;font-weight:700;text-align:left}.breakdown .grand th,.breakdown .grand td{background:var(--print-primary-soft);color:var(--print-sidebar);font-weight:800}.balance-box{display:grid;grid-template-columns:1fr auto;align-items:center;margin-top:4mm;border-radius:1.5mm;background:${isPaid ? "#e9f8ef" : "#fff1f1"};padding:3mm 4mm;color:${isPaid ? "#166534" : "#991b1b"}}.balance-box small{display:block;font-size:2.2mm}.balance-box strong{font-size:5mm}.instructions{margin-top:4mm;border-right:1mm solid #c99b3c;background:#fffbeb;padding:2.5mm 3mm;color:#6b5425;font-size:2.2mm;line-height:1.7}.signatures{display:grid;grid-template-columns:repeat(2,1fr);gap:18mm;margin-top:11mm;text-align:center}.signature{border-top:.3mm solid #35445d;padding-top:2mm;color:#4d5d74;font-size:2.3mm}.footer{display:flex;justify-content:space-between;gap:4mm;margin-top:5mm;border-top:.2mm solid #d5deea;padding-top:2mm;color:#64748b;font-size:1.8mm}.footer span{max-width:48%}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.voucher{border-color:var(--print-primary);background:linear-gradient(180deg,#fff,var(--print-primary-softer))}.voucher:before{border-color:var(--print-primary-border)}.header{border-bottom-color:var(--print-primary)}.fallback{color:var(--print-primary)}.brand h1{color:var(--print-sidebar)}.brand h2{background:var(--print-primary)}th{background:var(--print-primary)} </style></head><body><main class="voucher">${watermark}<div class="content"><header class="header">${logo}<div class="brand"><h1>${escapeHtml(profile?.name || "مدرسہ")}</h1>${profile?.name_english ? `<p dir="ltr">${escapeHtml(profile.name_english)}</p>` : ""}${address ? `<p>${escapeHtml(address)}</p>` : ""}<h2>طالب علم فیس واؤچر</h2></div><div class="voucher-meta"><span>واؤچر نمبر</span><strong dir="ltr">${escapeHtml(voucherNo)}</strong><span class="status ${isPaid ? "paid" : "due"}">${isPaid ? "ادا شدہ" : "واجب الادا"}</span></div></header><section class="student-strip"><div class="field"><small>طالب علم</small><strong>${escapeHtml(student.full_name)}</strong></div><div class="field"><small>والد / سرپرست</small><strong>${escapeHtml(student.guardian_name)}</strong></div><div class="field"><small>رجسٹریشن نمبر</small><strong dir="ltr">${escapeHtml(student.registration_number)}</strong></div><div class="field"><small>جماعت</small><strong>${escapeHtml(student.class_name)}</strong></div><div class="field"><small>بلنگ مہینہ</small><strong dir="ltr">${escapeHtml(billingMonth)}</strong></div><div class="field"><small>آخری تاریخ</small><strong dir="ltr">${escapeHtml(feeLog.due_date)}</strong></div></section><h3 class="section-heading">فیس کی تفصیل</h3><table class="breakdown"><tbody>${hasMonthlyBreakdown ? `<tr><th>ماہانہ ٹیوشن فیس</th><td dir="ltr">${money(feeLog.tuition_fee)}</td></tr><tr><th>ماہانہ ہاسٹل فیس</th><td dir="ltr">${money(feeLog.hostel_fee)}</td></tr><tr><th>رعایت / ڈسکاؤنٹ</th><td dir="ltr">− ${money(feeLog.discount)}</td></tr><tr><th>پچھلا بقایا</th><td dir="ltr">${money(feeLog.previous_balance)}</td></tr>` : ""}<tr class="grand"><th>کل قابلِ ادا رقم</th><td dir="ltr">${money(totalDue)}</td></tr><tr><th>وصول شدہ رقم</th><td dir="ltr">${money(amountPaid)}</td></tr><tr><th>باقی قابلِ وصول رقم</th><td dir="ltr">${money(outstandingBalance)}</td></tr></tbody></table><div class="balance-box"><div><small>${isPaid ? "فیس مکمل طور پر ادا ہو چکی ہے" : "اس واؤچر کی قابلِ وصول رقم"}</small><strong dir="ltr">${money(outstandingBalance)} روپے</strong></div><span>${isPaid ? "✓" : "!"}</span></div><p class="instructions">براہِ کرم مقررہ تاریخ تک فیس جمع کروائیں اور تصدیق شدہ رسید محفوظ رکھیں۔ کمپیوٹر سے تیار کردہ یہ واؤچر مدرسہ ریکارڈ کا حصہ ہے۔</p><div class="signatures"><div class="signature">والد / سرپرست کے دستخط</div><div class="signature">اکاؤنٹس آفس کے دستخط و مہر</div></div><footer class="footer"><span>${escapeHtml(profile?.website || profile?.email || "")}</span><span>جاری کردہ: <b dir="ltr">${new Intl.DateTimeFormat("en-CA").format(new Date())}</b></span></footer></div></main></body></html>`;
}
