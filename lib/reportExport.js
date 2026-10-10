import {
  escapePrintHtml,
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";
import { getPrintThemeCss } from "@/lib/printTheme";

export function downloadReportCsv(report) {
  const headers = report.columns.map((column) => column.label);
  const values = report.rows.map((row) =>
    report.columns.map((column) => row[column.key] ?? ""),
  );
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[headers, ...values].map((row) => row.map(quote).join(",")).join("\r\n")}`;
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.report.key}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function printReport(report, profile) {
  const win = window.open("", "_blank");
  if (!win) return false;
  const headers = report.columns
    .map((column) => `<th>${escapePrintHtml(column.label)}</th>`)
    .join("");
  const rows = report.rows
    .map(
      (row) =>
        `<tr>${report.columns.map((column) => `<td>${escapePrintHtml(row[column.key] ?? "—")}</td>`).join("")}</tr>`,
    )
    .join("");
  const summary = report.summary
    .map(
      (item) =>
        `<div><small>${escapePrintHtml(item.label)}</small><strong>${escapePrintHtml(item.value)}</strong></div>`,
    )
    .join("");
  win.document.write(
    `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>${escapePrintHtml(report.report.title)}</title><style>${getPrintThemeCss(profile)}@page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0}.summary div{border:1px solid #aaa;padding:8px}.summary small,.summary strong{display:block}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #777;padding:7px;text-align:right}th{background:var(--print-primary-soft);color:var(--print-sidebar)}${madrasaPrintHeaderCss}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: report.report.title })}<section class="summary">${summary}</section><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></body></html>`,
  );
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 250);
  return true;
}
