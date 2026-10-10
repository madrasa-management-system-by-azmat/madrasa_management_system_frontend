import apiClient from "@/lib/apiClient";

function getPaginatedData(response) {
  if (Array.isArray(response.data)) {
    return {
      count: response.data.length,
      next: null,
      previous: null,
      results: response.data,
    };
  }

  return response.data;
}

export async function getStudents(params = {}) {
  const response = await apiClient.get("students/", { params });
  return getPaginatedData(response);
}

export async function getAllStudents(filters = {}) {
  const { search, status, currentClass } = filters;
  const params = {
    ...(search ? { search } : {}),
    ...(status && status !== "all" ? { status } : {}),
    ...(currentClass ? { current_class: currentClass } : {}),
  };
  const firstPage = await getStudents({ page: 1, ...params });
  const results = firstPage.results ?? [];
  const totalPages = Math.ceil((firstPage.count ?? results.length) / 20);

  if (totalPages <= 1) return results;

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getStudents({ page: index + 2, ...params }),
    ),
  );

  return [...results, ...remainingPages.flatMap((page) => page.results ?? [])];
}

export async function createStudent(formData) {
  const response = await apiClient.post("students/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function getStudent(id) {
  const response = await apiClient.get(`students/${id}/`);
  return response.data;
}

export async function getStudentOverview(id) {
  const response = await apiClient.get(`students/${id}/overview/`);
  return response.data;
}

export async function updateStudent(id, formData) {
  const response = await apiClient.patch(`students/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function deleteStudent(id) {
  await apiClient.delete(`students/${id}/`);
}

export async function getAdmissionApplications(params = {}) {
  const response = await apiClient.get("admission-applications/", { params });
  return getPaginatedData(response);
}

export async function createAdmissionApplication(data) {
  const response = await apiClient.post("admission-applications/", data);
  return response.data;
}

export async function deleteAdmissionApplication(id) {
  await apiClient.delete(`admission-applications/${id}/`);
}

export async function scheduleAdmissionInterview({ id, data }) {
  const response = await apiClient.post(
    `admission-applications/${id}/schedule-interview/`,
    data,
  );
  return response.data;
}

export async function recordAdmissionTest({ id, data }) {
  const response = await apiClient.post(
    `admission-applications/${id}/record-test/`,
    data,
  );
  return response.data;
}

export async function decideAdmission({ id, data }) {
  const response = await apiClient.post(
    `admission-applications/${id}/decide/`,
    data,
  );
  return response.data;
}

export async function admitApplicant({ id, admission_date }) {
  const response = await apiClient.post(`admission-applications/${id}/admit/`, {
    admission_date,
  });
  return response.data;
}

export async function transitionStudent({ id, data }) {
  const response = await apiClient.post(`students/${id}/transition/`, data);
  return response.data;
}

export async function getAcademicYears() {
  const response = await apiClient.get("academic-years/");
  return getPaginatedData(response);
}

export async function createAcademicYear(data) {
  const response = await apiClient.post("academic-years/", data);
  return response.data;
}

export async function updateAcademicYear({ id, data }) {
  const response = await apiClient.patch(`academic-years/${id}/`, data);
  return response.data;
}

export async function deleteAcademicYear(id) {
  await apiClient.delete(`academic-years/${id}/`);
}

export async function getStudentEnrollments(params = {}) {
  const response = await apiClient.get("student-enrollments/", { params });
  return getPaginatedData(response);
}

export async function generateRollNumbers(data) {
  const response = await apiClient.post(
    "student-enrollments/generate-roll-numbers/",
    data,
  );
  return response.data;
}

export async function changeRollNumber({ id, data }) {
  const response = await apiClient.post(
    `student-enrollments/${id}/change-roll-number/`,
    data,
  );
  return response.data;
}

export async function getRollNumberHistory(id) {
  const response = await apiClient.get(
    `student-enrollments/${id}/roll-number-history/`,
  );
  return response.data;
}
