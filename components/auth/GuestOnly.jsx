"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";

const redirectMessage = "\u0688\u06CC\u0634 \u0628\u0648\u0631\u0688 \u067E\u0631 \u0645\u0646\u062A\u0642\u0644 \u06A9\u06CC\u0627 \u062C\u0627 \u0631\u06C1\u0627 \u06C1\u06D2\u06D4";

export default function GuestOnly({ children }) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuthContext();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || isAuthenticated) {
    return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">{redirectMessage}</div>;
  }

  return children;
}
