import React from "react";
import SectionCard from "../../../layouts/SectionCard";

const ExecutiveSummary = ({ dataset }) => {
  return (
    <SectionCard title="Executive Summary">
      <p>Total Rows: {dataset.data.length}</p>
      <p>Total Columns: {Object.keys(dataset.schema.fields || {}).length}</p>
    </SectionCard>
  );
};

export default ExecutiveSummary;
