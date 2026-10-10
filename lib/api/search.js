import apiClient from "@/lib/apiClient";

export async function globalSearch(query, signal) {
  const response = await apiClient.get("search/global/", {
    params: { q: query },
    signal,
  });
  return response.data;
}
