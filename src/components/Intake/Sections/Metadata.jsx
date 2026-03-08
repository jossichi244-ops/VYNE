import React from "react";
import SectionCard from "../../../layouts/SectionCard";
import EmptyState from "../../../Common/EmptyState";

const Metadata = ({ dataset }) => {
  if (!dataset?.metadata) {
    return <EmptyState message="No metadata available" />;
  }

  return (
    <SectionCard title="Metadata">
      <pre style={{ fontSize: 12 }}>
        {JSON.stringify(dataset.metadata, null, 2)}
      </pre>
    </SectionCard>
  );
};

export default Metadata;
