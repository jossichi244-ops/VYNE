import React from "react";
import ConnectionFrame from "./ERPConnector/ConnectionFrame/ConnectionFrame";
import StatsFrame from "./ERPConnector/StatsFrame/StatsFrame";
import DiffList from "./ERPConnector/DiffEngine/DiffList";
import useERPData from "./hooks/useERPData";
import "./ERPConnector.scss";

const ERPConnector = () => {
  const { data, stats, resolveConflict } = useERPData();

  return (
    <div className="logistics-erp-workspace">
      {/* Background Decor */}
      <div className="ambient-glow"></div>

      <div className="bento-grid">
        <aside className="sidebar-area">
          <ConnectionFrame provider="SAP Business One" status="connected" />
          <div className="quick-actions grid-item-glass">
            <h5>Quick Actions</h5>
            <button className="btn-action">Force Sync All</button>
            <button className="btn-action secondary">Download Manifest</button>
          </div>
        </aside>

        <main className="content-area">
          <header className="main-header">
            <StatsFrame stats={stats} />
          </header>

          <section className="engine-area grid-item-glass">
            <div className="engine-title">
              <h3>Shipment Reconciliation Engine</h3>
              <span className="live-tag">REAL-TIME DATA FEED</span>
            </div>
            <DiffList data={data} onResolve={resolveConflict} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ERPConnector;
