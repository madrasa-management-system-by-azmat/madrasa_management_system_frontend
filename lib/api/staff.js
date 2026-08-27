import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}

export async function getTeachers() {
  const response = await apiClient.get("staff/", {
    params: { role: "teacher" },
  });
  return getResults(response);
}

export async function getTeacher(id) {
  const response = await apiClient.get(`staff/${id}/`);
  return response.data;
}

export async function createTeacher(data) {
  const response = await apiClient.post("staff/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateTeacher(id, data) {
  const response = await apiClient.patch(`staff/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteTeacher(id) {
  await apiClient.delete(`staff/${id}/`);
}
