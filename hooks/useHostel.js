"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as hostelApi from "@/lib/api/hostel";

function useHostelQuery(key, queryFn) {
  return useQuery({ queryKey: [key], queryFn });
}
function useHostelMutation(key, mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
}

export const useHostelWings = () =>
  useHostelQuery("hostel-wings", hostelApi.getHostelWings);
export const useCreateHostelWing = () =>
  useHostelMutation("hostel-wings", hostelApi.createHostelWing);
export const useUpdateHostelWing = () =>
  useHostelMutation("hostel-wings", ({ id, data }) =>
    hostelApi.updateHostelWing(id, data),
  );
export const useDeleteHostelWing = () =>
  useHostelMutation("hostel-wings", hostelApi.deleteHostelWing);

export const useHostelRooms = () =>
  useHostelQuery("hostel-rooms", hostelApi.getHostelRooms);
export const useCreateHostelRoom = () =>
  useHostelMutation("hostel-rooms", hostelApi.createHostelRoom);
export const useUpdateHostelRoom = () =>
  useHostelMutation("hostel-rooms", ({ id, data }) =>
    hostelApi.updateHostelRoom(id, data),
  );
export const useDeleteHostelRoom = () =>
  useHostelMutation("hostel-rooms", hostelApi.deleteHostelRoom);

export const useHostelAllocations = () =>
  useHostelQuery("hostel-allocations", hostelApi.getHostelAllocations);
export const useCreateHostelAllocation = () =>
  useHostelMutation("hostel-allocations", hostelApi.createHostelAllocation);
export const useUpdateHostelAllocation = () =>
  useHostelMutation("hostel-allocations", ({ id, data }) =>
    hostelApi.updateHostelAllocation(id, data),
  );
export const useDeleteHostelAllocation = () =>
  useHostelMutation("hostel-allocations", hostelApi.deleteHostelAllocation);

export const useGatePasses = () =>
  useHostelQuery("gate-passes", hostelApi.getGatePasses);
export const useCreateGatePass = () =>
  useHostelMutation("gate-passes", hostelApi.createGatePass);
export const useUpdateGatePass = () =>
  useHostelMutation("gate-passes", ({ id, data }) =>
    hostelApi.updateGatePass(id, data),
  );
export const useDeleteGatePass = () =>
  useHostelMutation("gate-passes", hostelApi.deleteGatePass);
