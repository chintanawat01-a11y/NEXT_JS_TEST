// component/page/register/signin-form.jsx
"use client";
import React from "react";
import Input from "../../object/input.jsx";
import Button from "../../object/button.jsx";
import FormMessage from "../../object/form-message.jsx";

export default function SignInForm({ onSubmit, loading }){
  const [form, setForm] = React.useState({ username:"", password:"" });
  const [error, setError] = React.useState("");

  function set(k, v){ setForm(prev => ({...prev, [k]: v})); }

  async function handle(){
    setError("");
    if (!form.username.trim() || !form.password) {
      setError("กรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    await onSubmit(form, setError);
  }

  return (
    <div className="card" style={{maxWidth:440}}>
      <h3 style={{marginTop:0}}>เข้าสู่ระบบ</h3>
      {error && <FormMessage type="danger">{error}</FormMessage>}
      <div className="grid">
        <Input label="ชื่อผู้ใช้" value={form.username} onChange={e=>set("username", e.target.value)} />
        <Input label="รหัสผ่าน" type="password" value={form.password} onChange={e=>set("password", e.target.value)} />
      </div>
      <div className="row" style={{marginTop:12}}>
        <Button variant="primary" onClick={handle} disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </div>
    </div>
  );
}
