import React from "react";
import { useReportContext } from "./ReportContext";
import useReportUpload from "./hooks/useReportUpload";
import Loading from "../../../Common/Loading";

const ReportUploader = () => {
  const { loading, error } = useReportContext();
  const { handleUpload } = useReportUpload();

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls,.csv,.json"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {loading && <Loading />}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ReportUploader;
