"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as meetingsApi from "@/lib/api/meetings";

const keys = [
  "meeting-dashboard",
  "meeting-types",
  "meetings",
  "meeting",
  "meeting-decisions",
  "meeting-actions",
];
function useMeetingMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  });
}

export const useMeetingDashboard = () =>
  useQuery({
    queryKey: ["meeting-dashboard"],
    queryFn: meetingsApi.getMeetingDashboard,
  });
export const useMeetingTypes = () =>
  useQuery({
    queryKey: ["meeting-types"],
    queryFn: meetingsApi.getMeetingTypes,
  });
export const useCreateMeetingType = () =>
  useMeetingMutation(meetingsApi.createMeetingType);
export const useMeetings = (params = {}) =>
  useQuery({
    queryKey: ["meetings", params],
    queryFn: () => meetingsApi.getMeetings(params),
  });
export const useMeeting = (id) =>
  useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingsApi.getMeeting(id),
    enabled: Boolean(id),
  });
export const useCreateMeeting = () =>
  useMeetingMutation(meetingsApi.createMeeting);
export const useMeetingAction = () =>
  useMeetingMutation(meetingsApi.meetingAction);
export const useMeetingPeople = () =>
  useQuery({
    queryKey: ["meeting-people"],
    queryFn: meetingsApi.getMeetingPeople,
  });
export const useCreateAgendaItem = () =>
  useMeetingMutation(meetingsApi.createAgendaItem);
export const useCreateMeetingParticipant = () =>
  useMeetingMutation(meetingsApi.createMeetingParticipant);
export const useMarkMeetingAttendance = () =>
  useMeetingMutation(meetingsApi.markMeetingAttendance);
export const useCreateMeetingMinutes = () =>
  useMeetingMutation(meetingsApi.createMeetingMinutes);
export const useCreateMeetingDecision = () =>
  useMeetingMutation(meetingsApi.createMeetingDecision);
export const useMeetingDecisions = (params = {}) =>
  useQuery({
    queryKey: ["meeting-decisions", params],
    queryFn: () => meetingsApi.getMeetingDecisions(params),
  });
export const useCreateMeetingActionItem = () =>
  useMeetingMutation(meetingsApi.createMeetingActionItem);
export const useMeetingActionItems = (params = {}) =>
  useQuery({
    queryKey: ["meeting-actions", params],
    queryFn: () => meetingsApi.getMeetingActionItems(params),
  });
export const useUpdateMeetingActionItem = () =>
  useMeetingMutation(meetingsApi.updateMeetingActionItem);
