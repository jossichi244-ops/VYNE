const INCOTERM_MAP = {
  EXW: "Buyer pays all costs",
  CIF: "Seller covers insurance & freight",
  DDP: "Seller pays taxes & duties",
};

export const complianceRule = (order) => ({
  complianceRisk: order.hsCode.length < 4 ? "CRITICAL" : "CLEARED",
  incotermRole: INCOTERM_MAP[order.incoterm] ?? "Consult Incoterms 2020",
});
