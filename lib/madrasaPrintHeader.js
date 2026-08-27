import { getMediaUrl } from "@/lib/apiClient";

export function escapePrintHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getMadrasaPrintHeaderHtml(
  profile,
  { title = "", subtitle = "", meta = "" } = {},
) {
  const name = profile?.name || "مدرسہ";
  const logo = profile?.logo ? getMediaUrl(profile.logo) : "";
  const details = [
    profile?.address,
    profile?.city,
    profile?.phone,
    profile?.email,
  ]
    .filter(Boolean)
    .join(" · ");

  return `<header class="madrasa-print-header">${logo ? `<img class="madrasa-print-logo" src="${escapePrintHtml(logo)}" alt="${escapePrintHtml(name)}" />` : ""}<div class="madrasa-print-brand"><h1>${escapePrintHtml(name)}</h1>${profile?.name_english ? `<p class="madrasa-print-english" dir="ltr">${escapePrintHtml(profile.name_english)}</p>` : ""}${details ? `<p class="madrasa-print-details">${escapePrintHtml(details)}</p>` : ""}${title ? `<h2>${escapePrintHtml(title)}</h2>` : ""}${subtitle ? `<p class="madrasa-print-subtitle">${escapePrintHtml(subtitle)}</p>` : ""}</div>${meta ? `<div class="madrasa-print-meta">${meta}</div>` : ""}</header>`;
}

export const madrasaPrintHeaderCss = `.madrasa-print-header{position:relative;display:flex;align-items:center;justify-content:center;min-height:70px;gap:12px;border-bottom:1px solid #111;padding:0 0 12px}.madrasa-print-logo{position:absolute;right:0;width:58px;height:58px;object-fit:contain}.madrasa-print-brand{text-align:center}.madrasa-print-brand h1{margin:0;font-size:22px;font-weight:800}.madrasa-print-brand h2{margin:6px 0 0;font-size:17px}.madrasa-print-brand p{margin:3px 0 0;font-size:11px}.madrasa-print-english{font-size:10px!important}.madrasa-print-details{color:#444}.madrasa-print-subtitle{font-size:13px!important}.madrasa-print-meta{position:absolute;left:0;text-align:left;font-size:11px;direction:ltr}`;
