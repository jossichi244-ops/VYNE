const MappingRow = ({ data }) => {
  return (
    <div className={`mapping-row ${data.riskLevel.toLowerCase()}`}>
      <div className="field">{data.sourceField}</div>
      <div className="arrow">→</div>
      <div className="field">{data.targetField}</div>

      <div className="confidence">{data.confidence}%</div>

      <div className={`risk ${data.riskLevel.toLowerCase()}`}>
        {data.riskLevel}
        <span className="impact">{data.businessImpact}</span>
      </div>

      {data.issues?.length > 0 && (
        <ul className="issues">
          {data.issues.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MappingRow;
