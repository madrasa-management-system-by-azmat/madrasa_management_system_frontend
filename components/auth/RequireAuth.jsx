"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";
import AppLoader from "@/components/ui/AppLoader";

const redirectMessage =
  "\u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u0644\u0627\u06AF \u0627\u0650\u0646 \u06A9\u0631\u06CC\u06BA\u06D4";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const { isAuthenticated, isReady, user } = useAuthContext();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/auth");
    }
    if (
      isReady &&
      isAuthenticated &&
      user?.is_super_admin &&
      !window.location.pathname.startsWith("/dashboard/super-admin") &&
      !window.location.pathname.startsWith("/dashboard/profile")
    ) {
      router.replace("/dashboard/super-admin");
    }
    if (
      isReady &&
      isAuthenticated &&
      user?.role === "guardian" &&
      !window.location.pathname.startsWith("/parent")
    ) {
      router.replace("/parent");
    }
  }, [isAuthenticated, isReady, router, user]);

  if (!isReady || !isAuthenticated) {
    return <AppLoader message={redirectMessage} />;
  }

  return children;
}
