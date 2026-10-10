import apiClient from "@/lib/apiClient";
const results = (response) =>
  Array.isArray(response.data) ? response.data : response.data.results;
const list = (path, params = {}) =>
  apiClient.get(path, { params }).then(results);
const create = (path, data) =>
  apiClient.post(path, data).then((response) => response.data);
export const getLeaveDashboard = () =>
  apiClient.get("leaves/dashboard/").then((r) => r.data);
export const getLeaveTypes = () => list("leaves/types/");
export const createLeaveType = (data) => create("leaves/types/", data);
export const getLeaveRequests = (params = {}) =>
  list("leaves/requests/", params);
export const createLeaveRequest = (data) => create("leaves/requests/", data);
export const leaveAction = ({ id, action, data = {} }) =>
  apiClient.post(`leaves/requests/${id}/${action}/`, data).then((r) => r.data);
export const getLeavePeople = () =>
  apiClient.get("leaves/requests/people_lookup/").then((r) => r.data);
export const getLeaveBalances = () => list("leaves/balances/");
export const createLeaveBalance = (data) => create("leaves/balances/", data);
export const getLeaveCalendar = () => list("leaves/calendar/");
export const createLeaveCalendarDay = (data) =>
  create("leaves/calendar/", data);
