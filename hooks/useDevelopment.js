"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/development";
const keys = [
  "development-dashboard",
  "discipline-categories",
  "discipline-incidents",
  "training-programs",
  "reward-categories",
  "rewards",
  "alumni",
  "alumni-engagements",
];
function useDevelopmentMutation(fn) {
  const c = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () =>
      keys.forEach((k) => c.invalidateQueries({ queryKey: [k] })),
  });
}
export const useDevelopmentDashboard = () =>
  useQuery({
    queryKey: ["development-dashboard"],
    queryFn: api.getDevelopmentDashboard,
  });
export const useDisciplineCategories = () =>
  useQuery({
    queryKey: ["discipline-categories"],
    queryFn: api.getDisciplineCategories,
  });
export const useCreateDisciplineCategory = () =>
  useDevelopmentMutation(api.createDisciplineCategory);
export const useDisciplineIncidents = () =>
  useQuery({
    queryKey: ["discipline-incidents"],
    queryFn: api.getDisciplineIncidents,
  });
export const useCreateDisciplineIncident = () =>
  useDevelopmentMutation(api.createDisciplineIncident);
export const useIncidentAction = () =>
  useDevelopmentMutation(api.incidentAction);
export const useCreateDisciplineAction = () =>
  useDevelopmentMutation(api.createDisciplineAction);
export const useTrainingPrograms = () =>
  useQuery({
    queryKey: ["training-programs"],
    queryFn: api.getTrainingPrograms,
  });
export const useCreateTrainingProgram = () =>
  useDevelopmentMutation(api.createTrainingProgram);
export const useCreateTrainingEnrollment = () =>
  useDevelopmentMutation(api.createTrainingEnrollment);
export const useCompleteTrainingEnrollment = () =>
  useDevelopmentMutation(api.completeTrainingEnrollment);
export const useRewardCategories = () =>
  useQuery({
    queryKey: ["reward-categories"],
    queryFn: api.getRewardCategories,
  });
export const useCreateRewardCategory = () =>
  useDevelopmentMutation(api.createRewardCategory);
export const useRewards = () =>
  useQuery({ queryKey: ["rewards"], queryFn: api.getRewards });
export const useCreateReward = () => useDevelopmentMutation(api.createReward);
export const useRewardAction = () => useDevelopmentMutation(api.rewardAction);
export const useAlumni = () =>
  useQuery({ queryKey: ["alumni"], queryFn: api.getAlumni });
export const useAlumniEngagements = () =>
  useQuery({
    queryKey: ["alumni-engagements"],
    queryFn: api.getAlumniEngagements,
  });
export const useCreateAlumniEngagement = () =>
  useDevelopmentMutation(api.createAlumniEngagement);
