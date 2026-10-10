import apiClient from "@/lib/apiClient";

const results = (response) => Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) => apiClient.get(path, { params }).then(results);
const create = (path, data) => apiClient.post(path, data).then((response) => response.data);

export const getDocumentDashboard = () => apiClient.get("documents/dashboard/").then((response) => response.data);
export const getDocumentCategories = () => list("documents/categories/");
export const createDocumentCategory = (data) => create("documents/categories/", data);
export const getDocumentFolders = () => list("documents/folders/");
export const createDocumentFolder = (data) => create("documents/folders/", data);
export const getDocuments = (params = {}) => list("documents/records/", params);
export const getDocument = (id) => apiClient.get(`documents/records/${id}/`).then((response) => response.data);
export const createDocument = (data) => create("documents/records/", data);
export const updateDocument = ({ id, data }) => apiClient.patch(`documents/records/${id}/`, data).then((response) => response.data);
export const documentAction = ({ id, action, data = {} }) => apiClient.post(`documents/records/${id}/${action}/`, data).then((response) => response.data);
export const getDocumentPeople = () => apiClient.get("documents/records/people_lookup/").then((response) => response.data);
export const uploadDocumentVersion = ({ document, file, change_summary }) => { const data = new FormData(); data.append("document", document); data.append("file", file); data.append("change_summary", change_summary || ""); return apiClient.post("documents/versions/upload/", data).then((response) => response.data); };
export const downloadDocumentVersion = (version) => apiClient.get(`documents/versions/${version.id}/download/`, { responseType: "blob" }).then((response) => { const url = URL.createObjectURL(response.data); const link = window.document.createElement("a"); link.href = url; link.download = version.original_name; link.click(); URL.revokeObjectURL(url); });
export const createDocumentGrant = (data) => create("documents/access/", data);
export const createDocumentComment = (data) => create("documents/comments/", data);
