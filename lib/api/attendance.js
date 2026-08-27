import apiClient from "@/lib/apiClient";

export async function getStudentAttendance({ date, academicClass }) {
  const response = await apiClient.get("student-attendance/", {
    params: { date, academic_class: academicClass },
  });
  return Array.isArray(response.data) ? response.data : response.data.results;
}

export async function saveStudentAttendance(records) {
  const response = await apiClient.post("student-attendance/bulk-save/", {
    records,
  });
  return response.data;
}

export async function getStudentAttendanceReport({
  academicClass,
  period,
  endDate,
}) {
  const response = await apiClient.get("student-attendance/report/", {
    params: { academic_class: academicClass, period, end_date: endDate },
  });
  return response.data;
}
