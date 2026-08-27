"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getStudent } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getStudentAdmissionFormHtml } from "@/lib/printStudentAdmissionForm";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  error:
    "\u067E\u0631\u0646\u0679 \u067E\u06CC\u0634 \u0646\u0638\u0627\u0631\u06C1 \u062A\u06CC\u0627\u0631 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4",
  print:
    "\u062F\u0627\u062E\u0644\u06C1 \u0641\u0627\u0631\u0645 \u067E\u0631\u0646\u0679 \u06A9\u0631\u06CC\u06BA",
};

export default function PrintAdmissionButton({
  studentId,
  className,
  size,
  variant = "ghost",
}) {
  async function openPreview() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error(text.error, "براہ کرم browser میں popups کی اجازت دیں۔");
      return;
    }

    printWindow.document.write(
      "<title>داخلہ فارم</title><p style='font-family: sans-serif; padding: 24px'>پرنٹ فارم تیار ہو رہا ہے...</p>",
    );

    try {
      const [student, profile] = await Promise.all([
        getStudent(studentId),
        getMadrasaProfile(),
      ]);
      printWindow.document.open();
      printWindow.document.write(getStudentAdmissionFormHtml(student, profile));
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 450);
    } catch (error) {
      printWindow.close();
      toast.error(text.error, getApiErrorMessage(error, text.error));
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      aria-label={text.print}
      title={text.print}
      onClick={openPreview}
    >
      <Printer aria-hidden="true" />
      {variant !== "ghost" && text.print}
    </Button>
  );
}
