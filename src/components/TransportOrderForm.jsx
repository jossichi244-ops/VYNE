// =======================
// TransportOrderForm_Web3.jsx (Refactored)
// =======================

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../constants/api";
import { z } from "zod"; // ⭐ VALIDATE ĐẲNG CẤP

import {
  Zap,
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
  Copy,
} from "lucide-react";

import styles from "../assets/styles/TransportOrderForm.scss";

// =======================
// ZOD VALIDATION SCHEMA
// =======================
const cargoSchema = z.object({
  description: z.string().min(3, "Mô tả phải ≥ 3 ký tự"),
  weight_kg: z.string().regex(/^\d+(\.\d+)?$/, "Chỉ nhập số"),
  volume_cbm: z.string().optional(),
  customs_hs_code: z.string().optional(),
  packaging_type: z.enum(["container", "pallet", "drum", "bulk", "other"]),
  is_dangerous_goods: z.boolean(),
  un_class_number: z.string().optional(),
  msds_document_cid: z.string().optional(),
});

// =======================
// Form Input Component ✨
// =======================
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  full,
}) => (
  <div className={`${styles.inputGroup} ${full ? styles.fullWidth : ""}`}>
    <label className={styles.label}>
      {label} {required && <span>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={label}
      className={styles.input}
      autoComplete="off"
    />
  </div>
);

// =======================
// MAIN COMPONENT
// =======================
export default function TransportOrderForm({ token, senderWallet }) {
  const [toWallet, setToWallet] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cargo, setCargo] = useState({
    description: "",
    weight_kg: "",
    volume_cbm: "",
    customs_hs_code: "",
    is_dangerous_goods: false,
    packaging_type: "container",
    un_class_number: "",
    msds_document_cid: "",
  });

  const [deviceInfo, setDeviceInfo] = useState({
    ip_address: "",
    user_agent: navigator.userAgent,
  });

  const [location, setLocation] = useState(null);

  // =======================
  // GET IP 🛰️
  // =======================
  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((res) => setDeviceInfo((p) => ({ ...p, ip_address: res.data.ip })));
  }, []);

  const fetchLocation = () =>
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Không thể lấy GPS. Hãy bật định vị.")
    );

  const handleUpload = (e) => setImages([...e.target.files]);

  // =======================
  // SUBMIT FORM 🚀
  // =======================
  const submit = async (e) => {
    e.preventDefault();

    const check = cargoSchema.safeParse(cargo);
    if (!check.success)
      return alert("❌ Lỗi: " + check.error.issues[0].message);

    setIsSubmitting(true);
    const fd = new FormData();

    fd.append("from_wallet", senderWallet);
    fd.append("to_wallet", toWallet);

    Object.entries(cargo).forEach(([k, v]) =>
      fd.append(`cargo[${k}]`, v ?? "")
    );

    fd.append("device_info[user_agent]", deviceInfo.user_agent);
    if (deviceInfo.ip_address)
      fd.append("device_info[ip_address]", deviceInfo.ip_address);
    if (location) {
      fd.append("location[lat]", location.lat);
      fd.append("location[lng]", location.lng);
    }

    fd.append("token_used", "0x0000000000000000000000000000000000000000");
    fd.append("amount_usd", 0);

    images.forEach((img) => fd.append("images", img));

    try {
      const res = await axios.post(`${API_BASE}/api/transport-orders`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🎉 Order đã tạo thành công!");
      console.log(res.data);
    } catch (err) {
      alert("⚠ Lỗi: " + (err.response?.data?.message || "Server error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // =======================
  // UI RENDER
  // =======================
  return (
    <form onSubmit={submit} className={styles.orderFormContainer}>
      <header className={styles.header}>
        <Zap size={26} /> <h2>Tạo Hợp đồng vận chuyển</h2>
      </header>

      {/* BLOCK 1 — WALLET */}
      <section className={styles.formSection}>
        <h3>
          <DollarSign size={18} /> Giao dịch
        </h3>

        <Input label="Ví gửi" value={senderWallet} full disabled />
        <Input
          label="Ví nhận"
          value={toWallet}
          onChange={(e) => setToWallet(e.target.value)}
          required
        />
      </section>

      {/* BLOCK 2 — CARGO */}
      <section className={styles.formSection}>
        <h3>
          <Package size={18} /> Cargo
        </h3>

        <Input
          full
          label="Mô tả"
          value={cargo.description}
          onChange={(e) => setCargo({ ...cargo, description: e.target.value })}
        />
        <Input
          label="Cân nặng (KG)"
          value={cargo.weight_kg}
          onChange={(e) => setCargo({ ...cargo, weight_kg: e.target.value })}
        />
        <Input
          label="Thể tích (CBM)"
          value={cargo.volume_cbm}
          onChange={(e) => setCargo({ ...cargo, volume_cbm: e.target.value })}
        />

        <label>Loại bao bì</label>
        <select
          className={styles.select}
          value={cargo.packaging_type}
          onChange={(e) =>
            setCargo({ ...cargo, packaging_type: e.target.value })
          }>
          <option value="container">Container</option>
          <option value="pallet">Pallet</option>
          <option value="drum">Drum</option>
          <option value="bulk">Rời</option>
          <option value="other">Khác</option>
        </select>

        {/* Dangerous Goods */}
        <h4>
          <AlertTriangle size={14} /> Hàng nguy hiểm
        </h4>
        <select
          value={cargo.is_dangerous_goods}
          onChange={(e) =>
            setCargo({
              ...cargo,
              is_dangerous_goods: e.target.value === "true",
            })
          }>
          <option value="false">Không</option>
          <option value="true">Có</option>
        </select>

        {cargo.is_dangerous_goods && (
          <>
            <Input
              label="UN Number"
              value={cargo.un_class_number}
              onChange={(e) =>
                setCargo({ ...cargo, un_class_number: e.target.value })
              }
            />
            <Input
              full
              label="MSDS CID"
              value={cargo.msds_document_cid}
              onChange={(e) =>
                setCargo({ ...cargo, msds_document_cid: e.target.value })
              }
            />
          </>
        )}
      </section>

      {/* BLOCK 3 — PROOF */}
      <section className={styles.formSection}>
        <h3>
          <Copy size={18} /> Proof of Pickup
        </h3>

        <input type="file" accept="image/*" multiple onChange={handleUpload} />
        {images.length > 0 && <p>📸 {images.length} hình đã chọn</p>}

        {/* LOCATION */}
        <button
          type="button"
          onClick={fetchLocation}
          className={styles.locationButton}>
          {location ? "Lấy lại GPS" : "Lấy GPS hiện tại"}
        </button>
        {location && (
          <p>
            Lat {location.lat} — Lng {location.lng}
          </p>
        )}

        {/* Device info */}
        <h4>
          <Clock size={14} /> Device Info
        </h4>
        <p>IP: {deviceInfo.ip_address || "đang lấy..."}</p>
        <p>UserAgent: {deviceInfo.user_agent.slice(0, 40)}...</p>
      </section>

      <button className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? "⏳ Đang xử lý..." : "🚀 TẠO HỢP ĐỒNG"}
      </button>
    </form>
  );
}
