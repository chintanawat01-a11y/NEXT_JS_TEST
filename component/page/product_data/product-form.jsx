
"use client";
import React from "react";
import Button from "../../object/button.jsx";

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = React.useState({
    store_id: initial?.store_id ?? "",
    product_name: initial?.product_name ?? "",
    product_detail: initial?.product_detail ?? "",
    product_price: initial?.price ?? initial?.product_price ?? "",
    product_date: (initial?.product_date || "").slice ? (initial?.product_date || "").slice(0, 10) : (initial?.product_date ?? ""),
    product_category: initial?.category ?? initial?.product_category ?? "",
    product_stock: initial?.stock ?? initial?.product_stock ?? "",
    product_url_img: initial?.image ?? initial?.product_url_img ?? ""
  });

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  return (
    <div className="card grid grid-2">
      <div>
        <label>Store ID</label>
        <input className="input mt-2" value={form.store_id} onChange={(e) => set("store_id", e.target.value)} />
      </div>
      <div>
        <label>Product Name</label>
        <input className="input mt-2" value={form.product_name} onChange={(e) => set("product_name", e.target.value)} />
      </div>
      <div>
        <label>Detail</label>
        <input className="input mt-2" value={form.product_detail} onChange={(e) => set("product_detail", e.target.value)} />
      </div>
      <div>
        <label>Price</label>
        <input className="input mt-2" type="number" step="0.01" value={form.product_price} onChange={(e) => set("product_price", e.target.value)} />
      </div>
      <div>
        <label>Date</label>
        <input className="input mt-2" type="date" value={form.product_date} onChange={(e) => set("product_date", e.target.value)} />
      </div>
      <div>
        <label>Category</label>
        <input className="input mt-2" value={form.product_category} onChange={(e) => set("product_category", e.target.value)} />
      </div>
      <div>
        <label>Stock</label>
        <input className="input mt-2" type="number" value={form.product_stock} onChange={(e) => set("product_stock", e.target.value)} />
      </div>
      <div>
        <label>Image URL</label>
        <input className="input mt-2" value={form.product_url_img} onChange={(e) => set("product_url_img", e.target.value)} />
      </div>
      <div className="row">
        <Button onClick={onCancel}>ยกเลิก</Button>
        <Button variant="primary" onClick={() => onSubmit(form)}>บันทึก</Button>
      </div>
    </div>
  );
}
