import apiClient from "@/lib/apiClient";

export async function getMadrasaUsers() {
  const response = await apiClient.get("auth/madrasa-users/");
  return response.data;
}

export async function createMadrasaUser(data) {
  const response = await apiClient.post("auth/madrasa-users/", data);
  return response.data;
}

export async function updateMadrasaUser(id, data) {
  const response = await apiClient.patch(`auth/madrasa-users/${id}/`, data);
  return response.data;
}

export async function getMadrasas() {
  const response = await apiClient.get("auth/madrasas/");
  return response.data;
}

export async function createMadrasa(data) {
  const response = await apiClient.post("auth/madrasas/", data);
  return response.data;
}

export async function updateMadrasa(id, data) {
  const response = await apiClient.patch(`auth/madrasas/${id}/`, data);
  return response.data;
}

export async function resetMadrasaAdminPassword(id, password) {
  const response = await apiClient.post(`auth/madrasas/${id}/`, { password });
  return response.data;
}
