"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as fatwaApi from "@/lib/api/fatwas";

const keys = [
  "fatwa-dashboard",
  "fatwa-categories",
  "fatwa-tags",
  "fatwa-inquiries",
  "fatwa-inquiry",
  "fatwa-publications",
];
function useFatwaMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  });
}

export const useFatwaDashboard = () =>
  useQuery({
    queryKey: ["fatwa-dashboard"],
    queryFn: fatwaApi.getFatwaDashboard,
  });
export const useFatwaCategories = () =>
  useQuery({
    queryKey: ["fatwa-categories"],
    queryFn: fatwaApi.getFatwaCategories,
  });
export const useCreateFatwaCategory = () =>
  useFatwaMutation(fatwaApi.createFatwaCategory);
export const useFatwaTags = () =>
  useQuery({ queryKey: ["fatwa-tags"], queryFn: fatwaApi.getFatwaTags });
export const useCreateFatwaTag = () =>
  useFatwaMutation(fatwaApi.createFatwaTag);
export const useFatwaInquiries = (params = {}) =>
  useQuery({
    queryKey: ["fatwa-inquiries", params],
    queryFn: () => fatwaApi.getFatwaInquiries(params),
  });
export const useFatwaInquiry = (id) =>
  useQuery({
    queryKey: ["fatwa-inquiry", id],
    queryFn: () => fatwaApi.getFatwaInquiry(id),
    enabled: Boolean(id),
  });
export const useCreateFatwaInquiry = () =>
  useFatwaMutation(fatwaApi.createFatwaInquiry);
export const useUpdateFatwaInquiry = () =>
  useFatwaMutation(fatwaApi.updateFatwaInquiry);
export const useFatwaAssignees = () =>
  useQuery({
    queryKey: ["fatwa-assignees"],
    queryFn: fatwaApi.getFatwaAssignees,
  });
export const useFatwaAction = () => useFatwaMutation(fatwaApi.fatwaAction);
export const useCreateFatwaRevision = () =>
  useFatwaMutation(fatwaApi.createFatwaRevision);
export const useCreateFatwaReference = () =>
  useFatwaMutation(fatwaApi.createFatwaReference);
export const useFatwaPublications = (params = {}) =>
  useQuery({
    queryKey: ["fatwa-publications", params],
    queryFn: () => fatwaApi.getFatwaPublications(params),
  });
