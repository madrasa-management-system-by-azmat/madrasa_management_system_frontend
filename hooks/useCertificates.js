"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/certificates";
function useCertificateMutation(fn) {
  const c = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      c.invalidateQueries({ queryKey: ["certificates"] });
      c.invalidateQueries({ queryKey: ["certificate-dashboard"] });
    },
  });
}
export const useCertificateDashboard = () =>
  useQuery({
    queryKey: ["certificate-dashboard"],
    queryFn: api.getCertificateDashboard,
  });
export const useCertificates = (search = "") =>
  useQuery({
    queryKey: ["certificates", search],
    queryFn: () => api.getCertificates(search),
    enabled: Boolean(search.trim()),
  });
export const useCreateCertificate = () =>
  useCertificateMutation(api.createCertificate);
export const useCertificateAction = () =>
  useCertificateMutation(api.certificateAction);
export const usePublicCertificate = (id) =>
  useQuery({
    queryKey: ["public-certificate", id],
    queryFn: () => api.verifyPublicCertificate(id),
    enabled: Boolean(id),
    retry: false,
  });
