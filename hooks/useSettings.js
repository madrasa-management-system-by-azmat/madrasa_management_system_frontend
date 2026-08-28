"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadTenantBackup,
  getMadrasaProfile,
  restoreTenantBackup,
  updateMadrasaProfile,
} from "@/lib/api/settings";

export function useMadrasaProfile() {
  return useQuery({
    queryKey: ["madrasa-profile"],
    queryFn: getMadrasaProfile,
  });
}

export function useUpdateMadrasaProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMadrasaProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["madrasa-profile"] }),
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
