import { randomUUID } from "crypto";
import { prisma } from "../config/prisma";

export type SessionUser = {
  id_user: number;
  name: string;
  email: string;
  roles: string[];
};

const COOKIE_NAME = "barber_session";
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS ?? 1000 * 60 * 60 * 8);

export const createSession = async (idUser: number) => {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      id: sessionId,
      id_user: idUser,
      expires_at: expiresAt
    }
  });

  return sessionId;
};

export const destroySession = async (sessionId: string) => {
  await prisma.session.deleteMany({
    where: { id: sessionId }
  });
};

export const getSessionUser = async (sessionId: string): Promise<SessionUser | null> => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        include: {
          user_roles: {
            include: {
              role: true
            }
          }
        }
      }
    }
  });

  if (!session) return null;

  if (session.expires_at.getTime() <= Date.now()) {
    await destroySession(sessionId);
    return null;
  }

  return {
    id_user: session.user.id_user,
    name: session.user.name,
    email: session.user.email,
    roles: session.user.user_roles.map((userRole) => userRole.role.name)
  };
};

export const buildSessionCookie = (sessionId: string) => {
  const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000);
  return [
    `${COOKIE_NAME}=${sessionId}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    process.env.SESSION_COOKIE_SECURE === "true" ? "Secure" : ""
  ]
    .filter(Boolean)
    .join("; ");
};

export const buildClearSessionCookie = () => {
  return [
    `${COOKIE_NAME}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
    process.env.SESSION_COOKIE_SECURE === "true" ? "Secure" : ""
  ]
    .filter(Boolean)
    .join("; ");
};

export const getSessionIdFromCookieHeader = (cookieHeader?: string | null) => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));
  if (!sessionCookie) return null;

  return decodeURIComponent(sessionCookie.slice(COOKIE_NAME.length + 1));
};

export const getSessionIdFromContext = (ctx: any) => {
  const cookieHeader =
    ctx.request?.headers?.get?.("cookie") ??
    ctx.headers?.cookie ??
    ctx.headers?.Cookie ??
    null;

  return getSessionIdFromCookieHeader(cookieHeader);
};

