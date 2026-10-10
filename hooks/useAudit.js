"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/audit";
const keys = [
  "audit-dashboard",
  "audit-events",
  "archive-policies",
  "archive-batches",
  "legal-holds",
];
function useAuditMutation(mutationFn) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      keys.forEach((key) => client.invalidateQueries({ queryKey: [key] })),
  });
}
export const useAuditDashboard = (options = {}) =>
  useQuery({
    queryKey: ["audit-dashboard"],
    queryFn: api.getAuditDashboard,
    ...options,
  });
export const useAuditEvents = (params = {}) =>
  useQuery({
    queryKey: ["audit-events", params],
    queryFn: () => api.getAuditEvents(params),
  });
export const useVerifyAuditChain = () => useAuditMutation(api.verifyAuditChain);
export const useArchivePolicies = () =>
  useQuery({ queryKey: ["archive-policies"], queryFn: api.getArchivePolicies });
export const useCreateArchivePolicy = () =>
  useAuditMutation(api.createArchivePolicy);
export const useArchiveBatches = () =>
  useQuery({ queryKey: ["archive-batches"], queryFn: api.getArchiveBatches });
export const useCreateArchiveBatch = () =>
  useAuditMutation(api.createArchiveBatch);
export const useRestoreArchiveBatch = () =>
  useAuditMutation(api.restoreArchiveBatch);
export const useLegalHolds = () =>
  useQuery({ queryKey: ["legal-holds"], queryFn: api.getLegalHolds });
export const useCreateLegalHold = () => useAuditMutation(api.createLegalHold);
export const useReleaseLegalHold = () => useAuditMutation(api.releaseLegalHold);
