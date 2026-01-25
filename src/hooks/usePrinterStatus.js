import { useSelector, useDispatch } from "react-redux";
import { setPrinterError } from "../store/slices/printSlice";

export const usePrinterStatus = () => {
  const dispatch = useDispatch();
  const { printerStatus, paperLevel, isPrinting } = useSelector(
    (state) => state.print,
  );

  const checkConnectivity = () => {
    // Giả lập rủi ro: 10% máy in mất kết nối khi đang in
    if (isPrinting && Math.random() < 0.1) {
      dispatch(setPrinterError());
    }
  };

  return {
    status: printerStatus,
    isReady: printerStatus === "online" && paperLevel > 0,
    paperLevel,
    checkConnectivity,
  };
};
