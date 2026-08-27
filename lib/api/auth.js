import apiClient from "@/lib/apiClient";

export async function login({ identifier, password }) {
  const { data } = await apiClient.post("auth/login/", {
    identifier,
    password,
  });
  return data;
}

export async function logout(refresh) {
  await apiClient.post("auth/logout/", { refresh });
}

export async function getCurrentUser() {
  const { data } = await apiClient.get("auth/me/");
  return data;
}

export async function updateCurrentUser(data) {
  const response = await apiClient.patch("auth/me/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function changePassword(data) {
  const response = await apiClient.post("auth/change-password/", data);
  return response.data;
}
