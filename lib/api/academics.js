import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}

export async function getDepartments() {
  const response = await apiClient.get("departments/");
  return getResults(response);
}

export async function createDepartment(data) {
  const response = await apiClient.post("departments/", data);
  return response.data;
}

export async function updateDepartment(id, data) {
  const response = await apiClient.patch(`departments/${id}/`, data);
  return response.data;
}

export async function deleteDepartment(id) {
  await apiClient.delete(`departments/${id}/`);
}

export async function getAcademicClasses() {
  const response = await apiClient.get("classes/");
  return getResults(response);
}

export async function createAcademicClass(data) {
  const response = await apiClient.post("classes/", data);
  return response.data;
}

export async function updateAcademicClass(id, data) {
  const response = await apiClient.patch(`classes/${id}/`, data);
  return response.data;
}

export async function deleteAcademicClass(id) {
  await apiClient.delete(`classes/${id}/`);
}

export async function getHalaqas() {
  const response = await apiClient.get("halaqas/");
  return getResults(response);
}

export async function createHalaqa(data) {
  const response = await apiClient.post("halaqas/", data);
  return response.data;
}

export async function updateHalaqa(id, data) {
  const response = await apiClient.patch(`halaqas/${id}/`, data);
  return response.data;
}

export async function deleteHalaqa(id) {
  await apiClient.delete(`halaqas/${id}/`);
}

export async function getSubjects() {
  const response = await apiClient.get("academic/subjects/");
  return getResults(response);
}

export async function createSubject(data) {
  const response = await apiClient.post("academic/subjects/", data);
  return response.data;
}

export async function updateSubject(id, data) {
  const response = await apiClient.patch(`academic/subjects/${id}/`, data);
  return response.data;
}

export async function deleteSubject(id) {
  await apiClient.delete(`academic/subjects/${id}/`);
}
