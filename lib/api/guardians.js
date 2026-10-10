import apiClient from "@/lib/apiClient";

const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) =>
  apiClient.get(path, { params }).then(results);
const create = (path, data) =>
  apiClient.post(path, data).then((response) => response.data);

export const getParentPortal = () =>
  apiClient.get("guardians/portal/").then((response) => response.data);
export const getGuardians = () => list("guardians/manage/");
export const createGuardian = (data) =>
  create("guardians/manage/create_guardian/", data);
export const inviteGuardian = (id) =>
  apiClient
    .post(`guardians/manage/${id}/invite/`)
    .then((response) => response.data);
export const suspendGuardian = (id) =>
  apiClient
    .post(`guardians/manage/${id}/suspend/`)
    .then((response) => response.data);
export const getGuardianInvitation = (token) =>
  apiClient
    .get(`guardians/activate/${token}/`)
    .then((response) => response.data);
export const activateGuardian = ({
  token,
  password,
  communication_consent = true,
}) =>
  apiClient
    .post(`guardians/activate/${token}/`, { password, communication_consent })
    .then((response) => response.data);
export const getParentMeetingSlots = () => list("guardians/meeting-slots/");
export const createParentMeetingSlot = (data) =>
  create("guardians/meeting-slots/", data);
export const getParentMeetingBookings = () =>
  list("guardians/meeting-bookings/");
export const createParentMeetingBooking = (data) =>
  create("guardians/meeting-bookings/", data);
export const completeParentMeetingBooking = ({ id, data }) =>
  apiClient
    .post(`guardians/meeting-bookings/${id}/complete/`, data)
    .then((response) => response.data);
export const getGuardianAnnouncements = () => list("guardians/announcements/");
export const createGuardianAnnouncement = (data) =>
  create("guardians/announcements/", data);
export const markGuardianAnnouncementRead = (id) =>
  apiClient
    .post(`guardians/announcements/${id}/mark_read/`)
    .then((response) => response.data);
export const getGuardianLeaveTypes = () => list("leaves/types/");
export const getGuardianLeaveRequests = () => list("leaves/requests/");
export const createGuardianLeaveRequest = (data) =>
  create("leaves/requests/", data);
export const submitGuardianLeaveRequest = (id) =>
  apiClient
    .post(`leaves/requests/${id}/submit/`)
    .then((response) => response.data);
