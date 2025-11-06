import React from "react";

const ExecutiveSummary = ({ summary }) => {
  return (
    <section className="executive-summary">
      <h2>📌 Executive Summary</h2>
      <p>{summary}</p>
    </section>
  );
};

export default ExecutiveSummary;
