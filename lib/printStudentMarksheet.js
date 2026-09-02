import { getMediaUrl } from "@/lib/apiClient";
import { getPrintThemeCss } from "@/lib/printTheme";

const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const resultLabel = (result) =>
  result === "pass" ? "پاس" : result === "fail" ? "فیل" : "زیرِ التوا";

export function getStudentMarksheetHtml(summary, student, profile) {
  const logoUrl = profile?.logo ? getMediaUrl(profile.logo) : "";
  const logo = logoUrl
    ? `<img class="brand-logo" src="${escapeHtml(logoUrl)}" alt="" />`
    : '<div class="brand-logo logo-fallback">م</div>';
  const watermark = logoUrl
    ? `<img class="watermark" src="${escapeHtml(logoUrl)}" alt="" />`
    : "";
  const contact = [profile?.address, profile?.city, profile?.phone]
    .filter(Boolean)
    .join(" · ");
  const rows = student.subjects
    .map(
      (subject, index) =>
        `<tr><td>${index + 1}</td><td>${escapeHtml(subject.subject_name)}</td><td dir="ltr">${escapeHtml(subject.total_marks)}</td><td dir="ltr">${escapeHtml(subject.passing_marks)}</td><td dir="ltr"><b>${escapeHtml(subject.marks)}</b></td><td><span class="subject-result ${subject.result}">${resultLabel(subject.result)}</span></td></tr>`,
    )
    .join("");
  const overallResult = resultLabel(student.result);
  const dense = student.subjects.length > 10 ? " dense" : "";

  return `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8" /><title>مارک شیٹ — ${escapeHtml(student.student_name)}</title><style>
    ${getPrintThemeCss(profile)}
    @page { size: A4 portrait; margin: 6mm; }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; }
    body { background: #fff; color: #17233b; font-family: Arial, "Noto Nastaliq Urdu", serif; }
    .sheet { position: relative; width: 100%; height: 285mm; overflow: hidden; border: .65mm solid #226ce0; border-radius: 2mm; background: linear-gradient(180deg,#fff 0%,#f8fbff 100%); padding: 7mm 8mm; box-shadow: inset 0 0 0 1.2mm #fff, inset 0 0 0 1.5mm rgba(34,108,224,.25); }
    .sheet:before,.sheet:after { content:""; position:absolute; width:58mm; height:58mm; border:7mm solid rgba(34,108,224,.045); border-radius:50%; }
    .sheet:before { top:-37mm; right:-32mm; } .sheet:after { bottom:-39mm; left:-33mm; }
    .watermark { position:absolute; z-index:0; top:53%; left:50%; width:82mm; height:82mm; transform:translate(-50%,-50%); object-fit:contain; opacity:.035; filter:grayscale(1); }
    .content { position:relative; z-index:1; height:100%; }
    .header { display:grid; grid-template-columns:22mm 1fr 22mm; align-items:center; min-height:27mm; border-bottom:.45mm double #226ce0; padding:0 2mm 3.5mm; }
    .brand-logo { display:grid; width:19mm; height:19mm; place-items:center; border:.35mm solid #d0a141; border-radius:50%; background:#fff; padding:1mm; object-fit:contain; color:#226ce0; font-size:8mm; font-weight:800; }
    .brand { text-align:center; }.brand h1{margin:0;color:#174783;font-size:7mm;line-height:1.2}.brand p{margin:.7mm 0 0;color:#64748b;font-size:2.3mm}.brand h2{display:inline-block;margin:2mm 0 0;border-radius:99px;background:#226ce0;padding:.8mm 5mm;color:#fff;font-size:3.5mm}.seal{display:grid;width:19mm;height:19mm;place-items:center;border:.4mm double #d0a141;border-radius:50%;color:#174783;text-align:center;font-size:2.2mm;font-weight:700}
    .student-info { display:grid; grid-template-columns:repeat(2,1fr); overflow:hidden; margin-top:4mm; border:.25mm solid #b8c7dc; border-radius:1.3mm; background:rgba(255,255,255,.82); }
    .field { min-height:11mm; border-bottom:.2mm solid #d5deea; padding:1.7mm 2.5mm; }.field:nth-child(odd){border-left:.2mm solid #d5deea}.field:nth-last-child(-n+2){border-bottom:0}.field small{display:block;color:#6b7b91;font-size:2.2mm}.field strong{display:block;margin-top:.5mm;color:#17233b;font-size:3mm}
    .section-title { display:flex; align-items:center; gap:2mm; margin:4mm 0 1.5mm; color:#174783; font-size:3.2mm; font-weight:800; }.section-title:after{content:"";height:.2mm;flex:1;background:linear-gradient(90deg,#b7c9e3,transparent)}
    table { width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:.25mm solid #b8c7dc; border-radius:1.3mm; background:rgba(255,255,255,.85); font-size:2.6mm; }
    th,td { border-bottom:.2mm solid #d5deea; border-left:.2mm solid #d5deea; padding:1.7mm 2.2mm; text-align:right; } th:last-child,td:last-child{border-left:0} tbody tr:last-child td{border-bottom:0} th{background:#226ce0;color:#fff;font-weight:700} tbody tr:nth-child(even) td{background:rgba(232,241,255,.55)} td:first-child,th:first-child{width:8mm;text-align:center}
    .subject-result { font-weight:700; }.subject-result.pass{color:#15803d}.subject-result.fail{color:#b91c1c}.subject-result.pending{color:#64748b}
    .summary { display:grid; grid-template-columns:repeat(4,1fr); gap:2mm; margin-top:4mm; }.card{border:.25mm solid #b8c7dc;border-radius:1.2mm;background:#edf4ff;padding:2.5mm 2mm;text-align:center;color:#607089;font-size:2.3mm}.card b{display:block;margin-top:.7mm;color:#174783;font-size:4mm}
    .conclusion { display:grid; grid-template-columns:1fr auto; align-items:center; margin-top:3mm; border-radius:1.3mm; background:${student.result === "pass" ? "#e8f7ee" : student.result === "fail" ? "#fff0f0" : "#f1f5f9"}; padding:2.5mm 4mm; color:${student.result === "pass" ? "#166534" : student.result === "fail" ? "#991b1b" : "#475569"}; }.conclusion span{font-size:2.6mm}.conclusion strong{font-size:4.3mm}
    .signatures { position:absolute; right:8mm; bottom:12mm; left:8mm; display:grid; grid-template-columns:repeat(3,1fr); gap:13mm; text-align:center; }.signatures div{border-top:.3mm solid #46566f;padding-top:1.7mm;color:#52637d;font-size:2.5mm}.note{position:absolute;right:0;bottom:5mm;left:0;color:#7a8799;text-align:center;font-size:2mm}
    .dense th,.dense td{padding:1.1mm 2mm;font-size:2.3mm}.dense .student-info{margin-top:3mm}.dense .field{min-height:9mm;padding:1.2mm 2mm}.dense .section-title{margin-top:3mm}.dense .summary{margin-top:3mm}.dense .card{padding:1.7mm}.dense .conclusion{margin-top:2mm;padding:1.8mm 3mm}
    body{color:var(--print-sidebar)}.sheet{border-color:var(--print-primary);background:linear-gradient(180deg,#fff,var(--print-primary-softer));box-shadow:inset 0 0 0 1.2mm #fff,inset 0 0 0 1.5mm var(--print-primary-border)}.sheet:before,.sheet:after{border-color:color-mix(in srgb,var(--print-primary) 4.5%,transparent)}.header{border-bottom-color:var(--print-primary)}.brand-logo{border-color:var(--print-accent);color:var(--print-primary)}.brand h1,.seal,.field strong,.section-title,.card b{color:var(--print-sidebar)}.brand p,.field small,.card{color:var(--print-sidebar-muted)}.brand h2,th{background:var(--print-primary)}.seal{border-color:var(--print-accent)}.section-title:after{background:linear-gradient(90deg,var(--print-primary-border),transparent)}tbody tr:nth-child(even) td,.card{background:var(--print-primary-soft)}.card{border-color:var(--print-primary-border)}
    @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  </style></head><body><main class="sheet${dense}">${watermark}<div class="content"><header class="header">${logo}<div class="brand"><h1>${escapeHtml(profile?.name || "مدرسہ")}</h1>${profile?.name_english ? `<p dir="ltr">${escapeHtml(profile.name_english)}</p>` : ""}${contact ? `<p>${escapeHtml(contact)}</p>` : ""}<h2>مارک شیٹ — ${escapeHtml(summary.exam_name)}</h2></div><div class="seal">نتیجہ<br>نامہ</div></header><section class="student-info"><div class="field"><small>طالب علم</small><strong>${escapeHtml(student.student_name)}</strong></div><div class="field"><small>رجسٹریشن نمبر</small><strong dir="ltr">${escapeHtml(student.registration_number)}</strong></div><div class="field"><small>جماعت</small><strong>${escapeHtml(student.class_name)}</strong></div><div class="field"><small>امتحان کی تاریخ</small><strong dir="ltr">${escapeHtml(summary.exam_date)}</strong></div></section><h3 class="section-title">مضامین وار کارکردگی</h3><table><thead><tr><th>#</th><th>مضمون</th><th>کل نمبر</th><th>پاسنگ نمبر</th><th>حاصل کردہ نمبر</th><th>نتیجہ</th></tr></thead><tbody>${rows}</tbody></table><section class="summary"><div class="card">کل نمبر<b dir="ltr">${student.total_marks}</b></div><div class="card">حاصل کردہ نمبر<b dir="ltr">${student.obtained_marks}</b></div><div class="card">فیصد<b dir="ltr">${student.percentage}%</b></div><div class="card">مجموعی پاسنگ نمبر<b dir="ltr">${student.passing_marks}</b></div></section><div class="conclusion"><span>مجموعی نتیجہ</span><strong>${overallResult}</strong></div><footer class="signatures"><div>کلاس انچارج کے دستخط</div><div>ناظمِ امتحانات کے دستخط</div><div>مہتمم / پرنسپل کے دستخط و مہر</div></footer><p class="note">یہ نتیجہ مدرسہ کے محفوظ امتحانی ریکارڈ سے کمپیوٹر کے ذریعے تیار کیا گیا ہے۔</p></div></main></body></html>`;
}
