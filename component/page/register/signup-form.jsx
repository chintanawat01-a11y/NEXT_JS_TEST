// component/page/register/signup-form.jsx
"use client";
import React from "react";
import Input from "../../object/input.jsx";
import Button from "../../object/button.jsx";
import FormMessage from "../../object/form-message.jsx";

export default function SignUpForm({ onSubmit, loading }){
  const [form, setForm] = React.useState({
    username:"", password:"", email:"", fname:"", lname:"",
    gender:"", phone:""
  });
  const [error, setError] = React.useState("");

  function set(k, v){ setForm(prev => ({...prev, [k]: v})); }

  async function handle(){
    setError("");
    if (!form.username.trim()) return setError("กรอกชื่อผู้ใช้");
    if (!form.password || form.password.length < 6) return setError("รหัสผ่านอย่างน้อย 6 ตัว");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("อีเมลไม่ถูกต้อง");
    await onSubmit(form, setError);
  }

  return (
    <div className="card" style={{maxWidth:560}}>
      <h3 style={{marginTop:0}}>สมัครสมาชิก</h3>
      {error && <FormMessage type="danger">{error}</FormMessage>}
      <div className="grid grid-2">
        <Input label="ชื่อผู้ใช้ *" value={form.username} onChange={e=>set("username", e.target.value)} />
        <Input label="รหัสผ่าน *" type="password" value={form.password} onChange={e=>set("password", e.target.value)} />
        <Input label="อีเมล" value={form.email} onChange={e=>set("email", e.target.value)} />
        <Input label="เบอร์โทร" value={form.phone} onChange={e=>set("phone", e.target.value)} />
        <Input label="ชื่อ" value={form.fname} onChange={e=>set("fname", e.target.value)} />
        <Input label="นามสกุล" value={form.lname} onChange={e=>set("lname", e.target.value)} />
        <label>
          <div style={{fontSize:12, color:"#6b7280"}}>เพศ (M/F/X)</div>
          <input className="input mt-2" value={form.gender} onChange={e=>set("gender", e.target.value)} placeholder="M / F / X" />
        </label>
      </div>
      <div className="row" style={{marginTop:12}}>
        <Button variant="primary" onClick={handle} disabled={loading}>
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </Button>
      </div>
    </div>
  );
}
