"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAllStudents } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getStudentsListHtml } from "@/lib/printStudentAdmissionForm";
import { getApiErrorMessage, toast } from "@/lib/toast";
import { useStudentsFilters } from "@/context/StudentsFiltersContext";

const text = {
  error:
    "\u0637\u0644\u0628\u06C1 \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A \u067E\u0631\u0646\u0679 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u06CC\u06D4",
  loading:
    "\u0641\u06C1\u0631\u0633\u062A \u062A\u06CC\u0627\u0631 \u06C1\u0648 \u0631\u06C1\u06CC \u06C1\u06D2...",
  print:
    "\u0641\u06C1\u0631\u0633\u062A \u067E\u0631\u0646\u0679 \u06A9\u0631\u06CC\u06BA",
};

export default function PrintStudentsListButton() {
  const { filters } = useStudentsFilters();

  async function printStudentsList() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error(text.error, "براہ کرم browser میں popups کی اجازت دیں۔");
      return;
    }

    printWindow.document.write(
      `<title>${text.print}</title><p style="font-family: sans-serif; padding: 24px">${text.loading}</p>`,
    );

    try {
      const [students, profile] = await Promise.all([
        getAllStudents(filters),
        getMadrasaProfile(),
      ]);
      printWindow.document.open();
      printWindow.document.write(
        getStudentsListHtml(
          students,
          filters.currentClassName || "تمام طالب علم",
          profile,
        ),
      );
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 350);
    } catch (error) {
      printWindow.close();
      toast.error(text.error, getApiErrorMessage(error, text.error));
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
      onClick={printStudentsList}
    >
      <Printer aria-hidden="true" />
      {text.print}
    </Button>
  );
}
