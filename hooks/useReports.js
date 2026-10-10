"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateReport, getReportCatalogue } from "@/lib/api/reports";

export const useReportCatalogue = () =>
  useQuery({ queryKey: ["report-catalogue"], queryFn: getReportCatalogue });
export const useGenerateReport = () =>
  useMutation({ mutationFn: generateReport });
