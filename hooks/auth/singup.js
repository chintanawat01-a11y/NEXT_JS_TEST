// hooks/auth/singup.js
"use client";

import * as React from "react";
import api_handler from "../api-handler.js";
import { mapSignUpFormToBody } from "../../models/auth/singup.js";

export default function useSignUp() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError]   = React.useState("");

  const signup = async (form) => {
    setError("");
    try {
      setLoading(true);
      const body = mapSignUpFormToBody(form);
      const res  = await api_handler("post", "/api/module/auth/signup", { body });
      const data = res?.data?.results || null;
      return { ok: true, data };
    } catch (e) {
      const msg = e?.response?.data?.results || e?.response?.data?.error || e?.message || "Sign-up failed";
      setError(String(msg));
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, setError };
}
