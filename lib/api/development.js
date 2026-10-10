import apiClient from "@/lib/apiClient";
const results = (r) => (Array.isArray(r.data) ? r.data : r.data.results);
const list = (p) => apiClient.get(p).then(results);
const create = (p, d) => apiClient.post(p, d).then((r) => r.data);
export const getDevelopmentDashboard = () =>
  apiClient.get("development/dashboard/").then((r) => r.data);
export const getDisciplineCategories = () =>
  list("development/discipline-categories/");
export const createDisciplineCategory = (d) =>
  create("development/discipline-categories/", d);
export const getDisciplineIncidents = () => list("development/incidents/");
export const createDisciplineIncident = (d) =>
  create("development/incidents/", d);
export const incidentAction = ({ id, action, data = {} }) =>
  apiClient
    .post(`development/incidents/${id}/${action}/`, data)
    .then((r) => r.data);
export const createDisciplineAction = (d) =>
  create("development/discipline-actions/", d);
export const getTrainingPrograms = () => list("development/training-programs/");
export const createTrainingProgram = (d) =>
  create("development/training-programs/", d);
export const createTrainingEnrollment = (d) =>
  create("development/training-enrollments/", d);
export const completeTrainingEnrollment = ({ id, data }) =>
  apiClient
    .post(`development/training-enrollments/${id}/complete/`, data)
    .then((r) => r.data);
export const getRewardCategories = () => list("development/reward-categories/");
export const createRewardCategory = (d) =>
  create("development/reward-categories/", d);
export const getRewards = () => list("development/rewards/");
export const createReward = (d) => create("development/rewards/", d);
export const rewardAction = ({ id, action }) =>
  apiClient.post(`development/rewards/${id}/${action}/`).then((r) => r.data);
export const getAlumni = () => list("alumni/");
export const getAlumniEngagements = () =>
  list("development/alumni-engagements/");
export const createAlumniEngagement = (d) =>
  create("development/alumni-engagements/", d);
