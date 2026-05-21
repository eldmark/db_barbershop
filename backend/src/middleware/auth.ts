import { getSessionIdFromContext, getSessionUser, SessionUser } from "./session";

const roleAliases: Record<string, string> = {
  admin: "admin_role",
  manager: "manager_role",
  employee: "employee_role",
  cashier: "cashier_role",
  client: "client_role"
};

const normalizeRole = (role: string | number) => {
  const value = String(role);
  return roleAliases[value] ?? value;
};

export interface AuthContextUser extends SessionUser {
  id_user: number;
  roles: string[];
}

// Guard-style middleware for Elysia
export const createAuthGuard = () => {
  return async (ctx: any) => {
    const sessionId = getSessionIdFromContext(ctx);

    if (!sessionId) throw new Error("Missing session");

    const user = await getSessionUser(sessionId);
    if (!user) throw new Error("Invalid session");

    ctx.user = user;
  };
};

// Role guard for Elysia
export const createRoleGuard = (roles: Array<string | number>) => {
  return async (ctx: any) => {
    await createAuthGuard()(ctx);

    if (roles.length === 0) return;

    const userRolesSet = new Set<string>(
      ctx.user?.roles?.flatMap((role: string) => [role, normalizeRole(role)]) ?? []
    );
    const ok = roles.some((role) => userRolesSet.has(normalizeRole(role)));
    if (!ok) throw new Error("Forbidden");
  };
};
