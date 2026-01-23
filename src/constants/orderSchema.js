export const STANDARD_ORDER_SCHEMA = {
  order_id: "",
  customer: { name: "", code: "", phone: "" },
  items: [], // { sku: "", quantity: 0, weight: 0, volume: 0 }
  delivery: { address: "", city: "", eta: null },
  metadata: { source: "", raw_id: "", sync_at: null },
  status: "PENDING", // PENDING | VALID | ERROR
};
