import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_env";

export const signToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const requireAuth = (handler: any) => {
  return async (ctx: any) => {
    const authHeader = ctx.headers?.authorization || ctx.request?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { status: 401, body: { error: "Missing token" } };
    }
    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);
    if (!decoded) return { status: 401, body: { error: "Invalid token" } };
    ctx.user = decoded;
    return handler(ctx);
  };
};

export const requireRole = (handler: any, roles: string[] = []) => {
  return requireAuth(async (ctx: any) => {
    const userId = (ctx.user as any)?.id_user;
    if (!userId) return { status: 403, body: { error: "Forbidden" } };
    if (roles.length === 0) return handler(ctx);
    // fetch roles from DB
    const res = await pool.query(
      `SELECT r.name FROM Role r JOIN UserRole ur ON r.id_role = ur.id_role WHERE ur.id_user = $1`,
      [userId]
    );
    const userRoles = res.rows.map((r: any) => r.name);
    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) return { status: 403, body: { error: "Forbidden " } };
    return handler(ctx);
  });
};
