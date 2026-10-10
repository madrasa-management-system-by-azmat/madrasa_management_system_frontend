"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
  getTeachingAssignments,
  createTeachingAssignment,
  getSyllabusPlans,
  createSyllabusPlan,
  addSyllabusProgress,
  getStaffContributions,
  createStaffContribution,
  getPerformanceReviews,
  createPerformanceReview,
  calculatePerformanceReview,
  approvePerformanceReview,
  getPerformanceGoals,
  createPerformanceGoal,
} from "@/lib/api/staff";

export function useTeachers() {
  return useQuery({ queryKey: ["teachers"], queryFn: getTeachers });
}

export function useTeacher(id) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacher(id),
    enabled: Boolean(id),
  });
}

function useTeacherMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useCreateTeacher() {
  return useTeacherMutation(createTeacher);
}
export function useUpdateTeacher() {
  return useTeacherMutation(({ id, data }) => updateTeacher(id, data));
}
export function useDeleteTeacher() {
  return useTeacherMutation(deleteTeacher);
}

function usePerformanceMutation(mutationFn, keys) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all(
        keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      ),
  });
}

export function useTeachingAssignments(params = {}) {
  return useQuery({
    queryKey: ["teaching-assignments", params],
    queryFn: () => getTeachingAssignments(params),
  });
}
export function useCreateTeachingAssignment() {
  return usePerformanceMutation(createTeachingAssignment, [
    "teaching-assignments",
  ]);
}
export function useSyllabusPlans(params = {}) {
  return useQuery({
    queryKey: ["syllabus-plans", params],
    queryFn: () => getSyllabusPlans(params),
  });
}
export function useCreateSyllabusPlan() {
  return usePerformanceMutation(createSyllabusPlan, ["syllabus-plans"]);
}
export function useAddSyllabusProgress() {
  return usePerformanceMutation(addSyllabusProgress, ["syllabus-plans"]);
}
export function useStaffContributions(params = {}) {
  return useQuery({
    queryKey: ["staff-contributions", params],
    queryFn: () => getStaffContributions(params),
  });
}
export function useCreateStaffContribution() {
  return usePerformanceMutation(createStaffContribution, [
    "staff-contributions",
    "performance-reviews",
  ]);
}
export function usePerformanceReviews(params = {}) {
  return useQuery({
    queryKey: ["performance-reviews", params],
    queryFn: () => getPerformanceReviews(params),
  });
}
export function useCreatePerformanceReview() {
  return usePerformanceMutation(createPerformanceReview, [
    "performance-reviews",
  ]);
}
export function useCalculatePerformanceReview() {
  return usePerformanceMutation(calculatePerformanceReview, [
    "performance-reviews",
  ]);
}
export function useApprovePerformanceReview() {
  return usePerformanceMutation(approvePerformanceReview, [
    "performance-reviews",
  ]);
}
export function usePerformanceGoals(params = {}) {
  return useQuery({
    queryKey: ["performance-goals", params],
    queryFn: () => getPerformanceGoals(params),
  });
}
export function useCreatePerformanceGoal() {
  return usePerformanceMutation(createPerformanceGoal, [
    "performance-goals",
    "performance-reviews",
  ]);
}
