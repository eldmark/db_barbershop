import * as service from "./employee.service";

export const getEmployees = async () => service.getEmployees();
export const getEmployeeById = async (params: any) => service.getEmployeeById(Number(params.id));
export const createEmployee = async (body: any) => service.createEmployee(body);
export const updateEmployee = async (params: any, body: any) => service.updateEmployee(Number(params.id), body);
export const deleteEmployee = async (params: any) => service.deleteEmployee(Number(params.id));
