import axios from "axios";

import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "@/lib/authStorage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/";

export function getMediaUrl(path) {
  if (!path || /^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path, API_BASE_URL).toString();
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let refreshRequest;

apiClient.interceptors.request.use((config) => {
  const accessToken = getAuthSession()?.access;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes("auth/");

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    const session = getAuthSession();
    if (!session?.refresh) {
      clearAuthSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= axios.post(`${API_BASE_URL}auth/token/refresh/`, {
        refresh: session.refresh,
      });
      const { data } = await refreshRequest;
      const nextSession = {
        ...session,
        access: data.access,
        refresh: data.refresh || session.refresh,
      };

      saveAuthSession(nextSession);
      originalRequest.headers.Authorization = `Bearer ${nextSession.access}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = undefined;
    }
  },
);

export default apiClient;
