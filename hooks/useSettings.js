"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadTenantBackup,
  getMadrasaProfile,
  getBackupRuns,
  getBackupSchedule,
  downloadBackupRun,
  restoreBackupRun,
  restoreTenantBackup,
  runBackupNow,
  updateBackupSchedule,
  updateMadrasaProfile,
} from "@/lib/api/settings";

export function useMadrasaProfile(options = {}) {
  return useQuery({
    queryKey: ["madrasa-profile"],
    queryFn: getMadrasaProfile,
    ...options,
  });
}

export function useUpdateMadrasaProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMadrasaProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(["madrasa-profile"], profile);
      return queryClient.invalidateQueries({ queryKey: ["madrasa-profile"] });
    },
  });
}

export function useRestoreTenantBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreTenantBackup,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useBackupSchedule(options = {}) {
  return useQuery({
    queryKey: ["backup-schedule"],
    queryFn: getBackupSchedule,
    ...options,
  });
}

export function useBackupRuns(options = {}) {
  return useQuery({
    queryKey: ["backup-runs"],
    queryFn: getBackupRuns,
    refetchInterval: (query) =>
      query.state.data?.some((run) =>
        ["pending", "running"].includes(run.status),
      )
        ? 3000
        : false,
    ...options,
  });
}

function useBackupMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backup-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["backup-runs"] });
    },
  });
}

export const useUpdateBackupSchedule = () =>
  useBackupMutation(updateBackupSchedule);
export const useRunBackupNow = () => useBackupMutation(runBackupNow);
export const useDownloadBackupRun = () =>
  useMutation({ mutationFn: downloadBackupRun });
export const useRestoreBackupRun = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreBackupRun,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};

export { downloadTenantBackup };
