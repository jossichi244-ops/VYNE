import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCarrier } from "../store/slices/carrierSlice";

// --- Shared & Intake Components ---
import CyberStats from "../components/Shared/CyberStats";
import CarrierERPConnector from "../components/CSE/Intake/CarrierERPConnector";

// --- Suggestion & Readiness Components ---
import CarrierRankCard from "../components/CSE/Suggestion/CarrierRankCard";
import InventoryRadar from "../components/CSE/Readiness/InventoryRadar";

// --- Route & Monitoring Components ---
import ConstraintBuilder from "../components/CSE/Route/ConstraintBuilder";
import LTLConsolidator from "../components/CSE/Route/LTLConsolidator";
import GateActivityBoard from "../components/CSE/Monitoring/GateActivityBoard";
import DelayAlertCenter from "../components/CSE/Monitoring/DelayAlertCenter";
import PODCapture from "../components/CSE/Monitoring/PODCapture";

// --- Icons ---
import { FiClock, FiCpu, FiShield, FiActivity } from "react-icons/fi";

// --- Styles ---
import "./CarrierControlConsole.scss";

const CarrierControlConsole = () => {
  const dispatch = useDispatch();

  // Global State Integration
  const { selectedOption } = useSelector((state) => state.promise);
  const { candidates, selectedCarrierId, activeShipment } = useSelector(
    (state) => state.carrier,
  );
  const { gateActivities } = useSelector((state) => state.execution);

  const mockAlerts = [
    {
      title: "Gate Congestion",
      message: "Warehouse A is experiencing 45min delay for check-in.",
      type: "WARNING",
    },
    {
      title: "Traffic Alert",
      message: "Route 1A is congested due to weather.",
      type: "WARN",
    },
  ];

  return (
    <div className="ccc-wrapper">
      <div className="ccc-container">
        {/* 1. TOP HEADER & CONNECTIVITY STATUS */}
        <header className="ccc-header">
          <div className="ccc-header__brand">
            <div className="ccc-header__status-badge">
              <div className="ccc-icon-pulse">
                <FiCpu />
                <div className="ccc-pulse-ring" />
              </div>
              <span>Orchestrator_v1.0_Active</span>
            </div>
            <h2 className="ccc-header__title">
              CORE <span className="ccc-header__title--light">COMMAND</span>
            </h2>
          </div>

          <div className="ccc-header__controls">
            <CarrierERPConnector />
            <div className="ccc-glass-panel ccc-sla-panel">
              <p className="ccc-label-mini">SLA Context</p>
              <div className="ccc-sla-status">
                <FiClock className="ccc-icon-success" />
                <span className="ccc-text-success">
                  {selectedOption || "STANDARD PRIORITY"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. KPI DASHBOARD LAYER */}
        <section className="ccc-section ccc-section--stats">
          <CyberStats />
        </section>

        {/* 3. MAIN OPERATIONAL GRID */}
        <div className="ccc-grid">
          {/* LEFT COLUMN: STRATEGY & SELECTION (Main Operational Area) */}
          <div className="ccc-grid__main">
            {/* Carrier Selection Board */}
            <section className="ccc-section">
              <div className="ccc-section__header">
                <h3>Ranked Carriers</h3>
                <div className="ccc-divider" />
              </div>

              <div className="ccc-card-grid">
                {candidates.map((carrier) => (
                  <div key={carrier.id} className="ccc-card-wrapper">
                    <CarrierRankCard
                      carrier={carrier}
                      promiseType={selectedOption}
                      isActive={selectedCarrierId === carrier.id}
                      onSelect={(id) => dispatch(selectCarrier(id))}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Live Execution Monitoring */}
            <section className="ccc-section">
              <div className="ccc-section__header">
                <h3>Live Monitoring</h3>
                <div className="ccc-divider" />
              </div>

              <div className="ccc-monitor-grid">
                <div className="ccc-monitor-item">
                  <GateActivityBoard activities={gateActivities} />
                </div>
                <div className="ccc-monitor-stack">
                  <LTLConsolidator currentLoad={72} />
                  <PODCapture />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: INTELLIGENCE & CONTROL (Sidebar) */}
          <aside className="ccc-grid__sidebar">
            {/* Real-time Alerts */}
            <DelayAlertCenter alerts={mockAlerts} />

            {/* Readiness Widgets */}
            <div className="ccc-glass-panel ccc-readiness-panel">
              <h4 className="ccc-label-mini ccc-flex-center">
                <FiActivity className="ccc-icon-neon" /> Readiness Intelligence
              </h4>
              <InventoryRadar status="Optimized" stockLevel={92} />
              <ConstraintBuilder />
            </div>

            {/* Master Execution Button */}
            <div className="ccc-action-card">
              <div className="ccc-action-card__bg-icon">
                <FiShield />
              </div>

              <div className="ccc-action-card__content">
                <h3 className="ccc-action-card__title">
                  <FiShield className="ccc-icon-neon" /> Final Authorization
                </h3>

                <div className="ccc-data-rows">
                  <div className="ccc-data-row">
                    <span className="ccc-label-muted">Target Hub</span>
                    <span className="ccc-data-value">
                      {activeShipment.destination}
                    </span>
                  </div>
                  <div className="ccc-data-row">
                    <span className="ccc-label-muted">Assigned Unit</span>
                    <span className="ccc-data-value ccc-text-highlight">
                      {candidates.find((c) => c.id === selectedCarrierId)
                        ?.name || "WAITING_SELECTION..."}
                    </span>
                  </div>
                </div>

                <button
                  className="ccc-btn-dispatch"
                  disabled={!selectedCarrierId}>
                  Dispatch Shipment
                </button>

                <p className="ccc-footer-note">
                  Cryptographic execution log will be sent to ERP
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CarrierControlConsole;
