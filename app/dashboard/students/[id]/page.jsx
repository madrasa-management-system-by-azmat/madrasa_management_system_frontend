import StudentDetails from "@/components/dashboard/students/StudentDetails";

export default async function StudentPage({ params }) {
  const { id } = await params;
  return <StudentDetails studentId={id} />;
}
