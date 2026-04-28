import * as service from "./user.service";

export const getUsers = async () => {
  return await service.getUsers();
};

export const createUser = async (body: any) => {
  const { name, email, password } = body;
  return await service.createUser(name, email, password);
};

export const getUserById = async (params: any) => {
  return await service.getUserById(Number(params.id));
};

export const deleteUser = async (params: any) => {
  return await service.deleteUser(Number(params.id));
};