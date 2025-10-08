// api/modules/auth/service.js
const bcrypt = require("bcryptjs");
const maria_query = require("../../util/maria_query");

// สร้างรหัสผู้ใช้ถัดไป: u00000001 → u00000002
async function nextUserId() {
  const rows = await maria_query(`
    SELECT user_id
    FROM user
    WHERE user_id REGEXP '^u[0-9]{8}$'
    ORDER BY CAST(SUBSTRING(user_id, 2) AS UNSIGNED) DESC
    LIMIT 1
  `);
  if (!rows || rows.length === 0) return "u00000001";
  const last = rows[0].user_id;
  const num = parseInt(last.slice(1), 10) + 1;
  return "u" + String(num).padStart(8, "0");
}

// ช่วยเช็กซ้ำ
async function isUsernameTaken(username) {
  const r = await maria_query(`SELECT 1 FROM user WHERE user_username = ? LIMIT 1`, [username]);
  return r.length > 0;
}
async function isEmailTaken(email) {
  const r = await maria_query(`SELECT 1 FROM user WHERE user_email = ? LIMIT 1`, [email]);
  return r.length > 0;
}

exports.signup = async (payload = {}) => {
  try {
    const username = String(payload.user_username || "").trim();
    const rawPass  = String(payload.user_password || "");
    const email    = payload.user_email == null ? null : String(payload.user_email).trim();
    const fname    = payload.user_fname == null ? null : String(payload.user_fname).trim();
    const lname    = payload.user_lname == null ? null : String(payload.user_lname).trim();
    const gender   = payload.user_gender == null ? null : String(payload.user_gender).trim(); // 'M' | 'F' | 'X' | null
    const phone    = payload.user_phone_num == null ? null : String(payload.user_phone_num).trim();
    const roleId   = payload.fk_role_id ?? null;

    // validate เบื้องต้น
    switch (true) {
      case !username:  return { status: 400, error: "user_username is required", results: null };
      case rawPass.length < 6: return { status: 400, error: "password must be at least 6 chars", results: null };
    }
    if (await isUsernameTaken(username)) {
      return { status: 400, error: "username already exists", results: null };
    }
    if (email && await isEmailTaken(email)) {
      return { status: 400, error: "email already exists", results: null };
    }

    const userId = await nextUserId();
    const hash = await bcrypt.hash(rawPass, 10);

    const sql = `
      INSERT INTO user (
        user_id,
        user_username,
        user_password,
        user_fname,
        user_lname,
        user_gender,
        user_phone_num,
        user_email,
        fk_role_id,
        user_is_active,
        user_last_login_at,
        user_created_at,
        user_updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const params = [
      userId, username, hash, fname, lname, gender, phone, email, roleId
    ];

    const r = await maria_query(sql, params);
    if (r.affectedRows !== 1) {
      return { status: 500, error: "failed to create user", results: null };
    }

    // ตอบกลับ user summary
    return {
      status: 201,
      error: null,
      results: {
        user_id: userId,
        user_username: username,
        user_email: email,
        user_fname: fname,
        user_lname: lname,
        fk_role_id: roleId
      }
    };
  } catch (err) {
    // 1062 = duplicate
    if (err?.errno === 1062) {
      return { status: 400, error: "duplicate username/email", results: null };
    }
    return { status: 500, error: err?.message || String(err), results: null };
  }
};

exports.signin = async (payload = {}) => {
  try {
    const username = String(payload.user_username || "").trim();
    const rawPass  = String(payload.user_password || "");
    if (!username || !rawPass) {
      return { status: 400, error: "user_username and user_password are required", results: null };
    }

    const rows = await maria_query(`
      SELECT
        user_id,
        user_username,
        user_password,
        user_email,
        user_fname,
        user_lname,
        fk_role_id,
        user_is_active
      FROM user
      WHERE user_username = ?
      LIMIT 1
    `, [username]);

    if (!rows.length) {
      return { status: 401, error: "invalid credentials", results: null };
    }
    const u = rows[0];
    if (u.user_is_active === 0) {
      return { status: 403, error: "user is disabled", results: null };
    }

    // รองรับทั้ง hash และ plaintext (ถ้าข้อมูลเดิมไม่ hash)
    let passOK = false;
    if (String(u.user_password).startsWith("$2a$") || String(u.user_password).startsWith("$2b$")) {
      passOK = await bcrypt.compare(rawPass, u.user_password);
    } else {
      passOK = (rawPass === u.user_password);
    }
    if (!passOK) {
      return { status: 401, error: "invalid credentials", results: null };
    }

    // อัปเดต last_login
    await maria_query(`UPDATE user SET user_last_login_at = CURRENT_TIMESTAMP, user_updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, [u.user_id]);

    // คืนข้อมูล user ให้ server.js ไปออก token ต่อ
    return {
      status: 200,
      error: null,
      results: {
        user_id: u.user_id,
        user_username: u.user_username,
        user_email: u.user_email,
        user_fname: u.user_fname,
        user_lname: u.user_lname,
        fk_role_id: u.fk_role_id
      }
    };
  } catch (err) {
    return { status: 500, error: err?.message || String(err), results: null };
  }
};
