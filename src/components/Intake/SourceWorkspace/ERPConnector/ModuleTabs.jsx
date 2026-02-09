import React from "react";
import "./ModuleTabs.scss";

const ModuleTabs = ({ active, onChange }) => {
  return (
    <div className="module-tabs">
      <button
        className={active === "reconciliation" ? "active" : ""}
        onClick={() => onChange("reconciliation")}>
        Reconciliation
      </button>

      <button
        className={active === "risk" ? "active" : ""}
        onClick={() => onChange("risk")}>
        Risk Intelligence
      </button>

      <button
        className={active === "financial" ? "active" : ""}
        onClick={() => onChange("financial")}>
        Financial Exposure
      </button>

      <button
        className={active === "customs" ? "active" : ""}
        onClick={() => onChange("customs")}>
        Customs & Compliance
      </button>

      <button
        className={active === "operations" ? "active" : ""}
        onClick={() => onChange("operations")}>
        Operational Automation
      </button>
    </div>
  );
};

export default ModuleTabs;
