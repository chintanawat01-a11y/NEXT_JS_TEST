"use client";
import React from "react";
import SearchInput from "../../component/object/search-input.jsx";
import Button from "../../component/object/button.jsx";
import ProductTable from "../../component/page/product_data/table-full.jsx";
import ProductForm from "../../component/page/product_data/product-form.jsx";
import api_handler from "../../hooks/api-handler.js";
import { reducer, initialState } from "./reducer.jsx";

export default function ProductDataPage(){
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [loading, setLoading] = React.useState(false);

  const list = React.useMemo(()=>{
    if (!state.query) return state.list;
    const q = state.query.toLowerCase();
    return state.list.filter(p =>
      p.id?.toLowerCase().includes(q) ||
      p.product_name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [state.list, state.query]);

  // YYYY-MM-DD ของ "วันนี้" สำหรับเช็ควันที่
  const todayStr = React.useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  function toNull(v){ return (v === "" || v === undefined) ? null : v; }

  async function load(){
    setLoading(true);
    try{
      const res = await api_handler("get", "/api/module/product/", {});
      const data = res?.data?.results ?? [];
      dispatch({ type: "set-list", payload: data });
    } finally { setLoading(false); }
  }
  React.useEffect(()=>{ load(); }, []);

  // -------------------------
  // CREATE: ตรวจที่นี่ แล้วส่งอาเรย์ 8 ช่อง
  // -------------------------
  async function handleCreate(form){
    const errs = [];

    // normalize เบื้องต้น
    const store_id = String(form.store_id || "").trim().toLowerCase();
    const product_name = String(form.product_name || "").trim();
    const product_detail = toNull(String(form.product_detail || "").trim());
    const product_category = toNull(String(form.product_category || "").trim());
    const product_url_img = toNull(String(form.product_url_img || "").trim());

    const price = Number(form.product_price);
    const stock = Number(form.product_stock);

    let product_date = String(form.product_date || "").trim();
    if (product_date === "") product_date = null; // เว้นว่างได้

    // กติกา
    if (!store_id) errs.push("กรอก Store ID");
    // ถ้าระบบคุณกำหนดรูปแบบไอดีร้าน ให้เปิดเช็คนี้
    // if (!/^s\d{8}$/.test(store_id)) errs.push("Store ID ต้องเป็น s########");

    if (!product_name) errs.push("กรอกชื่อสินค้า");
    if (!Number.isFinite(price) || price <= 0) errs.push("ราคา (Price) ต้องมากกว่า 0");
    if (!Number.isFinite(stock) || stock < 0) errs.push("สต็อก (Stock) ต้องไม่ติดลบ");

    if (product_date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(product_date)) {
        errs.push("รูปแบบวันที่ต้องเป็น YYYY-MM-DD");
      } else {
        const year = Number(product_date.slice(0,4));
        if (year < 1000) errs.push("ปีของวันที่ต้อง ≥ 1000");
        if (product_date > todayStr) errs.push("วันที่ห้ามมากกว่าวันปัจจุบัน");
      }
    }

    if (errs.length){
      alert(errs.join("\n"));
      return;
    }

    // ประกอบ payload เป็น "อาเรย์ 8 ช่อง" ตาม service ต้องการ
    const payload = [
      store_id,               // 1
      product_name,           // 2
      product_detail,         // 3 (null ได้)
      price,                  // 4
      product_date,           // 5 (null ได้)
      product_category,       // 6 (null ได้)
      stock,                  // 7
      product_url_img         // 8 (null ได้)
    ];

    try{
      // controller ของคุณรองรับ { body: [...] } อยู่แล้ว (req.body?.body || req.body)
      await api_handler("post", "/api/module/product/", { body: payload });
      dispatch({ type: "close-form" });
      await load();
    } catch(e){
      const msg = e?.response?.data?.results || e?.response?.data?.error || e?.message || "Create failed";
      alert(`เพิ่มสินค้าไม่สำเร็จ: ${msg}`);
    }
  }

  // -------------------------
  // UPDATE: ส่งเฉพาะคีย์ที่แก้ และตรวจที่นี่
  // -------------------------
  async function handleEditSave(form, item){
    const errs = [];
    const body = {};

    // เก็บเฉพาะคีย์ที่อนุญาต
    const keep = [
      "product_name",
      "product_detail",
      "product_price",
      "product_date",
      "product_category",
      "product_stock",
      "product_url_img",
    ];

    for (const k of keep){
      let v = form[k];
      if (v === "" || v === undefined || v === null) continue; // ไม่ส่งฟิลด์ว่าง

      // ตรวจเฉพาะฟิลด์ที่มีเงื่อนไข
      if (k === "product_price"){
        const price = Number(v);
        if (!Number.isFinite(price) || price <= 0){
          errs.push("ราคา (Price) ต้องมากกว่า 0");
          continue;
        }
        v = price;
      }
      if (k === "product_stock"){
        const stock = Number(v);
        if (!Number.isFinite(stock) || stock < 0){
          errs.push("สต็อก (Stock) ต้องไม่ติดลบ");
          continue;
        }
        v = stock;
      }
      if (k === "product_date"){
        const dateStr = String(v).trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)){
          errs.push("รูปแบบวันที่ต้องเป็น YYYY-MM-DD");
          continue;
        }
        const year = Number(dateStr.slice(0,4));
        if (year < 1000) { errs.push("ปีของวันที่ต้อง ≥ 1000"); continue; }
        if (dateStr > todayStr) { errs.push("วันที่ห้ามมากกว่าวันปัจจุบัน"); continue; }
        v = dateStr;
      }

      // trim string ทั่วไป
      if (typeof v === "string") v = v.trim();
      if (v === "") continue; // ค่าว่างหลัง trim ไม่ต้องส่ง
      body[k] = v;
    }

    if (errs.length){
      alert(errs.join("\n"));
      return;
    }
    if (Object.keys(body).length === 0){
      alert("ไม่มีฟิลด์ที่แก้ไข");
      return;
    }

    try{
      await api_handler("put", `/api/module/product/${item.id}`, { body });
      dispatch({ type: "close-form" });
      await load();
    } catch(e){
      const msg = e?.response?.data?.results || e?.response?.data?.error || e?.message || "Update failed";
      alert(`อัปเดตไม่สำเร็จ: ${msg}`);
    }
  }

  async function handleDelete(item){
    if (!confirm(`ลบสินค้า ${item.product_name}?`)) return;
    try{
      await api_handler("delete", `/api/module/product/${item.id}`);
      await load();
    } catch(e){
      const msg = e?.response?.data?.results || e?.response?.data?.error || e?.message || "Delete failed";
      alert(`ลบไม่สำเร็จ: ${msg}`);
    }
  }

  return (
    <div className="grid">
      <div className="space-between">
        <h2 style={{margin:0}}>Products</h2>
        <div className="row" style={{minWidth: 360}}>
          <SearchInput
            value={state.query}
            onChange={(v)=>dispatch({type:"set-query", payload:v})}
            placeholder="พิมพ์เพื่อค้นหา..."
          />
          <Button variant="primary" onClick={()=>dispatch({type:"open-create"})}>เพิ่มสินค้า</Button>
        </div>
      </div>

      {state.showForm && (
        <ProductForm
          initial={state.editing}
          onCancel={()=>dispatch({type:"close-form"})}
          onSubmit={(form)=> state.editing ? handleEditSave(form, state.editing) : handleCreate(form)}
        />
      )}

      {loading ? (
        <div className="card">กำลังโหลด...</div>
      ) : (
        <ProductTable
          items={list}
          onEdit={(item)=>dispatch({type:"open-edit", payload:item})}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
