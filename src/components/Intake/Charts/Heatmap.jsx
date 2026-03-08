import React from "react";

const Heatmap = ({ data, config }) => {
  const { xKey, yKey, valueKey } = config;

  return (
    <div style={{ display: "grid", gap: 4 }}>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            background: `rgba(0,0,255,${item[valueKey] / 100})`,
            padding: 10,
          }}
        >
          {item[xKey]} - {item[yKey]}: {item[valueKey]}
        </div>
      ))}
    </div>
  );
};

export default Heatmap;