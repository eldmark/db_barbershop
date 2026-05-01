import * as service from "./user.service";
import { User } from "../../types/entities";

export const getUsers = async () => service.getUsers();

export const createUser = async (body: Pick<User, "name" | "email" | "password">) => {
  const { name, email, password } = body;
  return await service.createUser(name, email, password);
};

export const getUserById = async (params: { id: string | number }) => service.getUserById(Number(params.id));

export const deleteUser = async (params: { id: string | number }) => service.deleteUser(Number(params.id));

export const updateUser = async (params: { id: string | number }, body: Pick<User, "name" | "email">) => {
  const { name, email } = body;
  return await service.updateUser(Number(params.id), name, email);
};