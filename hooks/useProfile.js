"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateCurrentUser } from "@/lib/api/auth";
import { getAuthSession, saveAuthSession } from "@/lib/authStorage";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      const session = getAuthSession();
      if (session) saveAuthSession({ ...session, user });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
