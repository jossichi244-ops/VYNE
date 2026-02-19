const STANDARD_FIELDS = {
  customer_name: ["consignee", "customer", "receiver"],
  delivery_address: ["address", "dest", "location"],
  gross_weight: ["weight", "kg", "mass"],
};

export const autoMapFields = (columns) => {
  return columns.map((col) => {
    const lower = col.toLowerCase();
    let match = null;

    Object.entries(STANDARD_FIELDS).forEach(([std, keys]) => {
      if (keys.some((k) => lower.includes(k))) {
        match = std;
      }
    });

    return {
      excel: col,
      std: match ?? "UNMAPPED",
      status: match ? "match" : "warning",
      confidence: match ? "90%" : "40%",
    };
  });
};
