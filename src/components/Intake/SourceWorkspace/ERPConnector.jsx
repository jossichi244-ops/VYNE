import React, { useState } from "react";
import ConnectionFrame from "./ERPConnector/ConnectionFrame/ConnectionFrame";
import StatsFrame from "./ERPConnector/StatsFrame/StatsFrame";
import DiffList from "./ERPConnector/DiffEngine/DiffList";
import ModuleTabs from "./ERPConnector/ModuleTabs";
import SyncHealthPanel from "./ERPConnector/SyncHealthPanel";
import useERPData from "./hooks/useERPData";
import "./ERPConnector.scss";
import RiskIntelligence from "./ERPConnector/RiskIntelligence";
import FinancialExposure from "./ERPConnector/FinancialExposure";
import CustomsCompliance from "./ERPConnector/CustomsCompliance";
import OperationalAutomation from "./ERPConnector/OperationalAutomation";

const ERPConnector = () => {
  const { data, stats, resolveConflict } = useERPData();
  const [activeModule, setActiveModule] = useState("reconciliation");

  const renderModule = () => {
    switch (activeModule) {
      case "reconciliation":
        return <DiffList data={data} onResolve={resolveConflict} />;

      case "risk":
        return <RiskIntelligence data={data} />;

      case "financial":
        return <FinancialExposure data={data} />;

      case "customs":
        return <CustomsCompliance data={data} />;

      case "operations":
        return <OperationalAutomation data={data} />;

      default:
        return null;
    }
  };

  return (
    <div className="logistics-erp-workspace">
      <div className="ambient-glow"></div>

      <div className="bento-grid">
        {/* ================= SIDEBAR ================= */}
        <aside className="sidebar-area">
          <ConnectionFrame provider="SAP Business One" status="connected" />

          <SyncHealthPanel />
        </aside>

        {/* ================= MAIN ================= */}
        <main className="content-area">
          <header className="main-header">
            <StatsFrame stats={stats} />
          </header>

          <ModuleTabs active={activeModule} onChange={setActiveModule} />

          <section className="engine-area grid-item-glass">
            {renderModule()}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ERPConnector;
