export const normalizeOrder = (raw = {}) => ({
  freeTimeDays: raw.freeTimeDays ?? 5,
  dailyRate: raw.dailyRate ?? 50,
  orderValue: raw.orderValue ?? 0,
  arrivalDate: raw.arrivalDate ?? null,
  lastStatusChange: raw.lastStatusChange ?? null,
  expectedDelivery: raw.expectedDelivery ?? null,
  currentStatus: raw.currentStatus ?? "UNKNOWN",
  hsCode: raw.hsCode ?? "",
  incoterm: raw.incoterm ?? "UNKNOWN",
});
