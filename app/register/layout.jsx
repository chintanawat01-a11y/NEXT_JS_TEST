
// app/register/layout.jsx
export const metadata = { title: "Register / Sign In" };

export default function RegisterLayout({ children }){
  return (
    <div style={{minHeight:"100dvh", display:"grid", placeItems:"center", padding:"2rem"}}>
      <div style={{width:"100%", maxWidth:960}}>
        {children}
      </div>
    </div>
  );
}
