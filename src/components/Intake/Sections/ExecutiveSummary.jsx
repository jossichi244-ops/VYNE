// Sections/ExecutiveSummary/index.jsx

import React from "react";
import SectionCard from "../../../layouts/SectionCard";
import EmptyState from "../../../Common/EmptyState";

const ExecutiveSummary = ({ dataset }) => {
  if (!dataset?.data?.length) return <EmptyState />;

  const totalRows = dataset.data.length;
  const totalFields = Object.keys(dataset.schema?.fields || {}).length;

  return (
    <SectionCard title="Executive Summary">
      <ul>
        <li>Total records: {totalRows}</li>
        <li>Total fields: {totalFields}</li>
        <li>Report generated automatically from uploaded dataset.</li>
      </ul>
    </SectionCard>
  );
};

export default ExecutiveSummary;
