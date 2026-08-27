import TeacherDetails from "@/components/dashboard/teachers/TeacherDetails";

export default async function TeacherDetailsPage({ params }) {
  const { id } = await params;
  return <TeacherDetails teacherId={id} />;
}
