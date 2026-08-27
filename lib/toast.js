"use client";

import { Toast } from "@base-ui/react/toast";

export const toastManager = Toast.createToastManager();

function addToast(type, title, description) {
  return toastManager.add({ type, title, description, priority: type === "error" ? "high" : "low" });
}

export const toast = {
  success: (title, description) => addToast("success", title, description),
  error: (title, description) => addToast("error", title, description),
  info: (title, description) => addToast("info", title, description),
  warning: (title, description) => addToast("warning", title, description),
};

export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) return data.non_field_errors[0];

  return Object.values(data).flat().find((value) => typeof value === "string") || fallback;
}
