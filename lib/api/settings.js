import apiClient from "@/lib/apiClient";

export async function getMadrasaProfile() {
  const response = await apiClient.get("auth/madrasa-profile/");
  return response.data;
}

export async function updateMadrasaProfile(data) {
  const response = await apiClient.put("auth/madrasa-profile/", data);
  return response.data;
}

export async function downloadTenantBackup() {
  const response = await apiClient.get("auth/backup/", {
    responseType: "blob",
  });
  return response.data;
}

export async function restoreTenantBackup(backup) {
  const data = new FormData();
  data.set("backup", backup);
  const response = await apiClient.post("auth/backup/", data);
  return response.data;
}

const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;

export async function getBackupSchedule() {
  const response = await apiClient.get("backups/config/");
  return response.data;
}

export async function updateBackupSchedule(data) {
  const response = await apiClient.put("backups/config/", data);
  return response.data;
}

export async function getBackupRuns() {
  const response = await apiClient.get("backups/");
  return results(response);
}

export async function runBackupNow() {
  const response = await apiClient.post("backups/run_now/");
  return response.data;
}

export async function downloadBackupRun(id) {
  const response = await apiClient.get(`backups/${id}/download/`, {
    responseType: "blob",
  });
  return response.data;
}

export async function restoreBackupRun(id) {
  const response = await apiClient.post(`backups/${id}/restore/`);
  return response.data;
}
