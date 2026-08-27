"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudent,
  getStudentOverview,
  getStudents,
  updateStudent,
} from "@/lib/api/students";

export function useStudents({
  page = 1,
  search = "",
  status = "all",
  currentClass = "",
} = {}) {
  return useQuery({
    queryKey: ["students", { page, search, status, currentClass }],
    queryFn: () =>
      getStudents({
        page,
        ...(search ? { search } : {}),
        ...(status !== "all" ? { status } : {}),
        ...(currentClass ? { current_class: currentClass } : {}),
      }),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: Boolean(id),
  });
}

export function useAllStudents() {
  return useQuery({
    queryKey: ["students", "all"],
    queryFn: () => getAllStudents(),
  });
}

export function useStudentOverview(id) {
  return useQuery({
    queryKey: ["student-overview", id],
    queryFn: () => getStudentOverview(id),
    enabled: Boolean(id),
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => updateStudent(id, formData),
    onSuccess: (_data, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students"] }),
        queryClient.invalidateQueries({
          queryKey: ["student", String(variables.id)],
        }),
      ]),
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });
}
