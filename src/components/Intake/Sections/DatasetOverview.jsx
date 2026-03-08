// Sections/DatasetOverview/index.jsx

import React from "react";
import SectionCard from "../../../layouts/SectionCard";
import EmptyState from "../../../Common/EmptyState";

const DatasetOverview = ({ dataset }) => {
  const fields = dataset?.schema?.fields;

  if (!fields) return <EmptyState message="No schema available" />;

  return (
    <SectionCard title="Dataset Overview">
      <table width="100%">
        <thead>
          <tr>
            <th align="left">Field</th>
            <th align="left">Type</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fields).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
};

export default DatasetOverview;
