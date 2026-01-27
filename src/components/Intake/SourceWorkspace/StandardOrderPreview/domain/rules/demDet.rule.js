export const demDetRule = (order) => {
  if (!order.arrivalDate) {
    return {
      daysLeft: null,
      isCritical: false,
      estimatedFee: 0,
    };
  }

  const daysConsumed = Math.floor(
    (Date.now() - new Date(order.arrivalDate)) / 86400000,
  );

  const overDays = Math.max(0, daysConsumed - order.freeTimeDays);

  return {
    daysLeft: Math.max(0, order.freeTimeDays - daysConsumed),
    isCritical: daysConsumed >= order.freeTimeDays - 1,
    estimatedFee: overDays * order.dailyRate,
  };
};
