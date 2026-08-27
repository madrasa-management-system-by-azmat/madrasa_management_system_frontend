import StudentsHeader from "@/components/dashboard/students/StudentsHeader";
import StudentsTable from "@/components/dashboard/students/StudentsTable";
import { StudentsFiltersProvider } from "@/context/StudentsFiltersContext";

export default function StudentsPage() {
  return (
    <StudentsFiltersProvider>
    <div className="space-y-6 lg:space-y-8">
      <StudentsHeader />
      <StudentsTable />
    </div>
    </StudentsFiltersProvider>
  );
}
