export const formatLogisticsValue = (val, type) => {
  if (!val) return "N/A";
  switch (type) {
    case "weight":
      return `${parseFloat(val).toLocaleString()} kg`;
    case "date":
      return new Date(val).toLocaleString("vi-VN");
    case "currency":
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(val);
    default:
      return val;
  }
};
