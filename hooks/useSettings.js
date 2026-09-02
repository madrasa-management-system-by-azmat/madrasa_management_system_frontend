"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadTenantBackup,
  getMadrasaProfile,
  restoreTenantBackup,
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

export { downloadTenantBackup };
