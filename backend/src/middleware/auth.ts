import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_env";

export interface AuthTokenPayload extends JwtPayload {
  id_user: number;
  roles: string[];
}

type AuthContext = {
  headers?: Record<string, string | undefined>;
  request?: {
    headers?: Record<string, string | undefined>;
  };
  user?: AuthTokenPayload;
};

type Handler<TContext extends AuthContext> = (ctx: TContext) => unknown | Promise<unknown>;

export const signToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as AuthTokenPayload;
  } catch (err) {
    return null;
  }
};

export const requireAuth = <TContext extends AuthContext>(handler: Handler<TContext>) => {
  return async (ctx: TContext) => {
    const authHeader = ctx.headers?.authorization || ctx.request?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { status: 401, body: { error: "Missing token" } };
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return { status: 401, body: { error: "Invalid token" } };
    ctx.user = decoded;
    return handler(ctx);
  };
};

export const requireRole = <TContext extends AuthContext>(handler: Handler<TContext>, roles: string[] = []) => {
  return requireAuth(async (ctx: TContext) => {
    const userId = ctx.user?.id_user;
    if (!userId) return { status: 403, body: { error: "Forbidden" } };
    if (roles.length === 0) return handler(ctx);
    // fetch roles from DB
    const res = await pool.query(
      `SELECT r.name FROM Role r JOIN UserRole ur ON r.id_role = ur.id_role WHERE ur.id_user = $1`,
      [userId]
    );
    const userRoles = res.rows.map((r: { name: string }) => r.name);
    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) return { status: 403, body: { error: "Forbidden " } };
    return handler(ctx);
  });
};
