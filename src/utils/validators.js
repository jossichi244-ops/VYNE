export const validateLogisticsOrder = (order) => {
  const errors = [];

  // Kiểm tra trọng lượng
  if (order.logistics?.weight > 15000) {
    errors.push({
      id: "err_weight",
      field: "weight",
      msg: "Cảnh báo: Tải trọng vượt 15 tấn (Cần xe đầu kéo)",
      level: "warning",
    });
  }

  // Kiểm tra thông tin bắt buộc
  if (!order.customer?.name) {
    errors.push({
      id: "err_cust",
      field: "customer.name",
      msg: "Lỗi: Chưa xác định danh tính khách hàng",
      level: "error",
    });
  }

  // Kiểm tra SKU (Giả lập Master Data check)
  if (order.items?.length === 0) {
    errors.push({
      id: "err_items",
      field: "items",
      msg: "Lỗi: Đơn hàng rỗng (No SKU found)",
      level: "error",
    });
  }

  return errors;
};
