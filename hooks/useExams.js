"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as examsApi from "@/lib/api/exams";

function useExamQuery(key, queryFn) {
  return useQuery({ queryKey: [key], queryFn });
}
function useExamMutation(key, mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
}

export const useInternalExams = () =>
  useExamQuery("internal-exams", examsApi.getInternalExams);
export const useCreateInternalExam = () =>
  useExamMutation("internal-exams", examsApi.createInternalExam);
export const useUpdateInternalExam = () =>
  useExamMutation("internal-exams", ({ id, data }) =>
    examsApi.updateInternalExam(id, data),
  );
export const useDeleteInternalExam = () =>
  useExamMutation("internal-exams", examsApi.deleteInternalExam);
export const useInternalExamSummary = (id, academicClass) =>
  useQuery({
    queryKey: ["internal-exam-summary", id, academicClass],
    queryFn: () => examsApi.getInternalExamSummary(id, academicClass),
    enabled: Boolean(id && academicClass),
  });
export const useInternalExamResults = () =>
  useExamQuery("internal-exam-results", examsApi.getInternalExamResults);
export const useCreateInternalExamResult = () =>
  useExamMutation("internal-exam-results", examsApi.createInternalExamResult);
export const useUpdateInternalExamResult = () =>
  useExamMutation("internal-exam-results", ({ id, data }) =>
    examsApi.updateInternalExamResult(id, data),
  );
export const useDeleteInternalExamResult = () =>
  useExamMutation("internal-exam-results", examsApi.deleteInternalExamResult);
export const useWafaqRegistrations = () =>
  useExamQuery("wafaq-registrations", examsApi.getWafaqRegistrations);
export const useCreateWafaqRegistration = () =>
  useExamMutation("wafaq-registrations", examsApi.createWafaqRegistration);
export const useUpdateWafaqRegistration = () =>
  useExamMutation("wafaq-registrations", ({ id, data }) =>
    examsApi.updateWafaqRegistration(id, data),
  );
export const useDeleteWafaqRegistration = () =>
  useExamMutation("wafaq-registrations", examsApi.deleteWafaqRegistration);
export const useWafaqResults = () =>
  useExamQuery("wafaq-results", examsApi.getWafaqResults);
export const useCreateWafaqResult = () =>
  useExamMutation("wafaq-results", examsApi.createWafaqResult);
export const useUpdateWafaqResult = () =>
  useExamMutation("wafaq-results", ({ id, data }) =>
    examsApi.updateWafaqResult(id, data),
  );
export const useDeleteWafaqResult = () =>
  useExamMutation("wafaq-results", examsApi.deleteWafaqResult);
