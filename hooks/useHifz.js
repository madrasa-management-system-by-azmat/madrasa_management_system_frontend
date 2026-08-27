"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createHifzLog, deleteHifzLog, getHifzLogs, updateHifzLog } from "@/lib/api/hifz";
import { getTeachers } from "@/lib/api/staff";
import { getAllStudents } from "@/lib/api/students";

export function useHifzLogs(filters = {}) { return useQuery({ queryKey: ["hifz-logs", filters], queryFn: () => getHifzLogs(filters) }); }
export function useTeachers() { return useQuery({ queryKey: ["teachers"], queryFn: getTeachers }); }
export function useHifzStudents() { return useQuery({ queryKey: ["hifz-students"], queryFn: () => getAllStudents() }); }

function useHifzMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hifz-logs"] }) });
}

export function useCreateHifzLog() { return useHifzMutation(createHifzLog); }
export function useUpdateHifzLog() { return useHifzMutation(({ id, data }) => updateHifzLog(id, data)); }
export function useDeleteHifzLog() { return useHifzMutation(deleteHifzLog); }
