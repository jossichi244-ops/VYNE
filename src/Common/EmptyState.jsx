import React from "react";

const EmptyState = ({ message = "No data available" }) => {
  return (
    <div style={{ padding: 16, textAlign: "center", opacity: 0.6 }}>
      {message}
    </div>
  );
};

export default EmptyState;
