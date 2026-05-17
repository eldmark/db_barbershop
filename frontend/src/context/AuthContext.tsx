import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { apiFetch } from "../services/api";

type AuthUser = {
  id_user: number;
  name: string;
  email: string;
  roles: string[];
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  // remember: when true persist to localStorage, otherwise use sessionStorage
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "barber.auth";

type StoredAuth = {
  token: string;
  user: AuthUser;
};

const getStoredAuth = (): StoredAuth | null => {
  const rawLocal = localStorage.getItem(STORAGE_KEY);
  const rawSession = sessionStorage.getItem(STORAGE_KEY);
  const raw = rawLocal ?? rawSession;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth()?.user ?? null);
  const [token, setToken] = useState<string | null>(() => getStoredAuth()?.token ?? null);
  const [loading] = useState(false);

  const login = useCallback(async (email: string, password: string, remember = true) => {
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (!data?.token || !data.user) {
      throw new Error("Invalid credentials");
    }

    setUser(data.user);
    setToken(data.token);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasRole = useCallback(
    (roles: string[]) => {
      if (!user) return false;
      return roles.some((role) => user.roles.includes(role));
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, token, loading, login, logout, hasRole }),
    [user, token, loading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
