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
  getAdmissionApplications,
  createAdmissionApplication,
  deleteAdmissionApplication,
  scheduleAdmissionInterview,
  recordAdmissionTest,
  decideAdmission,
  admitApplicant,
  transitionStudent,
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  getStudentEnrollments,
  generateRollNumbers,
  changeRollNumber,
  getRollNumberHistory,
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

export function useAdmissionApplications(params = {}) {
  return useQuery({
    queryKey: ["admission-applications", params],
    queryFn: () => getAdmissionApplications(params),
  });
}

function lifecycleMutation(mutationFn, queryClient) {
  return {
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admission-applications"] }),
  };
}

export function useCreateAdmissionApplication() {
  const queryClient = useQueryClient();
  return useMutation(
    lifecycleMutation(createAdmissionApplication, queryClient),
  );
}

export function useDeleteAdmissionApplication() {
  const queryClient = useQueryClient();
  return useMutation(
    lifecycleMutation(deleteAdmissionApplication, queryClient),
  );
}

export function useScheduleAdmissionInterview() {
  const queryClient = useQueryClient();
  return useMutation(
    lifecycleMutation(scheduleAdmissionInterview, queryClient),
  );
}

export function useRecordAdmissionTest() {
  const queryClient = useQueryClient();
  return useMutation(lifecycleMutation(recordAdmissionTest, queryClient));
}

export function useDecideAdmission() {
  const queryClient = useQueryClient();
  return useMutation(lifecycleMutation(decideAdmission, queryClient));
}

export function useAdmitApplicant() {
  const queryClient = useQueryClient();
  return useMutation({
    ...lifecycleMutation(admitApplicant, queryClient),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admission-applications"] }),
        queryClient.invalidateQueries({ queryKey: ["students"] }),
      ]),
  });
}

export function useTransitionStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transitionStudent,
    onSuccess: (_data, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students"] }),
        queryClient.invalidateQueries({
          queryKey: ["student-overview", String(variables.id)],
        }),
      ]),
  });
}

export function useAcademicYears() {
  return useQuery({ queryKey: ["academic-years"], queryFn: getAcademicYears });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academic-years"] }),
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAcademicYear,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academic-years"] }),
  });
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAcademicYear,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academic-years"] }),
  });
}

export function useStudentEnrollments(params = {}) {
  return useQuery({
    queryKey: ["student-enrollments", params],
    queryFn: () => getStudentEnrollments(params),
  });
}

export function useGenerateRollNumbers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateRollNumbers,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["student-enrollments"] }),
  });
}

export function useChangeRollNumber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeRollNumber,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["student-enrollments"] }),
  });
}

export function useRollNumberHistory(id) {
  return useQuery({
    queryKey: ["roll-number-history", id],
    queryFn: () => getRollNumberHistory(id),
    enabled: Boolean(id),
  });
}
