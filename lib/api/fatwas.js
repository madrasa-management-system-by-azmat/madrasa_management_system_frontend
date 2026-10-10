import apiClient from "@/lib/apiClient";

const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) =>
  apiClient.get(path, { params }).then(results);
const create = (path, data) =>
  apiClient.post(path, data).then((response) => response.data);

export const getFatwaDashboard = () =>
  apiClient.get("fatwas/dashboard/").then((response) => response.data);
export const getFatwaCategories = () => list("fatwas/categories/");
export const createFatwaCategory = (data) => create("fatwas/categories/", data);
export const getFatwaTags = () => list("fatwas/tags/");
export const createFatwaTag = (data) => create("fatwas/tags/", data);
export const getFatwaInquiries = (params = {}) =>
  list("fatwas/inquiries/", params);
export const getFatwaInquiry = (id) =>
  apiClient.get(`fatwas/inquiries/${id}/`).then((response) => response.data);
export const createFatwaInquiry = (data) => create("fatwas/inquiries/", data);
export const updateFatwaInquiry = ({ id, data }) =>
  apiClient
    .patch(`fatwas/inquiries/${id}/`, data)
    .then((response) => response.data);
export const getFatwaAssignees = () =>
  apiClient
    .get("fatwas/inquiries/assignees/")
    .then((response) => response.data);
export const fatwaAction = ({ id, action, data = {} }) =>
  apiClient
    .post(`fatwas/inquiries/${id}/${action}/`, data)
    .then((response) => response.data);
export const createFatwaRevision = (data) => create("fatwas/revisions/", data);
export const createFatwaReference = (data) =>
  create("fatwas/references/", data);
export const getFatwaPublications = (params = {}) =>
  list("fatwas/publications/", params);
