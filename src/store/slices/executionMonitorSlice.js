import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gates: [
    { id: "G-01", status: "Available", driver: "Nguyễn Văn A" },
    { id: "G-02", status: "Busy", driver: "Trần Văn B" },
  ],
  timeline: [
    {
      time: "19:00",
      desc: "Lệnh Dispatch được khởi tạo",
      location: "Trạm HN",
      isCurrent: false,
    },
    {
      time: "19:15",
      desc: "Đã in xong nhãn vận chuyển",
      location: "Trạm HN",
      isCurrent: true,
    },
  ],
  stats: { created: 120, printed: 85, inTransit: 45, delivered: 32 },
};

const executionMonitorSlice = createSlice({
  name: "executionMonitor",
  initialState,
  reducers: {
    assignGate: (state, action) => {
      const { gateId, driverName } = action.payload;
      const gate = state.gates.find((g) => g.id === gateId);
      if (gate) {
        gate.status = "Busy";
        gate.driver = driverName;
      }
    },
    updateTimeline: (state, action) => {
      state.timeline.forEach((t) => (t.isCurrent = false));
      state.timeline.unshift({ ...action.payload, isCurrent: true });
    },
  },
});

export const { assignGate, updateTimeline } = executionMonitorSlice.actions;
export default executionMonitorSlice.reducer;
