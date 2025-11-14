// File: src/components/OrderDetail_Web3.jsx

import React, { useEffect, useState } from "react";
import { getOrderById } from "../services/orderService";
import {
  Copy,
  Link,
  CheckCircle,
  Clock,
  Truck,
  Package,
  DollarSign,
  MapPin,
  AlertTriangle,
  Zap,
  RefreshCw,
} from "lucide-react";
import styles from "./OrderDetail.module.scss";

// Hàm helper để định dạng thời gian
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(dateString).toLocaleString("vi-VN", options);
};

// Hàm helper để hiển thị Hash/Wallet (tối ưu hiển thị)
const truncateHash = (hash, start = 6, end = 4) => {
  if (!hash || typeof hash !== "string") return "N/A";
  if (hash.length <= start + end + 2) return hash;
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
};

// Hàm lấy màu và Icon cho Status
const getStatusProps = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return {
        icon: CheckCircle,
        className: styles.statusCompleted,
        text: "HOÀN TẤT",
      };
    case "in_transit":
      return {
        icon: Truck,
        className: styles.statusInTransit,
        text: "ĐANG VẬN CHUYỂN",
      };
    case "pending":
      return {
        icon: Clock,
        className: styles.statusPending,
        text: "CHỜ XỬ LÝ",
      };
    case "cancelled":
      return {
        icon: AlertTriangle,
        className: styles.statusCancelled,
        text: "ĐÃ HỦY",
      };
    default:
      return {
        icon: Clock,
        className: styles.statusPending,
        text: status?.toUpperCase() || "UNKNOWN",
      };
  }
};

const OrderDetail_Web3 = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [key]: true });
    setTimeout(
      () => setCopyStatus((prev) => ({ ...prev, [key]: false })),
      1500
    );
  };

  if (loading)
    return (
      <div className={styles.emptyState}>
        <RefreshCw className={styles.loadingIcon} /> Đang tải dữ liệu
        On-Chain...
      </div>
    );

  if (!order)
    return (
      <div className={styles.errorState}>
        <AlertTriangle className={styles.errorIcon} /> Không tìm thấy Order ID.
      </div>
    );

  const DetailRow = ({
    icon: Icon,
    label,
    value,
    colorClass = "color-white",
    valueAsElement,
  }) => (
    <div className={styles.detailRow}>
      <Icon className={`${styles.icon} ${styles[colorClass]}`} size={18} />
      <div className={styles.content}>
        <span className={styles.label}>{label}:</span>
        {valueAsElement ? (
          <span className={`${styles.value} ${styles[colorClass]}`}>
            {valueAsElement}
          </span>
        ) : (
          <span className={`${styles.value} ${styles[colorClass]}`}>
            {value ?? "N/A"}
          </span>
        )}
      </div>
    </div>
  );

  const HashRow = ({ icon: Icon, label, hash, isLink = false }) => {
    const key = `copy-${label.replace(/\s/g, "")}`;
    const isCopied = copyStatus[key];
    return (
      <DetailRow
        icon={Icon}
        label={label}
        valueAsElement={
          <span
            title={hash ?? "N/A"}
            className={styles.walletHash}
            onClick={() => handleCopy(hash, key)}>
            {truncateHash(hash)}
            {isLink && <Link size={14} className={styles.linkIcon} />}
            {isCopied ? (
              <CheckCircle
                className={`${styles.copyIcon} ${styles.copied}`}
                size={16}
              />
            ) : (
              <Copy className={styles.copyIcon} size={16} />
            )}
          </span>
        }
        colorClass="color-cyan"
      />
    );
  };

  const StatusChip = () => {
    const { icon: StatusIcon, className, text } = getStatusProps(order.status);
    return (
      <div className={`${styles.statusChip} ${className}`}>
        <StatusIcon size={16} className={styles.chipIcon} />
        <span>{text}</span>
      </div>
    );
  };

  // Lấy wallet từ schema
  const customerWallet = order.from_wallet ?? null;
  const carrierWallet = order.to_wallet ?? null;

  return (
    <div className={styles.orderDetailContainer}>
      <header className={styles.header}>
        <h1 className={styles.h1}>
          <Truck size={24} className={styles.icon} /> Vận chuyển On-Chain | Chi
          tiết
        </h1>
        <div className={styles.headerMeta}>
          <span className={styles.orderRef}>#{order.order_ref ?? "N/A"}</span>
          <span className={styles.orderId}>
            ID: {truncateHash(order._id, 8, 4)}
          </span>
        </div>
      </header>

      {/* Trạng thái */}
      <section className={`${styles.glassCard} ${styles.statusSection}`}>
        <h2 className={styles.sectionHeader}>
          <Zap size={20} className={styles.icon} /> Trạng thái & On-Chain Data
        </h2>
        <div className={styles.grid2Cols}>
          <div className={styles.statusBox}>
            <p className={styles.statusLabel}>Current Status:</p>
            <StatusChip />
            <DetailRow
              icon={Clock}
              label="Created At"
              value={formatDate(order.created_at)}
              colorClass="color-gray-500"
            />
            <DetailRow
              icon={Clock}
              label="Updated At"
              value={formatDate(order.updated_at)}
              colorClass="color-gray-500"
            />
          </div>
          <div className={styles.walletBox}>
            <HashRow
              icon={DollarSign}
              label="Customer Wallet"
              hash={customerWallet}
              isLink
            />
            <HashRow
              icon={Truck}
              label="Carrier Wallet"
              hash={carrierWallet}
              isLink
            />
            <HashRow
              icon={Link}
              label="Delivery Proof CID"
              hash={order.delivery_proof_cid}
              isLink
            />
          </div>
        </div>
      </section>

      {/* Cargo */}
      <section className={`${styles.glassCard} ${styles.cargoSection}`}>
        <h2 className={styles.sectionHeader}>
          <Package size={20} className={styles.icon} /> Thông tin Hàng hóa
          (Cargo Manifest)
        </h2>
        {order.cargo ? (
          <div className={styles.grid3Cols}>
            <DetailRow
              icon={Package}
              label="Mô tả"
              value={order.cargo.description ?? "N/A"}
              colorClass="color-white font-semibold"
            />
            <DetailRow
              icon={Package}
              label="Cân nặng"
              value={`${order.cargo.weight_kg ?? "N/A"} kg`}
              colorClass="color-white"
            />
            <DetailRow
              icon={Package}
              label="Thể tích"
              value={`${order.cargo.volume_cbm ?? "N/A"} m³`}
              colorClass="color-white"
            />
            <DetailRow
              icon={AlertTriangle}
              label="Dangerous Goods"
              value={order.cargo.is_dangerous_goods ? "YES" : "NO"}
              colorClass={
                order.cargo.is_dangerous_goods
                  ? "color-red font-bold"
                  : "color-emerald"
              }
            />
            {order.cargo.is_dangerous_goods && (
              <>
                <DetailRow
                  icon={AlertTriangle}
                  label="UN Class Number"
                  value={order.cargo.un_class_number ?? "N/A"}
                  colorClass="color-red"
                />
                <HashRow
                  icon={Link}
                  label="MSDS CID (IPFS)"
                  hash={order.cargo.msds_document_cid}
                />
              </>
            )}
            <DetailRow
              icon={Package}
              label="Mã HS Hải quan"
              value={order.cargo.customs_hs_code ?? "N/A"}
              colorClass="color-gray-500"
            />
            <DetailRow
              icon={Package}
              label="Loại đóng gói"
              value={order.cargo.packaging_type ?? "N/A"}
              colorClass="color-white"
            />
          </div>
        ) : (
          <p className={styles.emptyState}>Không có dữ liệu Cargo.</p>
        )}
      </section>

      {/* Pickup Proof */}
      {order.pickup_proof && (
        <section className={`${styles.glassCard} ${styles.pickupProofSection}`}>
          <h2 className={styles.sectionHeader}>
            <Copy size={20} className={styles.icon} /> Proof of Pickup
          </h2>
          <div className={styles.grid2Cols}>
            <div>
              <DetailRow
                icon={Clock}
                label="Thời gian Upload"
                value={formatDate(order.pickup_proof.uploaded_at)}
                colorClass="color-white"
              />
              <HashRow
                icon={Link}
                label="Uploaded By (Wallet)"
                hash={order.pickup_proof.uploaded_by}
                isLink
              />
              {order.pickup_proof.location &&
                order.pickup_proof.location.lat != null &&
                order.pickup_proof.location.lng != null && (
                  <DetailRow
                    icon={MapPin}
                    label="Vị trí GPS"
                    value={`Lat: ${order.pickup_proof.location.lat}, Lng: ${order.pickup_proof.location.lng}`}
                    colorClass="color-yellow"
                  />
                )}
            </div>
            <div className={styles.hashListContainer}>
              <h3 className={styles.h3}>Image Proofs:</h3>
              <div className={styles.imageGrid}>
                {(order.pickup_proof?.image_hashes ?? [])
                  .slice(0, 4)
                  .map((img, index) => (
                    <div key={index} className={styles.imageWrapper}>
                      <img
                        src={img}
                        alt={`Proof ${index + 1}`}
                        className={styles.imageThumbnail}
                        onClick={() => window.open(img, "_blank")}
                      />
                    </div>
                  ))}
              </div>
              {(order.pickup_proof?.image_hashes ?? []).length > 4 && (
                <p className={styles.moreImages}>
                  + {(order.pickup_proof?.image_hashes ?? []).length - 4} ảnh
                  khác
                </p>
              )}

              {(order.pickup_proof.image_hashes ?? []).length > 4 && (
                <p className={styles.moreImages}>
                  + {(order.pickup_proof.image_hashes ?? []).length - 4} ảnh
                  khác
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Payment */}
      <section className={`${styles.glassCard} ${styles.paymentSection}`}>
        <h2 className={styles.sectionHeader}>
          <DollarSign size={20} className={styles.icon} /> Thông tin Thanh toán
        </h2>
        {order.payment ? (
          <div className={styles.grid3Cols}>
            <DetailRow
              icon={DollarSign}
              label="Amount (USD)"
              value={`$${
                order.payment.amount_usd?.toLocaleString("en-US") ?? "0"
              }`}
              colorClass="color-pink font-bold"
            />
            <HashRow
              icon={Link}
              label="Token Used (Contract)"
              hash={order.payment.token_used}
              isLink
            />
            <DetailRow
              icon={Link}
              label="Escrow ID"
              value={order.payment.escrow_id ?? "N/A"}
              colorClass="color-white"
            />
            <DetailRow
              icon={Clock}
              label="Paid At"
              value={formatDate(order.payment.paid_at) ?? "Pending"}
              colorClass="color-emerald"
            />
          </div>
        ) : (
          <p className={styles.emptyState}>
            <Clock size={16} className={styles.icon} /> Chưa có thông tin thanh
            toán.
          </p>
        )}
      </section>
    </div>
  );
};

export default OrderDetail_Web3;
