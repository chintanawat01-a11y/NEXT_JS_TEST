// app/register/page.jsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "../../component/object/button.jsx";
import SignInForm from "../../component/page/register/signin-form.jsx";
import SignUpForm from "../../component/page/register/signup-form.jsx";

// ใช้ hooks ใหม่ แทนการเขียน doSignin/doSignup เอง
import useSignIn from "../../hooks/auth/singin.js";
import useSignUp from "../../hooks/auth/singup.js";

export default function RegisterPage(){
  const router = useRouter();
  const [mode, setMode] = React.useState("signin"); // "signin" | "signup"

  const { signin, loading: loadingIn } = useSignIn();
  const { signup, loading: loadingUp } = useSignUp();
  const loading = loadingIn || loadingUp;

  async function doSignin(form, setError){
    const r = await signin(form);
    if (!r.ok) { setError(String(r.error)); return; }
    // เข้าสู่ระบบสำเร็จ → ไปหน้า product_data (หรือหน้าอื่นที่คุณต้องการ)
    router.push("/product_data");
  }

  async function doSignup(form, setError){
    const r = await signup(form);
    if (!r.ok) { setError(String(r.error)); return; }
    // สมัครสำเร็จ → กลับไปหน้าเข้าสู่ระบบ
    setMode("signin");
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="row" style={{justifyContent:"center", gap:8}}>
        <Button variant={mode==="signin" ? "primary" : "ghost"} onClick={()=>setMode("signin")}>เข้าสู่ระบบ</Button>
        <Button variant={mode==="signup" ? "primary" : "ghost"} onClick={()=>setMode("signup")}>สมัครสมาชิก</Button>
      </div>

      {mode === "signin" ? (
        <SignInForm onSubmit={doSignin} loading={loading} />
      ) : (
        <SignUpForm onSubmit={doSignup} loading={loading} />
      )}
    </div>
  );
}
