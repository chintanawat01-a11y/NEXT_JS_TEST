// models/auth/singin.js
export function mapSignInFormToBody(form) {
  return {
    user_username: String(form.username || "").trim(),
    user_password: String(form.password || "")
  };
}
