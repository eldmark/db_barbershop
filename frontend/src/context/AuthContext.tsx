import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";

type AuthUser = {
  id_user: number;
  name: string;
  email: string;
  roles: string[];
};

type LoginResponse = {
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_TOKEN = "session";

type SessionResponse = {
  user: AuthUser;
};

const roleAliases: Record<string, string> = {
  admin: "admin_role",
  manager: "manager_role",
  employee: "employee_role",
  cashier: "cashier_role",
  client: "client_role"
};

const normalizeRole = (role: string) => roleAliases[role] ?? role;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiFetch<SessionResponse>("/auth/session")
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        setToken(SESSION_TOKEN);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string, remember = true) => {
    void remember;
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (!data?.user) {
      throw new Error("Invalid credentials");
    }

    setUser(data.user);
    setToken(SESSION_TOKEN);
  }, []);

  const logout = useCallback(() => {
    void apiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    setToken(null);
  }, []);

  const hasRole = useCallback(
    (roles: string[]) => {
      if (!user) return false;
      const userRoles = new Set(user.roles.flatMap((role) => [role, normalizeRole(role)]));
      return roles.some((role) => userRoles.has(normalizeRole(role)));
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
