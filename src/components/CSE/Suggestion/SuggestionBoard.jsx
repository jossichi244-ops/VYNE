import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCarrier } from "../../../store/slices/carrierSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiBarChart2, FiZap } from "react-icons/fi";
import CarrierRankCard from "./CarrierRankCard";
import "./SuggestionBoard.scss";

const SuggestionBoard = () => {
  const { candidates = [], selectedCarrierId } = useSelector(
    (state) => state.carrier,
  );
  const dispatch = useDispatch();

  return (
    <div className="suggestion-shell">
      {/* Header với các chỉ số hệ thống */}
      <div className="shell-header">
        <div className="main-title">
          <div className="ai-status">
            <FiCpu className="cpu-icon" />
            <span className="pulse-dot"></span>
          </div>
          <div className="text-stack">
            <h3>AI_RECOMMENDED_UNITS</h3>
            <p>Sàng lọc từ {candidates.length} đối tác vận tải khả dụng</p>
          </div>
        </div>

        <div className="meta-stats">
          <div className="stat-pill">
            <FiBarChart2 size={10} />
            <span>ACCURACY: 98.4%</span>
          </div>
        </div>
      </div>

      {/* Danh sách ứng viên với hiệu ứng Staggered */}
      <motion.div
        className="candidates-grid"
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.1 } },
        }}>
        <AnimatePresence>
          {candidates.map((carrier) => (
            <motion.div
              key={carrier.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}>
              <CarrierRankCard
                carrier={carrier}
                isActive={selectedCarrierId === carrier.id}
                onSelect={(id) => dispatch(selectCarrier(id))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer chỉ dẫn */}
      <div className="shell-footer">
        <FiZap className="zap-icon" />
        <span>Hệ thống tự động sắp xếp theo điểm số Matching Index</span>
      </div>
    </div>
  );
};

export default SuggestionBoard;
