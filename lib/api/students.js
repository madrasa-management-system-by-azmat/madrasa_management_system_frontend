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
