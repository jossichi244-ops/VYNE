import React from "react";
import SectionCard from "../../../layouts/SectionCard";
import EmptyState from "../../../Common/EmptyState";

const AdvancedAnalysis = ({ dataset }) => {
  if (!dataset?.data?.length) return <EmptyState />;

  return (
    <SectionCard title="Advanced Analysis">
      <p>Advanced analytics module placeholder.</p>
      <p>Future extensions:</p>
      <ul>
        <li>Clustering</li>
        <li>Time-series forecasting</li>
        <li>Anomaly detection</li>
      </ul>
    </SectionCard>
  );
};

export default AdvancedAnalysis;
