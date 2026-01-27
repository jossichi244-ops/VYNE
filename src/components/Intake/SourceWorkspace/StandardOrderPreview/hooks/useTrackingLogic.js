import { useMemo } from "react";
import { normalizeOrder } from "../domain/normalizers/normalizeOrder";
import { evaluateRisk } from "../domain/engines/riskEngine";

export const useTrackingLogic = (rawOrder) => {
  return useMemo(() => {
    const order = normalizeOrder(rawOrder);
    return evaluateRisk(order);
  }, [rawOrder]);
};
