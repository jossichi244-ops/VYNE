export const fileSummary = {
  totalRows: 1248,
  validRows: 1190,
  missingRequired: 32,
  duplicates: 8,
  highRisk: 14,
  estimatedRevenue: 182400,
  potentialRiskCost: 3200,
};

export const fieldMappings = [
  {
    sourceField: "gross_weight",
    targetField: "gross_weight",
    confidence: 72,
    riskLevel: "MEDIUM",
    businessImpact: "Customs Delay",
    issues: ["Weight variance > 15%"],
  },
  {
    sourceField: "incoterm",
    targetField: "incoterm",
    confidence: 88,
    riskLevel: "CRITICAL",
    businessImpact: "Billing Error",
    issues: ["Incoterm missing for 6 records"],
  },
  {
    sourceField: "hs_code",
    targetField: "hs_code",
    confidence: 61,
    riskLevel: "CRITICAL",
    businessImpact: "Clearance Block",
    issues: ["HS code missing"],
  },
];

export const conflicts = [
  {
    type: "DUPLICATE",
    severity: "CRITICAL",
    message: "Duplicate BL Number detected",
    affectedRows: [22, 87, 109],
  },
  {
    type: "CONFLICT",
    severity: "WARNING",
    message: "ETA earlier than ETD",
    affectedRows: [301],
  },
];

export const costScenarios = [
  {
    label: "Process Today",
    margin: 18,
    demDetRisk: 0,
  },
  {
    label: "Delay 3 Days",
    margin: 9,
    demDetRisk: 1200,
  },
];
