"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMadrasa,
  createMadrasaUser,
  getMadrasas,
  getMadrasaUsers,
  resetMadrasaAdminPassword,
  updateMadrasa,
  updateMadrasaUser,
} from "@/lib/api/users";

function useUserMutation(mutationFn, key) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
}

export const useMadrasaUsers = () =>
  useQuery({ queryKey: ["madrasa-users"], queryFn: getMadrasaUsers });
export const useCreateMadrasaUser = () =>
  useUserMutation(createMadrasaUser, "madrasa-users");
export const useUpdateMadrasaUser = () =>
  useUserMutation(
    ({ id, data }) => updateMadrasaUser(id, data),
    "madrasa-users",
  );
export const useMadrasas = () =>
  useQuery({ queryKey: ["madrasas"], queryFn: getMadrasas });
export const useCreateMadrasa = () =>
  useUserMutation(createMadrasa, "madrasas");
export const useUpdateMadrasa = () =>
  useUserMutation(({ id, data }) => updateMadrasa(id, data), "madrasas");
export const useResetMadrasaAdminPassword = () =>
  useUserMutation(
    ({ id, password }) => resetMadrasaAdminPassword(id, password),
    "madrasas",
  );
