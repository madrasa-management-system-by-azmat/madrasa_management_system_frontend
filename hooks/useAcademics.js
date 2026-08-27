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
