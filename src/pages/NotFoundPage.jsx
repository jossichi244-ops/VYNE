import React from "react";
import styles from "../assets/styles/NotFoundPage.module.scss"; // Sử dụng CSS Modules
import { Home, Zap, ShieldQuestion, Loader } from "lucide-react"; // Icon từ Lucide React
import Web3Particles from "../components/Web3Particles.jsx";
const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      {/* Background Grid/Particles - Visual Effect */}
      <div className={styles.backgroundGrid}></div>

      {/* ⭐ GỌI COMPONENT PARTICLES VÀO ĐÂY */}
      <div className={styles.particleEffect}>
        <Web3Particles />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.statusCode}>
          <span className={styles.glowEffect}>4</span>
          <span className={styles.animatedZero}>0</span>
          <span className={styles.glowEffect}>4</span>
        </div>

        <h1 className={styles.title}>Lỗi Truy Cập Chuỗi Khối</h1>
        <p className={styles.message}>
          Dường như địa chỉ bạn tìm kiếm đã bị phân mảnh hoặc không tồn tại
          trong Registry.
          <br /> Hãy thử một giao dịch khác.
        </p>

        <div className={styles.actions}>
          <a href="/" className={styles.actionButton}>
            <Home size={18} /> Quay về Portal
          </a>
          <a
            href="/status"
            className={`${styles.actionButton} ${styles.secondary}`}>
            <Zap size={18} /> Kiểm tra Trạng thái DApp
          </a>
        </div>

        <div className={styles.contactInfo}>
          <p>Cần hỗ trợ? Kết nối với Oracle:</p>
          <a href="/support" className={styles.supportLink}>
            <ShieldQuestion size={16} /> Hỗ trợ Kỹ thuật
          </a>
        </div>

        <div className={styles.footer}>
          <Loader className={styles.footerLoader} size={16} />
          <p>Hệ thống vận hành phi tập trung. Vui lòng thử lại.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
