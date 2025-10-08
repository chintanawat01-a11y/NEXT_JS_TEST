// component/object/form-message.jsx
"use client";
export default function FormMessage({ type="info", children }){
  const colors = {
    info:    "#2563eb",
    success: "#059669",
    danger:  "#dc2626",
    warn:    "#d97706"
  };
  return (
    <div className="card" style={{borderLeft:`4px solid ${colors[type]||colors.info}`, padding:"12px"}}>
      <div style={{color:colors[type]||colors.info, fontSize:13}}>{children}</div>
    </div>
  );
}
