// Sections/Relationships/index.jsx

import React from "react";
import SectionCard from "../../../layouts/SectionCard";
import EmptyState from "../../../Common/EmptyState";

const Relationships = ({ dataset }) => {
  const numericFields = Object.entries(dataset?.schema?.fields || {})
    .filter(([_, v]) => v.type === "number")
    .map(([k]) => k);

  if (numericFields.length < 2)
    return <EmptyState message="Need at least 2 numeric fields" />;

  return (
    <SectionCard title="Relationships">
      <p>Numeric fields detected:</p>
      <ul>
        {numericFields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      <p>Correlation engine can be plugged in here.</p>
    </SectionCard>
  );
};

export default Relationships;
