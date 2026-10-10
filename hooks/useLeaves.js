"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/leaves";
const keys = [
  "leave-dashboard",
  "leave-types",
  "leave-requests",
  "leave-balances",
  "leave-calendar",
];
function useLeaveMutation(fn) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () =>
      keys.forEach((key) => client.invalidateQueries({ queryKey: [key] })),
  });
}
export const useLeaveDashboard = () =>
  useQuery({ queryKey: ["leave-dashboard"], queryFn: api.getLeaveDashboard });
export const useLeaveTypes = () =>
  useQuery({ queryKey: ["leave-types"], queryFn: api.getLeaveTypes });
export const useCreateLeaveType = () => useLeaveMutation(api.createLeaveType);
export const useLeaveRequests = (params = {}) =>
  useQuery({
    queryKey: ["leave-requests", params],
    queryFn: () => api.getLeaveRequests(params),
  });
export const useCreateLeaveRequest = () =>
  useLeaveMutation(api.createLeaveRequest);
export const useLeaveAction = () => useLeaveMutation(api.leaveAction);
export const useLeavePeople = () =>
  useQuery({ queryKey: ["leave-people"], queryFn: api.getLeavePeople });
export const useLeaveBalances = () =>
  useQuery({ queryKey: ["leave-balances"], queryFn: api.getLeaveBalances });
export const useCreateLeaveBalance = () =>
  useLeaveMutation(api.createLeaveBalance);
export const useLeaveCalendar = () =>
  useQuery({ queryKey: ["leave-calendar"], queryFn: api.getLeaveCalendar });
export const useCreateLeaveCalendarDay = () =>
  useLeaveMutation(api.createLeaveCalendarDay);
