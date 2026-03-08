import React from "react";
import { DefaultReportTemplate } from "./TemplateRegistry";
import SectionRenderer from "./SectionRenderer";

const ReportContainer = ({ dataset }) => {
  console.log("REPORT DATASET:", dataset);
  return (
    <>
      {DefaultReportTemplate.map((section) => (
        <SectionRenderer
          key={section.key}
          sectionKey={section.key}
          dataset={dataset}
        />
      ))}
    </>
  );
};

export default ReportContainer;
