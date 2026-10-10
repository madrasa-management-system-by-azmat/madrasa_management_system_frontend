import apiClient from "@/lib/apiClient";

const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) =>
  apiClient.get(path, { params }).then(results);
const create = (path, data) =>
  apiClient.post(path, data).then((response) => response.data);

export const getMeetingDashboard = () =>
  apiClient.get("meetings/dashboard/").then((response) => response.data);
export const getMeetingTypes = () => list("meetings/types/");
export const createMeetingType = (data) => create("meetings/types/", data);
export const getMeetings = (params = {}) => list("meetings/records/", params);
export const getMeeting = (id) =>
  apiClient.get(`meetings/records/${id}/`).then((response) => response.data);
export const createMeeting = (data) => create("meetings/records/", data);
export const meetingAction = ({ id, action, data = {} }) =>
  apiClient
    .post(`meetings/records/${id}/${action}/`, data)
    .then((response) => response.data);
export const getMeetingPeople = () =>
  apiClient
    .get("meetings/records/people_lookup/")
    .then((response) => response.data);
export const createAgendaItem = (data) => create("meetings/agenda/", data);
export const createMeetingParticipant = (data) =>
  create("meetings/participants/", data);
export const markMeetingAttendance = ({ id, attendance_status, notes = "" }) =>
  apiClient
    .post(`meetings/participants/${id}/mark_attendance/`, {
      attendance_status,
      notes,
    })
    .then((response) => response.data);
export const createMeetingMinutes = (data) => create("meetings/minutes/", data);
export const createMeetingDecision = (data) =>
  create("meetings/decisions/", data);
export const getMeetingDecisions = (params = {}) =>
  list("meetings/decisions/", params);
export const createMeetingActionItem = (data) =>
  create("meetings/actions/", data);
export const getMeetingActionItems = (params = {}) =>
  list("meetings/actions/", params);
export const updateMeetingActionItem = ({ id, data }) =>
  apiClient
    .patch(`meetings/actions/${id}/`, data)
    .then((response) => response.data);
