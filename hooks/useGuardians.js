"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as guardiansApi from "@/lib/api/guardians";

const keys = [
  "parent-portal",
  "guardians",
  "parent-meeting-slots",
  "parent-meeting-bookings",
  "guardian-announcements",
  "guardian-leave-requests",
];
function useGuardianMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  });
}

export const useParentPortal = () =>
  useQuery({
    queryKey: ["parent-portal"],
    queryFn: guardiansApi.getParentPortal,
  });
export const useGuardians = () =>
  useQuery({ queryKey: ["guardians"], queryFn: guardiansApi.getGuardians });
export const useCreateGuardian = () =>
  useGuardianMutation(guardiansApi.createGuardian);
export const useInviteGuardian = () =>
  useGuardianMutation(guardiansApi.inviteGuardian);
export const useSuspendGuardian = () =>
  useGuardianMutation(guardiansApi.suspendGuardian);
export const useGuardianInvitation = (token) =>
  useQuery({
    queryKey: ["guardian-invitation", token],
    queryFn: () => guardiansApi.getGuardianInvitation(token),
    enabled: Boolean(token),
    retry: false,
  });
export const useActivateGuardian = () =>
  useMutation({ mutationFn: guardiansApi.activateGuardian });
export const useParentMeetingSlots = () =>
  useQuery({
    queryKey: ["parent-meeting-slots"],
    queryFn: guardiansApi.getParentMeetingSlots,
  });
export const useCreateParentMeetingSlot = () =>
  useGuardianMutation(guardiansApi.createParentMeetingSlot);
export const useParentMeetingBookings = () =>
  useQuery({
    queryKey: ["parent-meeting-bookings"],
    queryFn: guardiansApi.getParentMeetingBookings,
  });
export const useCreateParentMeetingBooking = () =>
  useGuardianMutation(guardiansApi.createParentMeetingBooking);
export const useCompleteParentMeetingBooking = () =>
  useGuardianMutation(guardiansApi.completeParentMeetingBooking);
export const useGuardianAnnouncements = () =>
  useQuery({
    queryKey: ["guardian-announcements"],
    queryFn: guardiansApi.getGuardianAnnouncements,
  });
export const useCreateGuardianAnnouncement = () =>
  useGuardianMutation(guardiansApi.createGuardianAnnouncement);
export const useMarkGuardianAnnouncementRead = () =>
  useGuardianMutation(guardiansApi.markGuardianAnnouncementRead);
export const useGuardianLeaveTypes = () =>
  useQuery({
    queryKey: ["guardian-leave-types"],
    queryFn: guardiansApi.getGuardianLeaveTypes,
  });
export const useGuardianLeaveRequests = () =>
  useQuery({
    queryKey: ["guardian-leave-requests"],
    queryFn: guardiansApi.getGuardianLeaveRequests,
  });
export const useCreateGuardianLeaveRequest = () =>
  useGuardianMutation(guardiansApi.createGuardianLeaveRequest);
export const useSubmitGuardianLeaveRequest = () =>
  useGuardianMutation(guardiansApi.submitGuardianLeaveRequest);
