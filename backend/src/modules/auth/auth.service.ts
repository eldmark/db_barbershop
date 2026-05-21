import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { createSession, destroySession, getSessionUser } from "../../middleware/session";

export const login = async (email: string, password: string) => {
  const user = await prisma.userAccount.findFirst({
    where: {
      email,
      deleted_at: null
    },
    include: {
      user_roles: {
        include: {
          role: true
        }
      }
    }
  });

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const roles = user.user_roles.map((userRole) => userRole.role.name);
  const sessionId = await createSession(user.id_user);

  return {
    sessionId,
    user: {
      id_user: user.id_user,
      name: user.name,
      email: user.email,
      roles
    }
  };
};

export const logout = async (sessionId: string | null) => {
  if (sessionId) await destroySession(sessionId);
  return { success: true };
};

export const currentSession = async (sessionId: string | null) => {
  if (!sessionId) return null;
  return getSessionUser(sessionId);
};
