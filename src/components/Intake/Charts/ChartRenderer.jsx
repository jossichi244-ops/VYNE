import React from "react";
import ChartFactory from "./ChartFactory";
import EmptyState from "../../../Common/EmptyState";
import ErrorBoundary from "../../../Common/ErrorBoundary";

const ChartRenderer = ({ type, data, config }) => {
  const ChartComponent = ChartFactory(type);

  if (!ChartComponent) {
    return <EmptyState message={`Unsupported chart type: ${type}`} />;
  }

  if (!data || !data.length) {
    return <EmptyState message="No data for chart" />;
  }

  return (
    <ErrorBoundary>
      <ChartComponent data={data} config={config} />
    </ErrorBoundary>
  );
};

export default ChartRenderer;
