import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { API_BASE } from "../constants/api";
import {
  Zap,
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
  Copy,
} from "lucide-react";

import styles from "../assets/styles/TransportOrderForm.scss";

const cargoSchema = z.object({
  description: z.string().min(3, "Mô tả phải ít nhất 3 ký tự"),
  weight_kg: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Chỉ nhập số cho Cân nặng (KG)")
    .nonempty("Cân nặng là bắt buộc"),
  volume_cbm: z
    .string()
    .regex(/^\d*(\.\d+)?$/, "Chỉ nhập số cho Thể tích (CBM)")
    .optional()
    .nullable(),
  cargo_value_usd: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Chỉ nhập số cho Giá trị (USD)")
    .nonempty("Giá trị hàng hóa là bắt buộc"),
  customs_hs_code: z.string().optional().nullable(),
  packaging_type: z.enum(["container", "pallet", "drum", "bulk", "other"], {
    required_error: "Vui lòng chọn Loại bao bì",
  }),
  is_dangerous_goods: z.boolean(),
  // Các trường con cho hàng nguy hiểm:
  un_class_number: z.string().optional().nullable(),
  msds_document_cid: z.string().optional().nullable(),
});

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  full,
  disabled = false,
  placeholder,
}) => (
  <div className={`${styles.inputGroup} ${full ? styles.fullWidth : ""}`}>
    <label className={styles.label}>
      {label} {required && <span className={styles.required}>*</span>}
    </label>
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder || label}
      className={styles.input}
      autoComplete="off"
      disabled={disabled}
    />
  </div>
);

const Select = ({ label, value, onChange, options, required, full }) => (
  <div className={`${styles.inputGroup} ${full ? styles.fullWidth : ""}`}>
    <label className={styles.label}>
      {label} {required && <span className={styles.required}>*</span>}
    </label>
    <select className={styles.select} value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const DangerousGoodsFields = ({ cargo, handleCargoChange }) => (
  <>
    <h4>
      <AlertTriangle size={14} /> Thông tin chi tiết Hàng nguy hiểm
    </h4>
    <Input
      label="UN Number / Class"
      placeholder="VD: UN1203 hoặc Class 3"
      value={cargo.un_class_number || ""}
      onChange={handleCargoChange("un_class_number")}
    />
    <Input
      full
      label="MSDS CID (Tài liệu an toàn)"
      placeholder="Mã hash IPFS/CID của tài liệu MSDS"
      value={cargo.msds_document_cid || ""}
      onChange={handleCargoChange("msds_document_cid")}
    />
    <Select
      label="Trạng thái xác minh MSDS"
      value={cargo.msds_verification_status || "not_required"}
      onChange={handleCargoChange("msds_verification_status")}
      options={[
        { value: "not_required", label: "Không yêu cầu" },
        { value: "pending", label: "Đang chờ xác minh" },
        { value: "verified", label: "Đã xác minh" },
        { value: "rejected", label: "Bị từ chối" },
      ]}
    />
    {/* Có thể thêm các trường khác như: proper_shipping_name, hazard_class, packing_group... nếu cần thiết cho giao diện nhập liệu */}
  </>
);

// =======================
// 🚀 Main Component TransportOrderForm
// =======================
export default function TransportOrderForm({ token, senderWallet }) {
  const [toWallet, setToWallet] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [cargo, setCargo] = useState({
    description: "",
    weight_kg: "",
    volume_cbm: "",
    cargo_value_usd: "", // NEW: Thêm giá trị hàng hóa
    customs_hs_code: "",
    is_dangerous_goods: false,
    packaging_type: "container",
    un_class_number: "",
    msds_document_cid: "",
    msds_verification_status: "not_required", // NEW: Thêm trạng thái xác minh MSDS
  });

  const [deviceInfo, setDeviceInfo] = useState({
    ip_address: "",
    user_agent: navigator.userAgent,
  });

  const [location, setLocation] = useState(null);

  const handleCargoChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "is_dangerous_goods") {
      // Chuyển string "true"/"false" sang boolean
      value = value === "true";
      // Reset các trường liên quan nếu chuyển sang 'Không'
      if (!value) {
        setCargo((p) => ({
          ...p,
          is_dangerous_goods: value,
          un_class_number: "",
          msds_document_cid: "",
          msds_verification_status: "not_required",
        }));
        return;
      }
    }
    setCargo((p) => ({ ...p, [field]: value }));
  };

  // --- Logic API & Location ---
  useEffect(() => {
    // Lấy IP
    axios
      .get("https://api.ipify.org?format=json")
      .then((res) => setDeviceInfo((p) => ({ ...p, ip_address: res.data.ip })))
      .catch(console.error);
  }, []);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.error(err);
        alert("Không thể lấy GPS. Hãy bật định vị và cấp quyền.");
      }
    );
  };
  // --- END Logic API & Location ---

  const handleUpload = (e) => setImages([...e.target.files]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Validate Zod
    const validationData = {
      ...cargo,
      // Đảm bảo các trường số là string khi validate
      weight_kg: cargo.weight_kg.toString(),
      cargo_value_usd: cargo.cargo_value_usd.toString(),
      // volume_cbm có thể null/undefined nên không cần chuyển string
    };

    const check = cargoSchema.safeParse(validationData);
    if (!check.success) {
      const firstError = check.error.issues[0];
      return setError(
        `❌ Lỗi [${firstError.path.join(".")}] : ${firstError.message}`
      );
    }

    // 2. Chuẩn bị FormData
    setIsSubmitting(true);
    const fd = new FormData();

    fd.append("from_wallet", senderWallet);
    fd.append("to_wallet", toWallet);

    // Chuyển các giá trị Cargo sang FormData
    Object.entries(cargo).forEach(([k, v]) => {
      // Bỏ qua các trường null/undefined và các trường phụ chỉ dùng cho UI (nếu có)
      if (v !== null && v !== undefined) {
        fd.append(`cargo[${k}]`, v.toString());
      }
    });

    // Thêm các thông tin bắt buộc khác
    fd.append("device_info[user_agent]", deviceInfo.user_agent);
    if (deviceInfo.ip_address)
      fd.append("device_info[ip_address]", deviceInfo.ip_address);
    if (location) {
      fd.append("location[lat]", location.lat);
      fd.append("location[lng]", location.lng);
    }

    // Payment info (Giá trị mặc định theo yêu cầu của schema/api)
    fd.append("token_used", "0x0000000000000000000000000000000000000000");
    fd.append("amount_usd", "0"); // Chi phí vận chuyển ban đầu là 0, sẽ được cập nhật sau.

    // Thêm các ảnh Proof of Pickup
    images.forEach((img) => fd.append("images", img));

    // 3. Gọi API
    try {
      const res = await axios.post(`${API_BASE}/api/transport-orders`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`🎉 Order đã tạo thành công! Mã đơn hàng: ${res.data.order_ref}`);
      console.log(res.data);
    } catch (err) {
      setError(`⚠ Lỗi: ${err.response?.data?.message || "Server error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className={styles.orderFormContainer}>
      <header className={styles.header}>
        <Zap size={26} /> <h2>Tạo Hợp đồng vận chuyển</h2>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* BLOCK 1 — WALLET */}
      <section className={styles.formSection}>
        <h3>
          <DollarSign size={18} /> Giao dịch Web3
        </h3>
        <Input
          label="Ví gửi (From Wallet)"
          value={senderWallet}
          full
          disabled
        />
        <Input
          label="Ví nhận (To Wallet)"
          placeholder="Địa chỉ ví người vận chuyển/người nhận (0x...)"
          value={toWallet}
          onChange={(e) => setToWallet(e.target.value)}
          required
        />
      </section>

      <hr className={styles.separator} />

      {/* BLOCK 2 — CARGO */}
      <section className={styles.formSection}>
        <h3>
          <Package size={18} /> Chi tiết Hàng hóa
        </h3>

        {/* Hàng hóa */}
        <Input
          full
          label="Mô tả hàng hóa"
          placeholder="VD: 20 thùng sách giáo khoa"
          value={cargo.description}
          onChange={handleCargoChange("description")}
          required
        />
        <Input
          label="Cân nặng (KG)"
          placeholder="1000"
          value={cargo.weight_kg}
          onChange={handleCargoChange("weight_kg")}
          required
        />
        <Input
          label="Giá trị hàng hóa (USD)"
          placeholder="Dùng để tính deposit, VD: 5000.00"
          value={cargo.cargo_value_usd}
          onChange={handleCargoChange("cargo_value_usd")}
          required
        />
        <Input
          label="Thể tích (CBM)"
          placeholder="25.5"
          value={cargo.volume_cbm}
          onChange={handleCargoChange("volume_cbm")}
        />
        <Input
          label="Mã HS Hải quan"
          value={cargo.customs_hs_code}
          onChange={handleCargoChange("customs_hs_code")}
        />

        <Select
          label="Loại bao bì chính"
          value={cargo.packaging_type}
          onChange={handleCargoChange("packaging_type")}
          options={[
            { value: "container", label: "Container" },
            { value: "pallet", label: "Pallet" },
            { value: "drum", label: "Drum" },
            { value: "bulk", label: "Rời (Bulk)" },
            { value: "other", label: "Khác" },
          ]}
          required
        />

        {/* Dangerous Goods Toggle */}
        <Select
          label="Hàng nguy hiểm (Dangerous Goods)"
          value={cargo.is_dangerous_goods.toString()}
          onChange={handleCargoChange("is_dangerous_goods")}
          options={[
            { value: "false", label: "Không" },
            { value: "true", label: "Có (Cần khai báo chi tiết)" },
          ]}
          full
        />

        {/* Conditional Fields */}
        {cargo.is_dangerous_goods && (
          <DangerousGoodsFields
            cargo={cargo}
            handleCargoChange={handleCargoChange}
          />
        )}
      </section>

      <hr className={styles.separator} />

      {/* BLOCK 3 — PROOF OF PICKUP */}
      <section className={styles.formSection}>
        <h3>
          <Copy size={18} /> Bằng chứng lấy hàng (Pickup Proof)
        </h3>

        {/* Upload Images */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Ảnh chụp tại điểm lấy hàng *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
          />
          {images.length > 0 && (
            <p className={styles.infoText}>📸 {images.length} hình đã chọn</p>
          )}
          {images.length === 0 && (
            <p className={styles.requiredText}>Vui lòng chọn ít nhất 1 ảnh.</p>
          )}
        </div>

        {/* Location */}
        <button
          type="button"
          onClick={fetchLocation}
          className={styles.locationButton}>
          {location ? "Cập nhật GPS" : "Lấy GPS hiện tại"}
        </button>
        {location && (
          <p className={styles.infoText}>
            📍 Tọa độ: Lat **{location.lat.toFixed(5)}** — Lng **
            {location.lng.toFixed(5)}**
          </p>
        )}

        {/* Device info (Tự động) */}
        <h4 className={styles.subHeading}>
          <Clock size={14} /> Thông tin Thiết bị & Thời gian
        </h4>
        <p className={styles.infoText}>
          IP: {deviceInfo.ip_address || "đang lấy..."}
        </p>
        <p className={styles.infoText}>
          UserAgent: {deviceInfo.user_agent.slice(0, 50)}...
        </p>
      </section>

      <button
        className={styles.submitButton}
        disabled={isSubmitting || images.length === 0}>
        {isSubmitting ? "⏳ Đang xử lý..." : "🚀 TẠO HỢP ĐỒNG"}
      </button>

      <p className={styles.disclaimer}>
        * Hợp đồng sẽ ở trạng thái **pending_payment** sau khi tạo.
      </p>
    </form>
  );
}

// Giả định API_BASE được truyền vào từ môi trường hoặc component cha
// Ví dụ: <TransportOrderForm token={myToken} senderWallet={myWallet} API_BASE="https://api.mylogistics.com" />
