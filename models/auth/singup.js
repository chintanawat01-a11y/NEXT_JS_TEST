// models/auth/singup.js
export function mapSignUpFormToBody(form) {
  return {
    user_username: String(form.username || "").trim(),
    user_password: String(form.password || ""),
    user_email:    form.email ? String(form.email).trim() : null,
    user_fname:    form.fname ? String(form.fname).trim() : null,
    user_lname:    form.lname ? String(form.lname).trim() : null,
    user_gender:   form.gender || null, // 'M' | 'F' | 'X' | null
    user_phone_num: form.phone ? String(form.phone).trim() : null,
    fk_role_id:    form.role_id || null
  };
}
