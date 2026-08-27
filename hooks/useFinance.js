"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as financeApi from "@/lib/api/finance";

export const useFinanceYearlyReport = (year, enabled = false) =>
  useQuery({
    queryKey: ["finance-yearly-report", year],
    queryFn: () => financeApi.getFinanceYearlyReport(year),
    enabled,
  });

function useFinanceQuery(key, queryFn) {
  return useQuery({ queryKey: [key], queryFn });
}
function useFinanceMutation(key, mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
}

export const useStudentFeeLogs = () =>
  useFinanceQuery("student-fee-logs", financeApi.getStudentFeeLogs);
export const useCreateStudentFeeLog = () =>
  useFinanceMutation("student-fee-logs", financeApi.createStudentFeeLog);
export const useUpdateStudentFeeLog = () =>
  useFinanceMutation("student-fee-logs", ({ id, data }) =>
    financeApi.updateStudentFeeLog(id, data),
  );
export const useDeleteStudentFeeLog = () =>
  useFinanceMutation("student-fee-logs", financeApi.deleteStudentFeeLog);

export const useMonthlyFees = (filters = {}) =>
  useQuery({
    queryKey: ["monthly-fees", filters],
    queryFn: () => financeApi.getMonthlyFees(filters),
  });
export const useGenerateMonthlyFees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.generateMonthlyFees,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["monthly-fees"] }),
  });
};
export const useCreateMonthlyFeePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => financeApi.createMonthlyFeePayment(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["monthly-fees"] }),
  });
};
export const useFinanceLedger = () =>
  useQuery({
    queryKey: ["finance-ledger"],
    queryFn: financeApi.getFinanceLedger,
  });
export const useFunds = () =>
  useQuery({ queryKey: ["funds"], queryFn: financeApi.getFunds });
export const useCreateFund = () =>
  useFinanceMutation("funds", financeApi.createFund);
export const useDonors = () =>
  useQuery({ queryKey: ["donors"], queryFn: financeApi.getDonors });
export const useCreateDonor = () =>
  useFinanceMutation("donors", financeApi.createDonor);
export const useCreateDonation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createDonation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["finance-ledger"] }),
  });
};
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createExpense,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["finance-ledger"] }),
  });
};
export const useFeePaymentHistory = (filters = {}) =>
  useQuery({
    queryKey: ["fee-payment-history", filters],
    queryFn: () => financeApi.getFeePaymentHistory(filters),
  });

export const useTeacherSalaries = () =>
  useFinanceQuery("teacher-salaries", financeApi.getTeacherSalaries);
export const useCreateTeacherSalary = () =>
  useFinanceMutation("teacher-salaries", financeApi.createTeacherSalary);
export const useUpdateTeacherSalary = () =>
  useFinanceMutation("teacher-salaries", ({ id, data }) =>
    financeApi.updateTeacherSalary(id, data),
  );
export const useDeleteTeacherSalary = () =>
  useFinanceMutation("teacher-salaries", financeApi.deleteTeacherSalary);
