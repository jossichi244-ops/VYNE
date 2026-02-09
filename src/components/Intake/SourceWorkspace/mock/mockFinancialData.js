export const mockFinancialData = [
  {
    id: "VN-SHP-001",
    factory: "Samsung Bắc Ninh",
    carrier: "Maersk",
    container: "MSKU1234567",

    costBreakdown: {
      demurrage: 1800,
      detention: 1200,
      storage: 500,
      customsPenalty: 0,
      slaPenalty: 700,
    },

    currentExposure: 4200,
    forecastExposure: 6800,
    exposureIfDelayed3Days: 9200,

    currency: "USD",
    riskLevel: "critical",
    reason: "Port congestion + Late customs clearance",
  },
  {
    id: "VN-SHP-002",
    factory: "LG Hải Phòng",
    carrier: "CMA CGM",
    container: "CMAU9988776",

    costBreakdown: {
      demurrage: 0,
      detention: 600,
      storage: 300,
      customsPenalty: 1200,
      slaPenalty: 0,
    },

    currentExposure: 2100,
    forecastExposure: 2800,
    exposureIfDelayed3Days: 3900,

    currency: "USD",
    riskLevel: "high",
    reason: "HS code missing → customs inspection",
  },
  {
    id: "VN-SHP-003",
    factory: "Foxconn Bắc Giang",
    carrier: "MSC",
    container: "MSCU5566778",

    costBreakdown: {
      demurrage: 900,
      detention: 500,
      storage: 0,
      customsPenalty: 0,
      slaPenalty: 400,
    },

    currentExposure: 1800,
    forecastExposure: 2500,
    exposureIfDelayed3Days: 3600,

    currency: "USD",
    riskLevel: "medium",
    reason: "Carrier schedule deviation",
  },
];
