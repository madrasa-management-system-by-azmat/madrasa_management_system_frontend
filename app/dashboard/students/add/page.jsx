import AddStudentHeader from "@/components/dashboard/students/AddStudentHeader";
import StudentForm from "@/components/dashboard/students/StudentForm";

export default function AddStudentPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <AddStudentHeader />
      <StudentForm />
    </div>
  );
}
