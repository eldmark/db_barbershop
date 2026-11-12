import { pool } from "../../config/db";
import bcrypt from "bcrypt";

export const createDemoUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const roleNames = ["admin_role", "manager_role", "employee_role", "cashier_role", "client_role"];
    for (const roleName of roleNames) {
      await pool.query(
        `INSERT INTO role (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [roleName]
      );
    }

    const demoUsers = [
      { name: "Admin User", email: "admin@example.com", roleName: "admin_role" },
      { name: "Manager User", email: "manager@example.com", roleName: "manager_role" },
      { name: "Employee User", email: "employee@example.com", roleName: "employee_role" },
      { name: "Cashier User", email: "cashier@example.com", roleName: "cashier_role" },
      { name: "Client User", email: "client@example.com", roleName: "client_role" }
    ];

    for (const u of demoUsers) {
      const result = await pool.query(
        `INSERT INTO user_account (name, email, password) VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
         RETURNING id_user`,
        [u.name, u.email, hashedPassword]
      );

      const userId = result.rows[0]?.id_user;
      if (userId) {
        const roleRes = await pool.query(`SELECT id_role FROM role WHERE name = $1 LIMIT 1`, [u.roleName]);
        const roleId = roleRes.rows[0]?.id_role;
        if (roleId) {
          await pool.query(`DELETE FROM user_role WHERE id_user = $1`, [userId]);
          await pool.query(`INSERT INTO user_role (id_user, id_role) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, roleId]);
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("createDemoUsers error:", err);
    throw err;
  }
};

export default createDemoUsers;
