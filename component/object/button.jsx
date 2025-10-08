
"use client";
export default function Button({children, variant="default", ...props}){
  const cls = ["btn"];
  if (variant === "primary") cls.push("btn-primary");
  if (variant === "danger") cls.push("btn-danger");
  return <button className={cls.join(" ")} {...props}>{children}</button>;
}
