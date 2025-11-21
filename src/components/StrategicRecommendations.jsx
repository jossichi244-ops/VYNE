import React from "react";

const StrategicRecommendations = ({ recommendations }) => {
  // Đảm bảo luôn là mảng an toàn
  const safeRecs = Array.isArray(recommendations) ? recommendations : [];

  return (
    <section className="strategic-recommendations">
      <h2>💡 Strategic Recommendations</h2>
      {safeRecs.length > 0 ? (
        <ol>
          {safeRecs.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ol>
      ) : (
        <p>No strategic recommendations available.</p>
      )}
    </section>
  );
};

export default StrategicRecommendations;
