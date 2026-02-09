import { useState, useMemo } from "react";

const useERPData = () => {
  const [rawData, setRawData] = useState([
    {
      id: "SHP-001",
      shipmentId: "VN-HCM-240201",
      bookingNo: "BK-77821",
      seal: "SL-9902",
      plant: "VN-HCM-01",

      status: "match",
      riskLevel: "low",
      estimatedCostImpact: 0,
      blockingCustoms: false,

      mismatchedFields: [],

      lastSync: "2026-02-08 10:22",
    },

    {
      id: "SHP-002",
      shipmentId: "VN-HCM-240202",
      bookingNo: "BK-77822",
      seal: "SL-8821",
      plant: "VN-HCM-01",

      status: "mismatch",
      riskLevel: "critical",
      estimatedCostImpact: 420,
      blockingCustoms: false,

      mismatchedFields: [
        {
          field: "Gate-in Weight",
          erpValue: "24,500kg",
          opsValue: "24,650kg",
          severity: "high",
          businessImpact: "Potential overweight fine",
        },
      ],

      lastSync: "2026-02-08 10:20",
    },

    {
      id: "SHP-003",
      shipmentId: "CN-SH-240301",
      bookingNo: "BK-99111",
      seal: "SL-1122",
      plant: "CN-SH-02",

      status: "mismatch",
      riskLevel: "medium",
      estimatedCostImpact: 0,
      blockingCustoms: false,

      mismatchedFields: [
        {
          field: "ETA Port",
          erpValue: "2026-02-12 14:00",
          opsValue: "2026-02-12 16:30",
          severity: "medium",
          businessImpact: "Port delay risk",
        },
      ],

      lastSync: "2026-02-08 09:55",
    },

    {
      id: "SHP-004",
      shipmentId: "VN-HCM-240203",
      bookingNo: "BK-77823",
      seal: "SL-4433",
      plant: "VN-HCM-01",

      status: "mismatch",
      riskLevel: "critical",
      estimatedCostImpact: 450,
      blockingCustoms: false,

      mismatchedFields: [
        {
          field: "Freight Charge",
          erpValue: "USD 12,450",
          opsValue: "USD 12,000",
          severity: "critical",
          businessImpact: "Revenue leakage",
        },
      ],

      lastSync: "2026-02-08 10:01",
    },

    {
      id: "SHP-005",
      shipmentId: "CN-SH-240302",
      bookingNo: "BK-99112",
      seal: "SL-6677",
      plant: "CN-SH-02",

      status: "mismatch",
      riskLevel: "critical",
      estimatedCostImpact: 0,
      blockingCustoms: true,

      mismatchedFields: [
        {
          field: "HS Code",
          erpValue: "85044030",
          opsValue: "",
          severity: "critical",
          businessImpact: "Customs clearance blocked",
        },
      ],

      lastSync: "2026-02-08 09:45",
    },
  ]);

  /* ===============================
   * ENTERPRISE STATS ENGINE
   * =============================== */
  const stats = useMemo(() => {
    const mismatches = rawData.filter((d) => d.status === "mismatch");

    return {
      total: rawData.length,
      conflicts: mismatches.length,
      critical: rawData.filter((d) => d.riskLevel === "critical").length,
      financialExposure: rawData.reduce(
        (sum, d) => sum + (d.estimatedCostImpact || 0),
        0,
      ),
      customsBlocked: rawData.filter((d) => d.blockingCustoms).length,
      plants: [...new Set(rawData.map((d) => d.plant))].length,
    };
  }, [rawData]);

  /* ===============================
   * RESOLVE ENGINE
   * =============================== */
  const resolveConflict = (id, resolvedBy = "Ops Manager") => {
    setRawData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "match",
              riskLevel: "low",
              estimatedCostImpact: 0,
              blockingCustoms: false,
              mismatchedFields: [],
              resolvedAt: new Date().toISOString(),
              resolvedBy,
            }
          : item,
      ),
    );
  };

  return { data: rawData, stats, resolveConflict };
};

export default useERPData;
