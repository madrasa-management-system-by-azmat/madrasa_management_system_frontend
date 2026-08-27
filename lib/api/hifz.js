import apiClient from "@/lib/apiClient";

function getPaginatedData(response) {
  return Array.isArray(response.data)
    ? {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      }
    : response.data;
}

export async function getHifzLogs(params = {}) {
  const response = await apiClient.get("hifz-daily-logs/", { params });
  return getPaginatedData(response);
}

export async function getAllHifzLogs(params = {}) {
  const firstPage = await getHifzLogs({ page: 1, ...params });
  const results = firstPage.results ?? [];
  const totalPages = Math.ceil((firstPage.count ?? results.length) / 20);

  if (totalPages <= 1) return results;

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getHifzLogs({ page: index + 2, ...params }),
    ),
  );

  return [...results, ...remainingPages.flatMap((page) => page.results ?? [])];
}

export async function createHifzLog(data) {
  const response = await apiClient.post("hifz-daily-logs/", data);
  return response.data;
}
export async function updateHifzLog(id, data) {
  const response = await apiClient.patch(`hifz-daily-logs/${id}/`, data);
  return response.data;
}
export async function deleteHifzLog(id) {
  await apiClient.delete(`hifz-daily-logs/${id}/`);
}
