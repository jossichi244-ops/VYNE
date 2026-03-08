import ExecutiveSummary from "../Sections/ExecutiveSummary";
import DatasetOverview from "../Sections/DatasetOverview";
import DescriptiveStats from "../Sections/DescriptiveStats";
import Relationships from "../Sections/Relationships";
// import Visualizations from "../Sections/Visualizations";
import Insights from "../Sections/Insights";
import AdvancedAnalysis from "../Sections/AdvancedAnalysis";
import Scenarios from "../Sections/Scenarios";

export const ComponentMapper = {
  executive_summary: ExecutiveSummary,
  dataset_overview: DatasetOverview,
  descriptive_stats: DescriptiveStats,
  relationships: Relationships,
  // visualizations: Visualizations,
  insights: Insights,
  advanced_analysis: AdvancedAnalysis,
  businessReport: Scenarios,
};
