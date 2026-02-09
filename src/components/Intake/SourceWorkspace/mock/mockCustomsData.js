export const mockCustomsData = [
  {
    id: "VN-SHP-001",
    factory: "Samsung Bắc Ninh",
    destination: "Los Angeles, US",
    hsCode: "854231",
    commodity: "Semiconductor IC",

    complianceStatus: "blocked",
    blockingReason: "HS Code mismatch vs invoice",
    inspectionType: "Red Channel",
    authority: "US Customs",

    estimatedPenalty: 8500,
    delayDays: 4,
    riskLevel: "critical",

    missingDocs: ["Commercial Invoice Revision", "CO Form D"],
    actionRequired: "Submit corrected HS Code + re-file entry",
  },
  {
    id: "VN-SHP-002",
    factory: "LG Hải Phòng",
    destination: "Hamburg, Germany",
    hsCode: "852872",
    commodity: "Smart Display Module",

    complianceStatus: "review",
    blockingReason: "Random inspection",
    inspectionType: "Yellow Channel",
    authority: "EU Customs",

    estimatedPenalty: 0,
    delayDays: 2,
    riskLevel: "medium",

    missingDocs: [],
    actionRequired: "Await inspection result",
  },
];
