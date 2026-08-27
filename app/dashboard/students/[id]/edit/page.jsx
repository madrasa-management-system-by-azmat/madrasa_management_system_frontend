import EditStudent from "@/components/dashboard/students/EditStudent";

export default async function EditStudentPage({ params }) {
  const { id } = await params;
  return <EditStudent studentId={id} />;
}
