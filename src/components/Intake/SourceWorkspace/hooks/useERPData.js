import { useState, useMemo } from "react";

const useERPData = () => {
  const [rawData, setRawData] = useState([
    {
      id: "1",
      field: "Seal Number",
      erp: "SL-9902",
      ops: "SL-9902",
      status: "match",
      severity: "low",
    },
    {
      id: "2",
      field: "Gate-in Weight",
      erp: "24500kg",
      ops: "24650kg",
      status: "mismatch",
      severity: "high",
    },
    {
      id: "3",
      field: "ETA Port",
      erp: "2023-10-24 14:00",
      ops: "2023-10-24 16:30",
      status: "mismatch",
      severity: "medium",
    },
  ]);

  const stats = useMemo(
    () => ({
      total: rawData.length,
      conflicts: rawData.filter((d) => d.status === "mismatch").length,
      critical: rawData.filter(
        (d) => d.severity === "high" && d.status === "mismatch",
      ).length,
    }),
    [rawData],
  );

  const resolveConflict = (id, preferredValue) => {
    setRawData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ops: preferredValue,
              erp: preferredValue,
              status: "match",
            }
          : item,
      ),
    );
  };

  return { data: rawData, stats, resolveConflict };
};

export default useERPData;
