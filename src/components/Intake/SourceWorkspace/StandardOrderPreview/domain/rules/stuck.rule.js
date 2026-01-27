export const stuckRule = (order) => {
  if (!order.lastStatusChange) {
    return { isStuck: false, stuckDuration: 0 };
  }

  const hours = (Date.now() - new Date(order.lastStatusChange)) / 36e5;

  return {
    isStuck: hours > 24 && order.currentStatus !== "DELIVERED",
    stuckDuration: Math.round(hours),
  };
};
