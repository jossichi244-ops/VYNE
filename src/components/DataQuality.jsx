import React from "react";

const DataQuality = ({ quality }) => {
  // Đảm bảo luôn có array
  const safeQuality = Array.isArray(quality) ? quality : [];

  return (
    <section className="data-quality">
      <h2>📊 Data Quality & Reliability</h2>
      {safeQuality.length > 0 ? (
        <ul>
          {safeQuality.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No data quality issues detected.</p>
      )}
    </section>
  );
};

export default DataQuality;
