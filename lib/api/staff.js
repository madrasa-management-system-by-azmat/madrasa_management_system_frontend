import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}

export async function getTeachers() {
  const response = await apiClient.get("staff/", {
    params: { role: "teacher" },
  });
  return getResults(response);
}

export async function getTeacher(id) {
  const response = await apiClient.get(`staff/${id}/`);
  return response.data;
}

export async function createTeacher(data) {
  const response = await apiClient.post("staff/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateTeacher(id, data) {
  const response = await apiClient.patch(`staff/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteTeacher(id) {
  await apiClient.delete(`staff/${id}/`);
}

export async function getTeachingAssignments(params = {}) {
  return getResults(await apiClient.get("teaching-assignments/", { params }));
}
export async function createTeachingAssignment(data) {
  return (await apiClient.post("teaching-assignments/", data)).data;
}
export async function getSyllabusPlans(params = {}) {
  return getResults(await apiClient.get("syllabus-plans/", { params }));
}
export async function createSyllabusPlan(data) {
  return (await apiClient.post("syllabus-plans/", data)).data;
}
export async function addSyllabusProgress({ id, data }) {
  return (await apiClient.post(`syllabus-plans/${id}/add-progress/`, data))
    .data;
}
export async function getStaffContributions(params = {}) {
  return getResults(await apiClient.get("staff-contributions/", { params }));
}
export async function createStaffContribution(data) {
  return (await apiClient.post("staff-contributions/", data)).data;
}
export async function getPerformanceReviews(params = {}) {
  return getResults(await apiClient.get("performance-reviews/", { params }));
}
export async function createPerformanceReview(data) {
  return (await apiClient.post("performance-reviews/", data)).data;
}
export async function calculatePerformanceReview(id) {
  return (await apiClient.post(`performance-reviews/${id}/calculate/`)).data;
}
export async function approvePerformanceReview({ id, manager_comments }) {
  return (
    await apiClient.post(`performance-reviews/${id}/approve/`, {
      manager_comments,
    })
  ).data;
}
export async function getPerformanceGoals(params = {}) {
  return getResults(await apiClient.get("performance-goals/", { params }));
}
export async function createPerformanceGoal(data) {
  return (await apiClient.post("performance-goals/", data)).data;
}
