import React from "react";
import "./OperationalAutomation.scss";

const OperationalAutomation = ({ data }) => {
  return (
    <div className="operations-module">
      <h3>Operational Automation Layer</h3>

      <div className="action-grid">
        <button>Generate Booking</button>
        <button>Push to ERP</button>
        <button>Create Warehouse Job</button>
        <button>Trigger Customs Draft</button>
        <button>Simulate DEM/DET</button>
      </div>

      <div className="automation-suggestions">
        {data
          .filter((d) => d.status !== "match")
          .map((item) => (
            <div key={item.id} className="suggestion">
              Suggest fix for {item.field}
            </div>
          ))}
      </div>
    </div>
  );
};

export default OperationalAutomation;
