"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAcademicClass,
  createDepartment,
  createHalaqa,
  createSubject,
  deleteAcademicClass,
  deleteDepartment,
  deleteHalaqa,
  deleteSubject,
  getAcademicClasses,
  getDepartments,
  getHalaqas,
  getSubjects,
  updateAcademicClass,
  updateDepartment,
  updateHalaqa,
  updateSubject,
  getClassOfferings,
  createClassOffering,
  getClassOfferingProfile,
  getCurriculumPlans,
  createCurriculumPlan,
  createCurriculumBook,
  createCurriculumUnit,
  updateCurriculumUnit,
  getTimetablePeriods,
  createTimetablePeriod,
  getTimetableEntries,
  createTimetableEntry,
  generateTimetable,
  getTimetableConflicts,
  getDailyLessons,
  createDailyLesson,
  addLessonAttention,
} from "@/lib/api/academics";

export function useDepartments() {
  return useQuery({ queryKey: ["departments"], queryFn: getDepartments });
}

export function useAcademicClasses() {
  return useQuery({
    queryKey: ["academic-classes"],
    queryFn: getAcademicClasses,
  });
}

export function useHalaqas() {
  return useQuery({ queryKey: ["halaqas"], queryFn: getHalaqas });
}

export function useSubjects() {
  return useQuery({ queryKey: ["subjects"], queryFn: getSubjects });
}

export function useCreateSubject() {
  return useAcademicMutation(createSubject, ["subjects"]);
}

export function useUpdateSubject() {
  return useAcademicMutation(
    ({ id, data }) => updateSubject(id, data),
    ["subjects"],
  );
}

export function useDeleteSubject() {
  return useAcademicMutation(deleteSubject, ["subjects"]);
}

function useAcademicMutation(mutationFn, queryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: ["students"] }),
      ]);
    },
  });
}

export function useCreateDepartment() {
  return useAcademicMutation(createDepartment, ["departments"]);
}

export function useCreateAcademicClass() {
  return useAcademicMutation(createAcademicClass, ["academic-classes"]);
}

export function useCreateHalaqa() {
  return useAcademicMutation(createHalaqa, ["halaqas"]);
}

export function useUpdateDepartment() {
  return useAcademicMutation(
    ({ id, data }) => updateDepartment(id, data),
    ["departments"],
  );
}

export function useDeleteDepartment() {
  return useAcademicMutation(deleteDepartment, ["departments"]);
}

export function useUpdateAcademicClass() {
  return useAcademicMutation(
    ({ id, data }) => updateAcademicClass(id, data),
    ["academic-classes"],
  );
}

export function useDeleteAcademicClass() {
  return useAcademicMutation(deleteAcademicClass, ["academic-classes"]);
}

export function useUpdateHalaqa() {
  return useAcademicMutation(
    ({ id, data }) => updateHalaqa(id, data),
    ["halaqas"],
  );
}

export function useDeleteHalaqa() {
  return useAcademicMutation(deleteHalaqa, ["halaqas"]);
}

function useWorkflowMutation(mutationFn, keys) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all(
        keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      ),
  });
}
export function useClassOfferings(params = {}) {
  return useQuery({
    queryKey: ["class-offerings", params],
    queryFn: () => getClassOfferings(params),
  });
}
export function useCreateClassOffering() {
  return useWorkflowMutation(createClassOffering, ["class-offerings"]);
}
export function useClassOfferingProfile(id) {
  return useQuery({
    queryKey: ["class-offering-profile", id],
    queryFn: () => getClassOfferingProfile(id),
    enabled: Boolean(id),
  });
}
export function useCurriculumPlans(params = {}) {
  return useQuery({
    queryKey: ["curriculum-plans", params],
    queryFn: () => getCurriculumPlans(params),
  });
}
export function useCreateCurriculumPlan() {
  return useWorkflowMutation(createCurriculumPlan, [
    "curriculum-plans",
    "class-offering-profile",
  ]);
}
export function useCreateCurriculumBook() {
  return useWorkflowMutation(createCurriculumBook, ["curriculum-plans"]);
}
export function useCreateCurriculumUnit() {
  return useWorkflowMutation(createCurriculumUnit, [
    "curriculum-plans",
    "class-offering-profile",
  ]);
}
export function useUpdateCurriculumUnit() {
  return useWorkflowMutation(updateCurriculumUnit, [
    "curriculum-plans",
    "class-offering-profile",
  ]);
}
export function useTimetablePeriods(params = {}) {
  return useQuery({
    queryKey: ["timetable-periods", params],
    queryFn: () => getTimetablePeriods(params),
  });
}
export function useCreateTimetablePeriod() {
  return useWorkflowMutation(createTimetablePeriod, ["timetable-periods"]);
}
export function useTimetableEntries(params = {}) {
  return useQuery({
    queryKey: ["timetable-entries", params],
    queryFn: () => getTimetableEntries(params),
  });
}
export function useCreateTimetableEntry() {
  return useWorkflowMutation(createTimetableEntry, [
    "timetable-entries",
    "class-offering-profile",
  ]);
}
export function useGenerateTimetable() {
  return useWorkflowMutation(generateTimetable, [
    "timetable-entries",
    "class-offering-profile",
  ]);
}
export function useTimetableConflicts(params = {}) {
  return useQuery({
    queryKey: ["timetable-conflicts", params],
    queryFn: () => getTimetableConflicts(params),
  });
}
export function useDailyLessons(params = {}) {
  return useQuery({
    queryKey: ["daily-lessons", params],
    queryFn: () => getDailyLessons(params),
  });
}
export function useCreateDailyLesson() {
  return useWorkflowMutation(createDailyLesson, [
    "daily-lessons",
    "class-offering-profile",
  ]);
}
export function useAddLessonAttention() {
  return useWorkflowMutation(addLessonAttention, ["daily-lessons"]);
}
