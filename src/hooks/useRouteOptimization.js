import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useRouteOptimization = (shipmentWeight) => {
  useSelector((state) => state.route.activeRoute);

  const optimization = useMemo(() => {
    // Giả lập logic kiểm tra ràng buộc
    const maxAllowed = 2000; // 2 Tấn
    const isOverweight = shipmentWeight > maxAllowed;
    const utilization = Math.round((shipmentWeight / maxAllowed) * 100);

    return {
      isViable: !isOverweight,
      utilization,
      efficiencyScore: utilization > 80 ? "OPTIMAL" : "UNDERLOADED",
      warnings: isOverweight ? ["Exceeds Vehicle Capacity"] : [],
    };
  }, [shipmentWeight]);

  return optimization;
};
