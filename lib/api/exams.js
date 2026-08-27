import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}
function create(path, data) {
  return apiClient.post(path, data).then((response) => response.data);
}
function update(path, id, data) {
  return apiClient
    .patch(`${path}${id}/`, data)
    .then((response) => response.data);
}
function remove(path, id) {
  return apiClient.delete(`${path}${id}/`);
}

export const getInternalExams = () =>
  apiClient.get("internal-exams/").then(getResults);
export const createInternalExam = (data) => create("internal-exams/", data);
export const updateInternalExam = (id, data) =>
  update("internal-exams/", id, data);
export const deleteInternalExam = (id) => remove("internal-exams/", id);
export const getInternalExamSummary = (id, academicClass) =>
  apiClient
    .get(`internal-exams/${id}/summary/`, {
      params: academicClass ? { academic_class: academicClass } : {},
    })
    .then((response) => response.data);
export const getInternalExamResults = () =>
  apiClient.get("internal-exam-results/").then(getResults);
export const createInternalExamResult = (data) =>
  create("internal-exam-results/", data);
export const updateInternalExamResult = (id, data) =>
  update("internal-exam-results/", id, data);
export const deleteInternalExamResult = (id) =>
  remove("internal-exam-results/", id);
export const getWafaqRegistrations = () =>
  apiClient.get("wafaq-registrations/").then(getResults);
export const createWafaqRegistration = (data) =>
  create("wafaq-registrations/", data);
export const updateWafaqRegistration = (id, data) =>
  update("wafaq-registrations/", id, data);
export const deleteWafaqRegistration = (id) =>
  remove("wafaq-registrations/", id);
export const getWafaqResults = () =>
  apiClient.get("wafaq-results/").then(getResults);
export const createWafaqResult = (data) => create("wafaq-results/", data);
export const updateWafaqResult = (id, data) =>
  update("wafaq-results/", id, data);
export const deleteWafaqResult = (id) => remove("wafaq-results/", id);
