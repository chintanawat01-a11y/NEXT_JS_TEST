
"use client";
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <img src="/logo.svg" alt="logo"/>
          <span>Final Store</span>
        </div>
        <div className="nav-actions">
          <a className="btn btn-primary" href="/product_data">Product</a>
        </div>
      </div>
    </div>
  );
}
