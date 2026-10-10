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

export async function getAttendanceAlerts(params = {}) {
  const response = await apiClient.get("attendance-alerts/", { params });
  return Array.isArray(response.data)
    ? { count: response.data.length, results: response.data }
    : response.data;
}

export async function getAttendanceAlertRules() {
  const response = await apiClient.get("student-attendance/alert-rules/");
  return response.data;
}

export async function updateAttendanceAlertRules(data) {
  const response = await apiClient.put("student-attendance/alert-rules/", data);
  return response.data;
}

export async function refreshAttendanceAlerts() {
  const response = await apiClient.post("student-attendance/refresh-alerts/");
  return response.data;
}

export async function updateAttendanceAlertStatus({ id, action, notes = "" }) {
  const response = await apiClient.post(`attendance-alerts/${id}/${action}/`, {
    notes,
  });
  return response.data;
}
