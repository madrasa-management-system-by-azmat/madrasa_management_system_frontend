"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import { login } from "@/lib/api/auth";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  loginFailed: "\u0644\u0627\u06AF \u0627\u0650\u0646 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4 \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u0627\u067E\u0646\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062F\u0648\u0628\u0627\u0631\u06C1 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA\u06D4",
  loginSuccess: "\u0622\u067E \u06A9\u0627 \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u0644\u0627\u06AF \u0627\u0650\u0646 \u06C1\u0648 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4",
  welcome: "\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F",
};

export function useLogin() {
  const router = useRouter();
  const { startSession } = useAuthContext();

  return useMutation({
    mutationFn: login,
    onSuccess: (authData, variables) => {
      startSession(authData, variables.remember);
      toast.success(text.welcome, text.loginSuccess);
      router.replace("/dashboard");
    },
    onError: (error) => toast.error(text.loginFailed, getApiErrorMessage(error, text.loginFailed)),
  });
}
