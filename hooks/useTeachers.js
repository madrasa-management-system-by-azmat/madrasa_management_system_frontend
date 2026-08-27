"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
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
