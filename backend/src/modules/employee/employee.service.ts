import { query } from "../../utils/db";
import { Employee } from "../../types/entities";

export const getEmployees = async () => query(`SELECT * FROM Employee`);
export const getEmployeeById = async (id: number) => query(`SELECT * FROM Employee WHERE id_employee = $1`, [id]);
export const createEmployee = async (e: Employee) => query(`INSERT INTO Employee (name, specialty, salary) VALUES ($1, $2, $3) RETURNING *`, [e.name, e.specialty, e.salary]);
export const updateEmployee = async (id: number, e: Employee) => query(`UPDATE Employee SET name=$1, specialty=$2, salary=$3 WHERE id_employee=$4 RETURNING *`, [e.name, e.specialty, e.salary, id]);
export const deleteEmployee = async (id: number) => query(`DELETE FROM Employee WHERE id_employee = $1`, [id]);
