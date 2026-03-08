import React, { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <ReportContext.Provider
      value={{ dataset, setDataset, loading, setLoading, error, setError }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => useContext(ReportContext);
