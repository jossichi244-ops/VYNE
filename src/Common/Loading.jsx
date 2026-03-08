import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
};

export default Loading;
