import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleSelectOrder } from "../store/slices/executionFlowSlice";

export const useExecutionScanner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Giả lập: Nếu gõ "ENTER" sau một chuỗi số, coi như đã scan xong
      if (e.key === "Enter") {
        // Trong thực tế sẽ lấy giá trị từ input buffer
        console.log("Barcode Scanned");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const scanOrder = (id) => {
    dispatch(toggleSelectOrder(id));
  };

  return { scanOrder };
};
