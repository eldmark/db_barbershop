import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_env";

export interface AuthTokenPayload extends JwtPayload {
  id_user: number;
  roles: string[];
}

export const signToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as AuthTokenPayload;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
};

// Guard-style middleware for Elysia
export const createAuthGuard = () => {
  return async (ctx: any) => {
    const authHeader = ctx.request?.headers?.get("authorization") || ctx.headers?.authorization;
    console.log("Auth guard - authHeader:", authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing token");
    }
    
    const token = authHeader.split(" ")[1];
    console.log("Auth guard - token:", token.substring(0, 20) + "...");
    
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }
    
    ctx.user = decoded;
  };
};

// Role guard for Elysia
export const createRoleGuard = (roles: Array<string | number>) => {
  return async (ctx: any) => {
    // First apply auth
    await createAuthGuard()(ctx);

    if (roles.length === 0) return;

    const userId = ctx.user?.id_user;
    if (!userId) throw new Error("Forbidden");

    try {
      const res = await pool.query(
        `SELECT r.id_role, r.name FROM Role r JOIN UserRole ur ON r.id_role = ur.id_role WHERE ur.id_user = $1`,
        [userId]
      );

      // Build a set containing both role names and ids as strings for flexible matching
      const userRolesSet = new Set<string>();
      for (const row of res.rows) {
        if (row.name) userRolesSet.add(String(row.name));
        if (row.id_role !== undefined && row.id_role !== null) userRolesSet.add(String(row.id_role));
      }

      // Also include roles from token if present
      if (Array.isArray(ctx.user?.roles)) {
        for (const r of ctx.user.roles) userRolesSet.add(String(r));
      }

      console.log("User roles (set):", Array.from(userRolesSet), "Required:", roles);

      const ok = roles.some((r) => userRolesSet.has(String(r)));
      if (!ok) throw new Error("Forbidden");
    } catch (err: any) {
      if (err.message === "Forbidden") throw err;
      console.error("Role check error:", err);
      throw new Error("Forbidden");
    }
  };
};
