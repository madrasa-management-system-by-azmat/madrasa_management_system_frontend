"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as tasksApi from "@/lib/api/tasks";

const keys = [
  "task-dashboard",
  "task-categories",
  "task-projects",
  "administrative-tasks",
  "administrative-task",
];
function useTaskMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  });
}

export const useTaskDashboard = () =>
  useQuery({
    queryKey: ["task-dashboard"],
    queryFn: tasksApi.getTaskDashboard,
  });
export const useTaskCategories = () =>
  useQuery({
    queryKey: ["task-categories"],
    queryFn: tasksApi.getTaskCategories,
  });
export const useCreateTaskCategory = () =>
  useTaskMutation(tasksApi.createTaskCategory);
export const useTaskProjects = () =>
  useQuery({ queryKey: ["task-projects"], queryFn: tasksApi.getTaskProjects });
export const useCreateTaskProject = () =>
  useTaskMutation(tasksApi.createTaskProject);
export const useAdministrativeTasks = (params = {}) =>
  useQuery({
    queryKey: ["administrative-tasks", params],
    queryFn: () => tasksApi.getAdministrativeTasks(params),
  });
export const useAdministrativeTask = (id) =>
  useQuery({
    queryKey: ["administrative-task", id],
    queryFn: () => tasksApi.getAdministrativeTask(id),
    enabled: Boolean(id),
  });
export const useCreateAdministrativeTask = () =>
  useTaskMutation(tasksApi.createAdministrativeTask);
export const useUpdateAdministrativeTask = () =>
  useTaskMutation(tasksApi.updateAdministrativeTask);
export const useTaskAction = () => useTaskMutation(tasksApi.taskAction);
export const useTaskPeople = () =>
  useQuery({ queryKey: ["task-people"], queryFn: tasksApi.getTaskPeople });
export const useCreateTaskChecklistItem = () =>
  useTaskMutation(tasksApi.createTaskChecklistItem);
export const useUpdateTaskChecklistItem = () =>
  useTaskMutation(tasksApi.updateTaskChecklistItem);
export const useCreateTaskDependency = () =>
  useTaskMutation(tasksApi.createTaskDependency);
export const useCreateTaskComment = () =>
  useTaskMutation(tasksApi.createTaskComment);
export const useCreateTaskRecurrence = () =>
  useTaskMutation(tasksApi.createTaskRecurrence);
export const useGenerateRecurringTasks = () =>
  useTaskMutation(tasksApi.generateRecurringTasks);
