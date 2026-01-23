import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiZap, FiXCircle, FiCommand, FiGlobe } from "react-icons/fi";

// Import các linh kiện đã tái thiết kế
import IntakeHeader from "../../components/Intake/IntakeHeader";
import SourceTabs from "../../components/Intake/SourceTabs";
import ExcelIntake from "../../components/Intake/SourceWorkspace/ExcelIntake";
import ERPConnector from "../../components/Intake/SourceWorkspace/ERPConnector";
import StandardOrderPreview from "../../components/Intake/StandardOrderPreview";

import "./OrderIntakeConsole.scss";

const OrderIntakeConsole = () => {
  const [activeTab, setActiveTab] = useState("excel");
  const normalizedData = useSelector((state) => state.intake?.normalizedOrder);

  const handleCommit = () => {
    console.log("Committing to Orchestration System...");
  };

  return (
    <div className="logistics-console-theme">
      {/* Background Decor */}
      <div className="ambient-fog"></div>

      <main className="console-wrapper">
        {/* Top Section: Navigation & Global Stats */}
        <section className="console-nav-area">
          <IntakeHeader />
          <SourceTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </section>

        <div className="console-grid">
          {/* Workspace Area: Left Panel */}
          <section className="workspace-panel">
            <div className="panel-tag">
              <FiCommand className="tag-icon" />
              <span>INPUT_WORKSPACE / {activeTab.toUpperCase()}</span>
            </div>

            <div className="content-scroller">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.4,
                    cubicBezier: [0.16, 1, 0.3, 1],
                  }}>
                  {activeTab === "excel" && <ExcelIntake />}
                  {activeTab === "erp" && <ERPConnector />}
                  {activeTab === "zalo" && (
                    <div className="empty-state-terminal">
                      <div className="terminal-loader">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <p>AWAITING NEURAL LINK FROM SOCIAL CHANNELS...</p>
                      <small>ENCRYPTION: AES-256 ACTIVE</small>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Action & Preview Area: Right Panel */}
          <aside className="preview-panel">
            <div className="sticky-sidebar">
              <div className="panel-tag">
                <FiGlobe className="tag-icon" />
                <span>FINAL_MANIFEST_PREVIEW</span>
              </div>

              <StandardOrderPreview data={normalizedData} />

              {/* Decision Terminal */}
              <div className="decision-terminal">
                <button onClick={handleCommit} className="btn-primary-commit">
                  <div className="glitch-overlay"></div>
                  <FiZap className="zap-icon" />
                  <span>COMMIT TO ORCHESTRATION</span>
                </button>

                <div className="secondary-actions">
                  <button className="btn-outline">
                    <FiSave /> <span>SAVE DRAFT</span>
                  </button>
                  <button className="btn-danger">
                    <FiXCircle /> <span>REJECT</span>
                  </button>
                </div>

                <div className="system-footprint">
                  VERIFIED BY LOGISTICS-CORE-V1 // TERMINAL-42
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OrderIntakeConsole;
