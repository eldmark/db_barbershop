import * as authService from "./auth.service";
import * as userService from "../user/user.service";
import { User } from "../../types/entities";

export const login = async (body: Pick<User, "email" | "password">) => {
  const { email, password } = body;
  return await authService.login(email, password);
};

export const register = async (body: Pick<User, "name" | "email" | "password">) => {
  const { name, email, password } = body;
  return await userService.createUser(name, email, password);
};
