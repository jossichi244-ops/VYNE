import "./CostImpact.scss";
const CostImpact = ({ scenarios }) => {
  return (
    <div className="cost-impact">
      <h3>Cost & Risk Simulation</h3>
      {scenarios.map((s, i) => (
        <div key={i} className="scenario">
          <strong>{s.label}</strong>
          <div>Margin: {s.margin}%</div>
          <div>DEM/DET Risk: ${s.demDetRisk}</div>
        </div>
      ))}
    </div>
  );
};

export default CostImpact;
