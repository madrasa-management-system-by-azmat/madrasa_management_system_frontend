import { getMediaUrl } from "@/lib/apiClient";
import { escapePrintHtml } from "@/lib/madrasaPrintHeader";

export function getAdmissionPrintHeaderHtml(
  profile,
  { recordNumber = "" } = {},
) {
  const name = profile?.name || "مدرسہ";
  const logo = profile?.logo ? getMediaUrl(profile.logo) : "";
  const details = [profile?.address, profile?.city, profile?.phone]
    .filter(Boolean)
    .join(" · ");

  return `<header class="admission-header">
    <div class="admission-header__side admission-header__record">
      <span>داخلہ نمبر</span>
      <strong dir="ltr">${escapePrintHtml(recordNumber) || "____________"}</strong>
    </div>
    <div class="admission-header__brand">
      <div class="admission-header__ornament"><i></i><b>◆</b><i></i></div>
      ${logo ? `<img class="admission-header__logo" src="${escapePrintHtml(logo)}" alt="${escapePrintHtml(name)}" />` : `<div class="admission-header__logo admission-header__fallback">م</div>`}
      <h1>${escapePrintHtml(name)}</h1>
      ${profile?.name_english ? `<p class="admission-header__english" dir="ltr">${escapePrintHtml(profile.name_english)}</p>` : ""}
      ${details ? `<p class="admission-header__details">${escapePrintHtml(details)}</p>` : ""}
      <div class="admission-header__title">طلبہ داخلہ فارم</div>
    </div>
    <div class="admission-header__side admission-header__photo">تصویر<br />چسپاں کریں</div>
  </header>`;
}

export const admissionPrintHeaderCss = `.admission-header{position:relative;display:grid;grid-template-columns:27mm 1fr 27mm;align-items:center;gap:4mm;min-height:36mm;overflow:hidden;border:1px solid var(--print-primary);border-radius:2mm;background:linear-gradient(135deg,var(--print-primary-softer),#fff 55%,var(--print-primary-soft));padding:3mm}.admission-header:before,.admission-header:after{content:"";position:absolute;width:28mm;height:28mm;border:2.5mm solid rgb(34 108 224 / .09);border-radius:50%}.admission-header:before{top:-18mm;right:-13mm}.admission-header:after{bottom:-19mm;left:-14mm}.admission-header__brand{position:relative;z-index:1;text-align:center}.admission-header__logo{width:14mm;height:14mm;border:.35mm solid var(--print-primary);border-radius:50%;background:#fff;padding:.8mm;object-fit:contain;box-shadow:0 .8mm 2mm rgb(34 108 224 / .14)}.admission-header__fallback{display:grid;margin:auto;place-items:center;color:var(--print-primary);font-size:7mm;font-weight:800}.admission-header h1{margin:.7mm 0 0;color:var(--print-sidebar);font-size:5.5mm;line-height:1.15}.admission-header p{margin:.25mm 0 0}.admission-header__english{color:#66758d;font-size:2mm}.admission-header__details{color:#53647d;font-size:2.1mm}.admission-header__title{display:inline-block;margin-top:1mm;border-radius:99px;background:var(--print-primary);padding:.7mm 4mm;color:#fff;font-size:2.6mm;font-weight:700}.admission-header__ornament{display:flex;align-items:center;justify-content:center;gap:2mm;margin-bottom:.7mm;color:var(--print-accent)}.admission-header__ornament i{width:13mm;height:.2mm;background:linear-gradient(90deg,transparent,var(--print-accent))}.admission-header__ornament i:last-child{transform:scaleX(-1)}.admission-header__ornament b{font-size:2.5mm}.admission-header__side{position:relative;z-index:1;display:grid;min-height:27mm;place-items:center;border:.25mm dashed var(--print-primary-border);border-radius:1mm;color:#53647d;text-align:center;font-size:2.2mm}.admission-header__record{align-content:center;gap:2mm;border-style:solid;background:rgb(255 255 255 / .7)}.admission-header__record span{color:#66758d}.admission-header__record strong{color:var(--print-sidebar);font-size:2.6mm}.admission-header__photo{background:rgb(255 255 255 / .7);line-height:1.7}`;
