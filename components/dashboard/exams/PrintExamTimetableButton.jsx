"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMadrasaProfile } from "@/hooks/useSettings";
import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";

function groupPapers(exam) {
  const classes = exam.classes || [];
  const classNames = Object.fromEntries(
    (exam.papers || []).map((paper) => [
      paper.academic_class,
      paper.class_name,
    ]),
  );
  const orderedClasses = classes.length
    ? classes
    : Object.keys(classNames).map(Number);
  const groups = new Map();
  for (const paper of exam.papers || []) {
    const key = `${paper.paper_date}|${paper.paper_time || ""}`;
    if (!groups.has(key))
      groups.set(key, {
        date: paper.paper_date,
        time: paper.paper_time || "—",
        subjects: {},
      });
    const group = groups.get(key);
    group.subjects[paper.academic_class] ??= [];
    group.subjects[paper.academic_class].push(paper.subject_name);
  }
  return {
    classes: orderedClasses.map((id) => ({
      id,
      name:
        classNames[id] || exam.class_names?.[orderedClasses.indexOf(id)] || "—",
    })),
    groups: [...groups.values()].sort((a, b) =>
      `${a.date}|${a.time}`.localeCompare(`${b.date}|${b.time}`),
    ),
  };
}

export default function PrintExamTimetableButton({ exam }) {
  const { data: profile } = useMadrasaProfile();
  function printTimetable() {
    if (!exam) return;
    const { classes, groups } = groupPapers(exam);
    const header = classes.map((item) => `<th>${item.name}</th>`).join("");
    const rows = groups
      .map(
        (group) =>
          `<tr><td dir="ltr">${group.date}</td><td dir="ltr">${group.time}</td>${classes.map((item) => `<td>${(group.subjects[item.id] || []).join("، ") || "—"}</td>`).join("")}</tr>`,
      )
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>امتحانی ڈیٹ شیٹ</title><style>@page{size:A4 landscape;margin:10mm}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}${madrasaPrintHeaderCss}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #777;padding:9px;text-align:right;vertical-align:middle}th{background:#eee;white-space:nowrap}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: exam.name, subtitle: "امتحانی ڈیٹ شیٹ" })}<table><thead><tr><th>تاریخ</th><th>وقت</th>${header}</tr></thead><tbody>${rows || `<tr><td colspan="${classes.length + 2}" style="text-align:center">کوئی پرچہ موجود نہیں۔</td></tr>`}</tbody></table></body></html>`,
    );
    win.document.close();
    win.focus();
    window.setTimeout(() => win.print(), 350);
  }
  return (
    <Button variant="outline" onClick={printTimetable} disabled={!exam}>
      <Printer />
      ڈیٹ شیٹ پرنٹ کریں
    </Button>
  );
}
