import React from "react";
import { useSelector } from "react-redux";
import "./ExecutionPage.scss";

// --- Icons ---
import {
  FiTruck,
  FiPrinter,
  FiActivity,
  FiLayers,
  FiRadio,
} from "react-icons/fi";

// --- Import Components ---
import DispatchQueue from "../components/Execution/Dispatch/DispatchQueue";
import DispatchActionCard from "../components/Execution/Dispatch/DispatchActionCard";
import GateAssignment from "../components/Execution/Dispatch/GateAssignment";
import BatchPrintPanel from "../components/Execution/Printing/BatchPrintPanel";
import LabelPreviewer from "../components/Execution/Printing/LabelPreviewer";
import ThermalPrintStatus from "../components/Execution/Printing/ThermalPrintStatus";
import ExecutionStatusBoard from "../components/Execution/Tracking/ExecutionStatusBoard";
import VisibilityTimeline from "../components/Execution/Tracking/VisibilityTimeline";
import PODCaptureModule from "../components/Execution/Tracking/PODCaptureModule";
import AccountingSyncPanel from "../components/Execution/Settlement/AccountingSyncPanel";
import ReconciliationTable from "../components/Execution/Settlement/ReconciliationTable";

const ExecutionCenterPage = () => {
  // Lấy data từ các Slices
  const { orders, selectedOrderIds } = useSelector(
    (state) => state.executionFlow,
  );
  const { stats, timeline } = useSelector((state) => state.executionMonitor);
  const { printerStatus } = useSelector((state) => state.print);

  return (
    <div className="exec-layout">
      {/* 1. TOP CONTROL BAR */}
      <header className="exec-header">
        <div className="exec-header__brand">
          <div className="exec-header__icon-box">
            <FiLayers />
          </div>
          <div>
            <h1 className="exec-header__title">
              EXECUTION ENGINE <span className="version">v3.0</span>
            </h1>
            <div className="exec-header__subtitle">
              <span className="live-dot">
                <FiRadio />
              </span>
              REAL-TIME OPERATIONS
            </div>
          </div>
        </div>

        <div className="exec-header__stats">
          <ExecutionStatusBoard stats={stats} />
        </div>
      </header>

      {/* 2. MAIN WORKSPACE GRID */}
      <main className="exec-workspace">
        {/* ZONE A: DISPATCH (30%) */}
        <section className="exec-zone exec-zone--dispatch">
          <div className="exec-zone__header">
            <FiTruck className="zone-icon" />
            <h3>Dispatch Queue</h3>
            <span className="zone-badge">{orders.length}</span>
          </div>
          <div className="exec-zone__content scrollable">
            <DispatchActionCard
              selectedCount={selectedOrderIds.length}
              onDispatch={() => console.log("Dispatched!")}
            />
            <div className="exec-spacer"></div>
            <DispatchQueue orders={orders} />
            <div className="exec-spacer"></div>
            <GateAssignment />
          </div>
        </section>

        {/* ZONE B: PRINTING & PROCESSING (40%) - CENTER STAGE */}
        <section className="exec-zone exec-zone--primary">
          <div className="exec-zone__header">
            <FiPrinter className="zone-icon" />
            <h3>Print Operations</h3>
            {printerStatus === "ERROR" && (
              <span className="status-alert">CHECK PRINTER</span>
            )}
          </div>
          <div className="exec-zone__content">
            <ThermalPrintStatus status={printerStatus} />
            <div className="exec-spacer"></div>
            <LabelPreviewer activeOrder={orders[0]} />
            <div className="exec-spacer"></div>
            <BatchPrintPanel selectedOrders={selectedOrderIds} />
          </div>
        </section>

        {/* ZONE C: VISIBILITY & SETTLEMENT (30%) */}
        <section className="exec-zone exec-zone--tracking">
          <div className="exec-zone__header">
            <FiActivity className="zone-icon" />
            <h3>Live Visibility</h3>
          </div>
          <div className="exec-zone__content scrollable">
            <VisibilityTimeline events={timeline} />
            <div className="exec-spacer"></div>
            <PODCaptureModule orderId={selectedOrderIds[0] || "---"} />
            <div className="exec-spacer"></div>
            <AccountingSyncPanel syncData={{ mismatch: true }} />
          </div>
        </section>
      </main>

      {/* 3. FOOTER: DATA RECONCILIATION */}
      <footer className="exec-footer">
        <div className="exec-footer__header">
          <h4>End-of-Day Reconciliation</h4>
          <div className="exec-line"></div>
        </div>
        <div className="exec-footer__table-wrapper">
          <ReconciliationTable records={orders} />
        </div>
      </footer>
    </div>
  );
};

export default ExecutionCenterPage;
