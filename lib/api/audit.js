import apiClient from "@/lib/apiClient";
const data = (response) => response.data;
const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
export const getAuditDashboard = () =>
  apiClient.get("audit/dashboard/").then(data);
export const getAuditEvents = (params = {}) =>
  apiClient.get("audit/events/", { params }).then(results);
export const verifyAuditChain = () =>
  apiClient.get("audit/events/verify_chain/").then(data);
export const getArchivePolicies = () =>
  apiClient.get("audit/archive-policies/").then(results);
export const createArchivePolicy = (payload) =>
  apiClient.post("audit/archive-policies/", payload).then(data);
export const getArchiveBatches = () =>
  apiClient.get("audit/archive-batches/").then(results);
export const createArchiveBatch = (payload) =>
  apiClient.post("audit/archive-batches/create_batch/", payload).then(data);
export const restoreArchiveBatch = (id) =>
  apiClient.post(`audit/archive-batches/${id}/restore/`).then(data);
export const getLegalHolds = () =>
  apiClient.get("audit/legal-holds/").then(results);
export const createLegalHold = (payload) =>
  apiClient.post("audit/legal-holds/", payload).then(data);
export const releaseLegalHold = (id) =>
  apiClient.post(`audit/legal-holds/${id}/release/`).then(data);
