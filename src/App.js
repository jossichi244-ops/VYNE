import { useEffect } from "react";
import React from "react";
import AppRoutes from "./routes";
import { startUnloadTracking } from "./services/authTrackingService";

import "./index.css";
function App() {
  useEffect(() => {
    startUnloadTracking();
  }, []);
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
