export const slaRule = (order) => {
  if (!order.expectedDelivery) {
    return { isLate: false, slaPenalty: 0 };
  }

  const isLate = Date.now() > new Date(order.expectedDelivery);

  return {
    isLate,
    slaPenalty: isLate ? order.orderValue * 0.05 : 0,
  };
};
