import { demDetRule } from "../rules/demDet.rule";
import { stuckRule } from "../rules/stuck.rule";
import { complianceRule } from "../rules/compliance.rule";
import { slaRule } from "../rules/sla.rule";

export const evaluateRisk = (order) => {
  return {
    demStatus: demDetRule(order),
    ...stuckRule(order),
    ...complianceRule(order),
    ...slaRule(order),
  };
};
