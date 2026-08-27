import apiClient from "@/lib/apiClient";

export async function getMadrasaProfile() {
  const response = await apiClient.get("auth/madrasa-profile/");
  return response.data;
}

export async function updateMadrasaProfile(data) {
  const response = await apiClient.put("auth/madrasa-profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}