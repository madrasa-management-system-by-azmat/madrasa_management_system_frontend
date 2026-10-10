"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentAttendance,
  getStudentAttendanceReport,
  saveStudentAttendance,
  getAttendanceAlerts,
  getAttendanceAlertRules,
  updateAttendanceAlertRules,
  refreshAttendanceAlerts,
  updateAttendanceAlertStatus,
} from "@/lib/api/attendance";

export function useStudentAttendance(date, academicClass) {
  return useQuery({
    queryKey: ["student-attendance", date, academicClass],
    queryFn: () => getStudentAttendance({ date, academicClass }),
    enabled: Boolean(date && academicClass),
  });
}

export function useSaveStudentAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveStudentAttendance,
    onSuccess: (_data, records) => {
      const first = records[0];
      if (first)
        queryClient.invalidateQueries({
          queryKey: ["student-attendance", first.date],
        });
    },
  });
}

export function useStudentAttendanceReport(
  academicClass,
  period,
  endDate,
  enabled,
) {
  return useQuery({
    queryKey: ["student-attendance-report", academicClass, period, endDate],
    queryFn: () =>
      getStudentAttendanceReport({ academicClass, period, endDate }),
    enabled: Boolean(enabled && academicClass && endDate),
  });
}

export function useAttendanceAlerts(params = {}) {
  return useQuery({
    queryKey: ["attendance-alerts", params],
    queryFn: () => getAttendanceAlerts(params),
  });
}

export function useAttendanceAlertRules() {
  return useQuery({
    queryKey: ["attendance-alert-rules"],
    queryFn: getAttendanceAlertRules,
  });
}

export function useUpdateAttendanceAlertRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendanceAlertRules,
    onSuccess: (data) =>
      queryClient.setQueryData(["attendance-alert-rules"], data),
  });
}

export function useRefreshAttendanceAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshAttendanceAlerts,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["attendance-alerts"] }),
  });
}

export function useUpdateAttendanceAlertStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendanceAlertStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["attendance-alerts"] }),
  });
}
