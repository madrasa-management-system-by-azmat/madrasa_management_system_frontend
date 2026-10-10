import apiClient from "@/lib/apiClient";

const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) =>
  apiClient.get(path, { params }).then(results);
const create = (path, data) =>
  apiClient.post(path, data).then((response) => response.data);

export const getTaskDashboard = () =>
  apiClient.get("tasks/dashboard/").then((response) => response.data);
export const getTaskCategories = () => list("tasks/categories/");
export const createTaskCategory = (data) => create("tasks/categories/", data);
export const getTaskProjects = () => list("tasks/projects/");
export const createTaskProject = (data) => create("tasks/projects/", data);
export const getAdministrativeTasks = (params = {}) =>
  list("tasks/records/", params);
export const getAdministrativeTask = (id) =>
  apiClient.get(`tasks/records/${id}/`).then((response) => response.data);
export const createAdministrativeTask = (data) =>
  create("tasks/records/", data);
export const updateAdministrativeTask = ({ id, data }) =>
  apiClient
    .patch(`tasks/records/${id}/`, data)
    .then((response) => response.data);
export const taskAction = ({ id, action, data = {} }) =>
  apiClient
    .post(`tasks/records/${id}/${action}/`, data)
    .then((response) => response.data);
export const getTaskPeople = () =>
  apiClient
    .get("tasks/records/people_lookup/")
    .then((response) => response.data);
export const createTaskChecklistItem = (data) =>
  create("tasks/checklist/", data);
export const updateTaskChecklistItem = ({ id, data }) =>
  apiClient
    .patch(`tasks/checklist/${id}/`, data)
    .then((response) => response.data);
export const createTaskDependency = (data) =>
  create("tasks/dependencies/", data);
export const createTaskComment = (data) => create("tasks/comments/", data);
export const createTaskRecurrence = (data) =>
  create("tasks/recurrences/", data);
export const generateRecurringTasks = () =>
  apiClient
    .post("tasks/records/generate_recurring/")
    .then((response) => response.data);
