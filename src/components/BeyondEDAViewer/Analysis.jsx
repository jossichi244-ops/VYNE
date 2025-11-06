import React from "react";
import "../../assets/styles/Analysis.scss";
import ScenarioAnalysis from "./ScenarioAnalysis";
import GenericAnalysis from "./GenericAnalysis";

export default function Analysis({ title, data }) {
  const isScenario = /scenario/i.test(title) || (data && (data.narratives || data["ảnh_hưởng"]));
  return isScenario ? (
    <ScenarioAnalysis title={title} data={data} />
  ) : (
    <GenericAnalysis title={title} data={data} />
  );
}