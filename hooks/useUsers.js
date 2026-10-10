"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMadrasa,
  createMadrasaUser,
  createTenantRole,
  deleteTenantRole,
  getMadrasas,
  getMadrasaUsers,
  getPermissionCatalogue,
  getTenantRoles,
  resetMadrasaAdminPassword,
  updateMadrasa,
  updateMadrasaUser,
  updateTenantRole,
} from "@/lib/api/users";

function useUserMutation(mutationFn, key) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });
}

export const useMadrasaUsers = (options = {}) =>
  useQuery({
    queryKey: ["madrasa-users"],
    queryFn: getMadrasaUsers,
    ...options,
  });
export const useCreateMadrasaUser = () =>
  useUserMutation(createMadrasaUser, "madrasa-users");
export const useUpdateMadrasaUser = () =>
  useUserMutation(
    ({ id, data }) => updateMadrasaUser(id, data),
    "madrasa-users",
  );
export const useTenantRoles = (options = {}) =>
  useQuery({ queryKey: ["tenant-roles"], queryFn: getTenantRoles, ...options });
export const usePermissionCatalogue = (options = {}) =>
  useQuery({
    queryKey: ["permission-catalogue"],
    queryFn: getPermissionCatalogue,
    ...options,
  });
export const useCreateTenantRole = () =>
  useUserMutation(createTenantRole, "tenant-roles");
export const useUpdateTenantRole = () =>
  useUserMutation(({ id, data }) => updateTenantRole(id, data), "tenant-roles");
export const useDeleteTenantRole = () =>
  useUserMutation(deleteTenantRole, "tenant-roles");
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
