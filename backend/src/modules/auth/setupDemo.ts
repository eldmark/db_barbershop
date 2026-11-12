import { pool } from "../../config/db";
import bcrypt from "bcrypt";

export const createDemoUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Ensure roles exist
    await pool.query(`INSERT INTO role (name) VALUES ('admin') ON CONFLICT DO NOTHING`);
    await pool.query(`INSERT INTO role (name) VALUES ('employee') ON CONFLICT DO NOTHING`);
    await pool.query(`INSERT INTO role (name) VALUES ('client') ON CONFLICT DO NOTHING`);

    const demoUsers = [
      { name: "Admin User", email: "admin@example.com", roleName: "admin" },
      { name: "Employee User", email: "employee@example.com", roleName: "employee" },
      { name: "Client User", email: "client@example.com", roleName: "client" }
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
