"use client";
import Button from "../../object/button.jsx";

// helper ปลอดภัย ๆ
function ownerToText(name) {
  if (!name) return "-";
  if (typeof name === "string") return name;
  if (typeof name === "object") {
    if (name.text) return name.text;
    const s = [name.fname, name.lname].filter(Boolean).join(" ");
    return s || "-";
  }
  return "-";
}

function safeImage(url) {
  if (typeof url !== "string") return null;
  // โชว์เฉพาะลิงก์ http/https เท่านั้น กัน /00000
  return /^https?:\/\//i.test(url) ? url : null;
}

export default function ProductTable({ items, onEdit, onDelete }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Created</th>
            <th>Store</th>
            <th>Owner</th>
            <th style={{ textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items?.length ? (
            items.map((p) => {
              const img = safeImage(p.image);
              return (
                <tr key={p.id}>
                  <td><span className="badge">{p.id}</span></td>
                  <td>{img ? <img src={img} alt={p.product_name} style={{ width: 50, height: 50, objectFit: "contain" }} /> : "-"}</td>
                  <td>{p.product_name}</td>
                  <td>{p.category || "-"}</td>
                  <td>{Number(p.price ?? 0).toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{p.created ? String(p.created).slice(0, 10) : "-"}</td>
                  <td><span className="badge">{p.store_name || "-"}</span></td>
                  <td>{ownerToText(p.name)}</td>
                  <td>
                    <div className="actions">
                      <Button onClick={() => onEdit(p)}>แก้ไข</Button>
                      <Button variant="danger" onClick={() => onDelete(p)}>ลบ</Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            // ให้ colSpan เท่ากับจำนวนคอลัมน์จริง (10)
            <tr><td colSpan={10} style={{ textAlign: "center", color: "#9aa0a6" }}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
