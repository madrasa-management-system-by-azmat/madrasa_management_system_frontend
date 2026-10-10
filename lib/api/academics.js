import apiClient from "@/lib/apiClient";

function getResults(response) {
  return Array.isArray(response.data) ? response.data : response.data.results;
}

export async function getDepartments() {
  const response = await apiClient.get("departments/");
  return getResults(response);
}

export async function createDepartment(data) {
  const response = await apiClient.post("departments/", data);
  return response.data;
}

export async function updateDepartment(id, data) {
  const response = await apiClient.patch(`departments/${id}/`, data);
  return response.data;
}

export async function deleteDepartment(id) {
  await apiClient.delete(`departments/${id}/`);
}

export async function getAcademicClasses() {
  const response = await apiClient.get("classes/");
  return getResults(response);
}

export async function createAcademicClass(data) {
  const response = await apiClient.post("classes/", data);
  return response.data;
}

export async function updateAcademicClass(id, data) {
  const response = await apiClient.patch(`classes/${id}/`, data);
  return response.data;
}

export async function deleteAcademicClass(id) {
  await apiClient.delete(`classes/${id}/`);
}

export async function getHalaqas() {
  const response = await apiClient.get("halaqas/");
  return getResults(response);
}

export async function createHalaqa(data) {
  const response = await apiClient.post("halaqas/", data);
  return response.data;
}

export async function updateHalaqa(id, data) {
  const response = await apiClient.patch(`halaqas/${id}/`, data);
  return response.data;
}

export async function deleteHalaqa(id) {
  await apiClient.delete(`halaqas/${id}/`);
}

export async function getSubjects() {
  const response = await apiClient.get("academic/subjects/");
  return getResults(response);
}

export async function createSubject(data) {
  const response = await apiClient.post("academic/subjects/", data);
  return response.data;
}

export async function updateSubject(id, data) {
  const response = await apiClient.patch(`academic/subjects/${id}/`, data);
  return response.data;
}

export async function deleteSubject(id) {
  await apiClient.delete(`academic/subjects/${id}/`);
}

export async function getClassOfferings(params = {}) {
  return getResults(
    await apiClient.get("academic/class-offerings/", { params }),
  );
}
export async function createClassOffering(data) {
  return (await apiClient.post("academic/class-offerings/", data)).data;
}
export async function getClassOfferingProfile(id) {
  return (await apiClient.get(`academic/class-offerings/${id}/profile/`)).data;
}
export async function getCurriculumPlans(params = {}) {
  return getResults(
    await apiClient.get("academic/curriculum-plans/", { params }),
  );
}
export async function createCurriculumPlan(data) {
  return (await apiClient.post("academic/curriculum-plans/", data)).data;
}
export async function createCurriculumBook(data) {
  return (await apiClient.post("academic/curriculum-books/", data)).data;
}
export async function createCurriculumUnit(data) {
  return (await apiClient.post("academic/curriculum-units/", data)).data;
}
export async function updateCurriculumUnit({ id, data }) {
  return (await apiClient.patch(`academic/curriculum-units/${id}/`, data)).data;
}
export async function getTimetablePeriods(params = {}) {
  return getResults(
    await apiClient.get("academic/timetable-periods/", { params }),
  );
}
export async function createTimetablePeriod(data) {
  return (await apiClient.post("academic/timetable-periods/", data)).data;
}
export async function getTimetableEntries(params = {}) {
  return getResults(
    await apiClient.get("academic/timetable-entries/", { params }),
  );
}
export async function createTimetableEntry(data) {
  return (await apiClient.post("academic/timetable-entries/", data)).data;
}
export async function generateTimetable(data) {
  return (await apiClient.post("academic/timetable-entries/generate/", data))
    .data;
}
export async function getTimetableConflicts(params = {}) {
  return (
    await apiClient.get("academic/timetable-entries/conflicts/", { params })
  ).data;
}
export async function getDailyLessons(params = {}) {
  return getResults(await apiClient.get("academic/daily-lessons/", { params }));
}
export async function createDailyLesson(data) {
  return (await apiClient.post("academic/daily-lessons/", data)).data;
}
export async function addLessonAttention({ id, data }) {
  return (
    await apiClient.post(`academic/daily-lessons/${id}/add-attention/`, data)
  ).data;
}
