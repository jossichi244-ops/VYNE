import React from "react";

const RisksOpportunities = ({ risks }) => {
  // Đảm bảo luôn có mảng an toàn
  const safeRisks = Array.isArray(risks) ? risks : [];

  return (
    <section className="risks-opportunities">
      <h2>⚠️ Risks & Opportunities</h2>
      {safeRisks.length > 0 ? (
        <ul>
          {safeRisks.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
        </ul>
      ) : (
        <p>No risks or opportunities identified.</p>
      )}
    </section>
  );
};

export default RisksOpportunities;
