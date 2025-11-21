// src/components/PipelineViewer.jsx
import React from "react";

const PipelineViewer = ({ pipeline }) => {
  if (!pipeline) return <p>No pipeline data available.</p>;

  return (
    <div>
      <h3>Pipeline Steps</h3>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "1rem",
          borderRadius: "5px",
        }}>
        {JSON.stringify(pipeline, null, 2)}
      </pre>
    </div>
  );
};

export default PipelineViewer;
