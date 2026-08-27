const AUTH_STORAGE_KEY = "madrasa-auth-session";
const AUTH_ROUTE_COOKIE = "madrasa-authenticated";
const AUTH_CHANGE_EVENT = "madrasa-auth-change";

let cachedSession = null;
let hasLoadedSession = false;

function getStorage(remember) {
  if (typeof window === "undefined") {
    return null;
  }

  return remember ? window.localStorage : window.sessionStorage;
}

export function getAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  if (hasLoadedSession) {
    return cachedSession;
  }

  for (const storage of [window.localStorage, window.sessionStorage]) {
    const storedSession = storage.getItem(AUTH_STORAGE_KEY);

    if (storedSession) {
      try {
        cachedSession = JSON.parse(storedSession);
        hasLoadedSession = true;
        return cachedSession;
      } catch {
        storage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }

  hasLoadedSession = true;
  return null;
}

export function saveAuthSession(session, remember = session.remember) {
  const storage = getStorage(remember);

  if (!storage) {
    return;
  }

  const sessionWithPreference = { ...session, remember };
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionWithPreference));
  cachedSession = sessionWithPreference;
  hasLoadedSession = true;
  document.cookie = `${AUTH_ROUTE_COOKIE}=true; path=/; SameSite=Lax${remember ? "; max-age=604800" : ""}`;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  cachedSession = null;
  hasLoadedSession = true;
  document.cookie = `${AUTH_ROUTE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}


export function subscribeToAuthSession(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event) {
    if (event.key === AUTH_STORAGE_KEY) {
      hasLoadedSession = false;
      callback();
    }
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}
