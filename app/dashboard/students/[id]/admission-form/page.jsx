import StudentAdmissionForm from "@/components/dashboard/students/StudentAdmissionForm";

export default async function StudentAdmissionFormPage({ params }) {
  const { id } = await params;
  return <StudentAdmissionForm studentId={id} />;
}
