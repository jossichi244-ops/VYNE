// File: src/components/TransportOrderForm_Web3.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../constants/api";
import {
  Copy,
  DollarSign,
  Package,
  AlertTriangle,
  Link,
  Clock,
  MapPin,
  Zap,
} from "lucide-react";

// 💡 Import SCSS Module
import styles from "../assets/styles/TransportOrderForm.scss";

const TransportOrderForm = ({ token, senderWallet }) => {
  const [toWallet, setToWallet] = useState("");
  const [cargo, setCargo] = useState({
    description: "",
    weight_kg: "",
    volume_cbm: "",
    is_dangerous_goods: false,
    un_class_number: "",
    msds_document_cid: "",
    customs_hs_code: "",
    packaging_type: "container",
  });

  const [images, setImages] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({
    user_agent: navigator.userAgent,
    ip_address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState(null); // State để lưu trữ GPS

  // Lấy IP và User Agent
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setDeviceInfo((prev) => ({ ...prev, ip_address: res.data.ip }));
      } catch (err) {
        console.warn("Không lấy được IP:", err);
      }
    };
    fetchIP();
  }, []);

  // Lấy Vị trí GPS (Tùy chọn)
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          alert("Lấy vị trí thành công.");
        },
        (error) => {
          console.error("Lỗi lấy vị trí GPS:", error);
          alert("Không lấy được vị trí GPS. Vui lòng bật Location Services.");
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ Geolocation.");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("from_wallet", senderWallet);
    formData.append("to_wallet", toWallet);

    // Gửi từng property của cargo
    Object.keys(cargo).forEach((key) => {
      // Chuyển boolean thành string
      const value =
        typeof cargo[key] === "boolean" ? String(cargo[key]) : cargo[key];
      if (value !== "" && value !== "false") {
        // Loại bỏ giá trị rỗng/false không cần thiết
        formData.append(`cargo[${key}]`, value);
      }
    });

    // Gửi device_info
    formData.append("device_info[user_agent]", deviceInfo.user_agent);
    if (deviceInfo.ip_address) {
      formData.append("device_info[ip_address]", deviceInfo.ip_address);
    }

    // Gửi location
    if (location) {
      formData.append("location[lat]", location.lat);
      formData.append("location[lng]", location.lng);
    } else {
      formData.append("location", ""); // Gửi rỗng nếu không có
    }

    // Hardcoded giá trị mặc định cho việc tạo Order
    formData.append("token_used", "0x0000000000000000000000000000000000000000");
    formData.append("amount_usd", 0);

    // Thêm file ảnh
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(
        `${API_BASE}/api/transport-orders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Axios tự set Content-Type: multipart/form-data với boundary
          },
        }
      );

      alert("✅ Giao dịch (Order) được ghi nhận thành công!");
      console.log("Order Creation Response:", res.data);
      // Reset form sau khi submit thành công
      // setToWallet("");
      // setCargo({ ...initialCargoState });
      // setImages([]);
    } catch (err) {
      console.error("❌ Lỗi tạo đơn:", err.response?.data || err.message);
      alert(
        "⚠️ Lỗi tạo đơn hàng: " +
          (err.response?.data?.message || "Lỗi hệ thống")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component cho Input field
  const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    isFull = false,
  }) => (
    <div className={`${styles.inputGroup} ${isFull ? styles.fullWidth : ""}`}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={styles.input}
      />
    </div>
  );

  return (
    <form onSubmit={submitOrder} className={styles.orderFormContainer}>
      <header className={styles.header}>
        <Zap className={styles.icon} size={28} />
        <h2 className={styles.h2}>Tạo Hợp đồng Vận chuyển Mới</h2>
        <p className={styles.subtext}>
          Khởi tạo giao dịch On-Chain cho lô hàng.
        </p>
      </header>

      {/* --- BLOCK 1: WALLET VÀ GIAO DỊCH (TRANSACTION) --- */}
      <section className={`${styles.formSection} ${styles.glassSection}`}>
        <h3 className={styles.sectionHeader}>
          <DollarSign size={20} /> Thông tin Giao dịch
        </h3>
        <div className={styles.grid2Cols}>
          <FormInput
            label="Ví Gửi (From Wallet)"
            name="senderWallet"
            value={senderWallet}
            placeholder="0x..."
            required={true}
            isFull={true}
            type="text"
            onChange={() => {}} // Read-only
          />
          <FormInput
            label="Ví Nhận (To Wallet)"
            name="toWallet"
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value)}
            placeholder="0x..."
            required={true}
          />
          <FormInput
            label="Token (Contract Address)"
            name="tokenUsed"
            value="0x00... (Mặc định)"
            placeholder="0x..."
            type="text"
            isFull={false}
            onChange={() => {}} // Read-only (cho mockup)
          />
          <FormInput
            label="Amount (USD) - Deposit"
            name="amountUsd"
            value="0 (Mặc định)"
            placeholder="USD"
            type="number"
            isFull={false}
            onChange={() => {}} // Read-only (cho mockup)
          />
        </div>
      </section>

      {/* --- BLOCK 2: CARGO VÀ THÔNG SỐ VẬN TẢI --- */}
      <section className={`${styles.formSection} ${styles.glassSection}`}>
        <h3 className={styles.sectionHeader}>
          <Package size={20} /> Thông số Lô hàng (Cargo)
        </h3>
        <div className={styles.grid2Cols}>
          <FormInput
            label="Mô tả"
            name="description"
            value={cargo.description}
            onChange={(e) =>
              setCargo({ ...cargo, description: e.target.value })
            }
            placeholder="Tên sản phẩm, số lượng..."
            required={true}
            isFull={true}
          />
          <FormInput
            label="Cân nặng (Kg)"
            name="weight_kg"
            type="number"
            value={cargo.weight_kg}
            onChange={(e) => setCargo({ ...cargo, weight_kg: e.target.value })}
            placeholder="Ví dụ: 500"
            required={true}
          />
          <FormInput
            label="Thể tích (CBM)"
            name="volume_cbm"
            type="number"
            value={cargo.volume_cbm}
            onChange={(e) => setCargo({ ...cargo, volume_cbm: e.target.value })}
            placeholder="Ví dụ: 10.5"
          />
        </div>

        <div className={styles.subGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Loại Bao bì</label>
            <select
              className={styles.select}
              value={cargo.packaging_type}
              onChange={(e) =>
                setCargo({ ...cargo, packaging_type: e.target.value })
              }>
              <option value="container">Container</option>
              <option value="pallet">Pallet</option>
              <option value="drum">Thùng</option>
              <option value="bulk">Rời</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <FormInput
            label="Mã HS Hải quan"
            name="customs_hs_code"
            value={cargo.customs_hs_code}
            onChange={(e) =>
              setCargo({ ...cargo, customs_hs_code: e.target.value })
            }
            placeholder="Ví dụ: 8703.23"
          />
        </div>

        {/* HÀNG NGUY HIỂM */}
        <div
          className={`${styles.dangerousGoodsGroup} ${
            cargo.is_dangerous_goods ? styles.active : ""
          }`}>
          <h4 className={styles.h4}>
            <AlertTriangle size={16} /> Hàng nguy hiểm (Dangerous Goods)
          </h4>
          <div className={styles.grid2Cols}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Có phải hàng nguy hiểm?</label>
              <select
                className={styles.select}
                value={String(cargo.is_dangerous_goods)}
                onChange={(e) =>
                  setCargo({
                    ...cargo,
                    is_dangerous_goods: e.target.value === "true",
                  })
                }>
                <option value="false">Không (NO)</option>
                <option value="true">Có (YES)</option>
              </select>
            </div>
            {cargo.is_dangerous_goods && (
              <FormInput
                label="UN Class Number"
                name="un_class_number"
                value={cargo.un_class_number}
                onChange={(e) =>
                  setCargo({ ...cargo, un_class_number: e.target.value })
                }
                placeholder="Ví dụ: 1263"
                required={cargo.is_dangerous_goods}
              />
            )}
          </div>
          {cargo.is_dangerous_goods && (
            <FormInput
              label="MSDS Document CID (IPFS)"
              name="msds_document_cid"
              value={cargo.msds_document_cid}
              onChange={(e) =>
                setCargo({ ...cargo, msds_document_cid: e.target.value })
              }
              placeholder="Qm..."
              isFull={true}
            />
          )}
        </div>
      </section>

      {/* --- BLOCK 3: BẰNG CHỨNG (PROOF OF PICKUP) --- */}
      <section className={`${styles.formSection} ${styles.glassSection}`}>
        <h3 className={styles.sectionHeader}>
          <Copy size={20} /> Bằng chứng Nhận hàng (Proof of Pickup)
        </h3>

        {/* Ảnh Proof */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Link size={14} /> Ảnh Lô hàng (Images)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
            required
          />
          {images.length > 0 && (
            <p className={styles.fileCount}>Đã chọn: {images.length} ảnh</p>
          )}
        </div>

        {/* GPS Location */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <MapPin size={14} /> Vị trí GPS (Geolocation)
          </label>
          <div className={styles.locationContainer}>
            <button
              type="button"
              onClick={fetchLocation}
              className={styles.locationButton}>
              {location ? "Lấy lại Vị trí GPS" : "Lấy Vị trí GPS Hiện tại"}
            </button>
            {location && (
              <p className={styles.locationInfo}>
                Vị trí đã ghi nhận: Lat **{location.lat}**, Lng **{location.lng}
                **
              </p>
            )}
          </div>
        </div>

        {/* Device Info */}
        <div className={styles.deviceInfoContainer}>
          <h4 className={styles.h4}>
            <Clock size={16} /> Dữ liệu Thiết bị
          </h4>
          <div className={styles.deviceRow}>
            <span>IP Address:</span>
            <span className={styles.deviceValue}>
              {deviceInfo.ip_address || "Đang lấy..."}
            </span>
          </div>
          <div className={styles.deviceRow}>
            <span>User Agent:</span>
            <span className={styles.deviceValue}>
              {deviceInfo.user_agent.substring(0, 50) + "..."}
            </span>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}>
        {isSubmitting
          ? "Đang Ghi nhận Hợp đồng..."
          : "🔒 TẠO HỢP ĐỒNG VẬN CHUYỂN"}
      </button>
    </form>
  );
};

export default TransportOrderForm;
