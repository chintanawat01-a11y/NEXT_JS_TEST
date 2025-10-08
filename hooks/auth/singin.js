// hooks/auth/singin.js
"use client";

import * as React from "react";
import api_handler from "../api-handler.js";
import { mapSignInFormToBody } from "../../models/auth/singin.js";

export default function useSignIn() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError]   = React.useState("");

  const signin = async (form) => {
    setError("");
    try {
      setLoading(true);
      const body = mapSignInFormToBody(form);
      const res  = await api_handler("post", "/api/module/auth/signin", { body });
      const data = res?.data?.results;

      // เก็บ token แบบง่าย ๆ (โปรดักชันควรใช้ httpOnly cookie)
      const access = data?.tokens?.accessToken;
      if (!access) throw new Error("no token from server");

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", data?.tokens?.refreshToken || "");
      localStorage.setItem("user", JSON.stringify(data?.user || {}));

      return { ok: true, data };
    } catch (e) {
      const msg = e?.response?.data?.results || e?.response?.data?.error || e?.message || "Sign-in failed";
      setError(String(msg));
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { signin, loading, error, setError };
}
