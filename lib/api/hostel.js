import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}

function createResource(path, data) {
  return apiClient.post(path, data).then((response) => response.data);
}
function updateResource(path, id, data) {
  return apiClient
    .patch(`${path}${id}/`, data)
    .then((response) => response.data);
}
function deleteResource(path, id) {
  return apiClient.delete(`${path}${id}/`);
}

export const getHostelWings = () =>
  apiClient.get("hostel-wings/").then(getResults);
export const createHostelWing = (data) => createResource("hostel-wings/", data);
export const updateHostelWing = (id, data) =>
  updateResource("hostel-wings/", id, data);
export const deleteHostelWing = (id) => deleteResource("hostel-wings/", id);

export const getHostelRooms = () =>
  apiClient.get("hostel-rooms/").then(getResults);
export const createHostelRoom = (data) => createResource("hostel-rooms/", data);
export const updateHostelRoom = (id, data) =>
  updateResource("hostel-rooms/", id, data);
export const deleteHostelRoom = (id) => deleteResource("hostel-rooms/", id);

export const getHostelAllocations = () =>
  apiClient.get("hostel-allocations/").then(getResults);
export const createHostelAllocation = (data) =>
  createResource("hostel-allocations/", data);
export const updateHostelAllocation = (id, data) =>
  updateResource("hostel-allocations/", id, data);
export const deleteHostelAllocation = (id) =>
  deleteResource("hostel-allocations/", id);

export const getGatePasses = () =>
  apiClient.get("gate-passes/").then(getResults);
export const createGatePass = (data) => createResource("gate-passes/", data);
export const updateGatePass = (id, data) =>
  updateResource("gate-passes/", id, data);
export const deleteGatePass = (id) => deleteResource("gate-passes/", id);
