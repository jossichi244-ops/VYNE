// useCarrierScoring.js
import { useMemo } from "react";
import { useSelector } from "react-redux";

const selectWeights = (state) => state.scoring?.weights;
const selectSelectedOption = (state) => state.promise?.selectedOption;

export const useCarrierScoring = (carrier) => {
  const weights = useSelector(selectWeights);
  const selectedOption = useSelector(selectSelectedOption);

  return useMemo(() => {
    // Luôn ưu tiên check undefined
    if (!carrier)
      return {
        total: 0,
        breakdown: { priceScore: 0, slaScore: 0, riskScore: 0 },
      };

    // Sử dụng giá trị mặc định cho weights nếu state.scoring chưa tồn tại
    const w = weights || { price: 0.4, sla: 0.4, risk: 0.2 };

    const priceScore =
      carrier.basePrice === 0 ? 100 : (1 - carrier.basePrice / 60000) * 100;
    const slaScore = (carrier.sla || 0) * 100;
    const riskScore = carrier.riskLevel === "Low" ? 100 : 50;

    let penalty = 0;
    if (selectedOption === "SAME-DAY" && carrier.riskLevel !== "Low")
      penalty = 20;

    const total = (
      priceScore * w.price +
      slaScore * w.sla +
      riskScore * w.risk -
      penalty
    ).toFixed(0);

    return {
      total: Math.min(100, Math.max(0, total)),
      breakdown: { priceScore, slaScore, riskScore },
    };
  }, [carrier, weights, selectedOption]);
};
