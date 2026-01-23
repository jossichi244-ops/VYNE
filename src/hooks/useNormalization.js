import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setValidationResults } from "../store/slices/intakeSlice";
import { validateLogisticsOrder } from "../utils/validators";

export const useNormalization = () => {
  const dispatch = useDispatch();
  const { rawOrder, normalizedOrder } = useSelector((state) => state.intake);

  // Giả lập logic Auto-Mapping từ Mock Data
  useEffect(() => {
    if (rawOrder) {
      // Logic bóc tách mock: map 'CustName' từ excel sang 'customer.name' chuẩn
      dispatch(
        updateField({ field: "customer.name", value: rawOrder.CustName || "" }),
      );
      dispatch(
        updateField({
          field: "logistics.weight",
          value: rawOrder.TotalWeight || 0,
        }),
      );
      dispatch(
        updateField({
          field: "order_id",
          value: `STD-${Math.floor(Math.random() * 10000)}`,
        }),
      );
    }
  }, [rawOrder, dispatch]);

  // Logic chạy Validation khi dữ liệu chuẩn thay đổi
  useEffect(() => {
    const errors = validateLogisticsOrder(normalizedOrder);
    dispatch(setValidationResults(errors));
  }, [normalizedOrder, dispatch]);

  return { normalizedOrder };
};
