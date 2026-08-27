"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { logout } from "@/lib/api/auth";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  subscribeToAuthSession,
} from "@/lib/authStorage";

const AuthContext = createContext(undefined);
const subscribeToClientReady = () => () => {};

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(
    subscribeToAuthSession,
    getAuthSession,
    () => null,
  );
  const isReady = useSyncExternalStore(
    subscribeToClientReady,
    () => true,
    () => false,
  );

  const startSession = useCallback((authData, remember) => {
    const nextSession = { ...authData, remember };
    saveAuthSession(nextSession, remember);
  }, []);

  const endSession = useCallback(async () => {
    const activeSession = getAuthSession();

    try {
      if (activeSession?.refresh) {
        await logout(activeSession.refresh);
      }
    } catch {
      // A local logout must still complete when an expired token is rejected.
    } finally {
      clearAuthSession();
    }
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      role: session?.user?.role ?? null,
      isSuperAdmin: Boolean(session?.user?.is_super_admin),
      hasRole: (...roles) => roles.includes(session?.user?.role),
      isAuthenticated: Boolean(session?.access),
      isReady,
      startSession,
      endSession,
    }),
    [session, isReady, startSession, endSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}
