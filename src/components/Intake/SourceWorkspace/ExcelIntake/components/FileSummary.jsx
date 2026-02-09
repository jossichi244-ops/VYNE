const FileSummary = ({ data }) => {
  return (
    <div className="file-summary">
      <div className="kpi">Total Rows: {data.totalRows}</div>
      <div className="kpi valid">Valid: {data.validRows}</div>
      <div className="kpi warn">Missing: {data.missingRequired}</div>
      <div className="kpi critical">Duplicates: {data.duplicates}</div>
      <div className="kpi revenue">
        Revenue: ${data.estimatedRevenue.toLocaleString()}
      </div>
      <div className="kpi risk">
        Risk Cost: ${data.potentialRiskCost.toLocaleString()}
      </div>
    </div>
  );
};

export default FileSummary;
