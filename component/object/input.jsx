// component/object/input.jsx
"use client";
export default function Input({ label, type="text", value, onChange, ...rest }){
  return (
    <label style={{display:"block"}}>
      {label && <div style={{fontSize:12, color:"#6b7280"}}>{label}</div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="input mt-2"
        {...rest}
      />
    </label>
  );
}
