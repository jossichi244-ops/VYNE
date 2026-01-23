import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBox,
  FiArrowRight,
  FiShield,
  FiActivity,
  FiGlobe,
} from "react-icons/fi";
import { selectOption, setComputing } from "../store/slices/promiseSlice";

// Import Components
import AddressResolver from "../components/Checkout/AddressResolver";
import PromiseOptionCard from "../components/Checkout/PromiseOptionCard";
import SLAIntelligence from "../components/Checkout/SLAIntelligence";
import ContractMoment from "../components/Checkout/ContractMoment";
import ConfidenceIndicator from "../components/Checkout/ConfidenceIndicator";
import RiskDisclosure from "../components/Checkout/RiskDisclosure";

import "./CheckoutPromisePage.scss";

const CheckoutPromisePage = () => {
  const dispatch = useDispatch();
  const { selectedOption, promiseDetails, riskFactors, isComputing } =
    useSelector((state) => state.promise);

  const handleSelect = (id) => {
    dispatch(setComputing(true));
    setTimeout(() => {
      dispatch(selectOption(id));
      dispatch(setComputing(false));
    }, 600);
  };

  const currentDetails = promiseDetails[selectedOption] || {};

  return (
    <div className="promise-engine-terminal">
      {/* Background Decor */}
      <div className="orb-blurs">
        <div className="orb cyan"></div>
        <div className="orb emerald"></div>
      </div>

      <div className="content-wrapper">
        <header className="terminal-header">
          <div className="brand">
            <FiActivity className="pulse-icon" />
            <div className="text">
              <h1>NEURAL_LOGISTICS</h1>
              <span>SYSTEM_VERSION_4.0_STABLE</span>
            </div>
          </div>
          <div className="global-status">
            <FiGlobe />
            <span>SGN_NODE_ACTIVE</span>
          </div>
        </header>

        <div className="main-layout">
          {/* LEFT PANEL: REALITY LAYER */}
          <aside className="reality-layer">
            <AddressResolver address="Khu Công Nghệ Cao, Quận 9, TP. Thủ Đức" />

            <motion.div className="reality-card" whileHover={{ scale: 1.02 }}>
              <div className="card-glare"></div>
              <div className="reality-header">
                <span className="subtitle">ITEM_REALITY_SCAN</span>
                <div className="scanning-dot"></div>
              </div>
              <div className="item-row">
                <div className="visual-box">
                  <FiBox className="box-icon" />
                  <div className="laser-scan"></div>
                </div>
                <div className="item-meta">
                  <h4>Mechanical Keyboard G71</h4>
                  <p className="stock-tag">● INSTOCK_WAREHOUSE_A</p>
                </div>
              </div>
            </motion.div>

            <RiskDisclosure risks={riskFactors} />
          </aside>

          {/* RIGHT PANEL: PROMISE LAYER */}
          <main className="promise-layer">
            <div className={`options-grid ${isComputing ? "computing" : ""}`}>
              <PromiseOptionCard
                type="SAME-DAY"
                eta="Hôm nay trước 20h"
                cost={55000}
                active={selectedOption === "SAME-DAY"}
                onClick={() => handleSelect("SAME-DAY")}>
                <ConfidenceIndicator level={3} />
              </PromiseOptionCard>

              <PromiseOptionCard
                type="NEXT-DAY"
                eta="Thứ 7, 24/01"
                cost={25000}
                active={selectedOption === "NEXT-DAY"}
                onClick={() => handleSelect("NEXT-DAY")}>
                <ConfidenceIndicator level={3} />
              </PromiseOptionCard>

              <PromiseOptionCard
                type="SCHEDULED"
                eta="Chọn lịch riêng"
                cost={15000}
                active={selectedOption === "SCHEDULED"}
                onClick={() => handleSelect("SCHEDULED")}>
                <ConfidenceIndicator level={2} />
              </PromiseOptionCard>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedOption}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="intelligence-container">
                <SLAIntelligence
                  option={selectedOption}
                  details={currentDetails}
                />
                <ContractMoment
                  selected={selectedOption}
                  eta={
                    selectedOption === "SAME-DAY"
                      ? "20:00 tối nay"
                      : "ngày mai 24/01"
                  }
                />
              </motion.div>
            </AnimatePresence>

            <footer className="action-area">
              <div className="protocol-notice">
                <FiShield className="shield" />
                <p>
                  Khởi tạo <strong>Protocol Vận Chuyển</strong>. SLA đã được bảo
                  chứng bằng Smart Contract trên hệ thống Vyne.
                </p>
              </div>

              <motion.button
                className="finalize-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <span className="btn-text">FINALIZE & COMMIT</span>
                <FiArrowRight />
                <div className="button-glow"></div>
              </motion.button>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPromisePage;
