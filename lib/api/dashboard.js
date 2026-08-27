import apiClient from "@/lib/apiClient";

export async function getDashboardSummary() {
  const response = await apiClient.get("students/dashboard-summary/");
  return response.data;
}
