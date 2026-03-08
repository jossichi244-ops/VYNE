import React from "react";

const GridSystem = ({ columns = 2, gap = 24, children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}>
      {children}
    </div>
  );
};

export default GridSystem;
