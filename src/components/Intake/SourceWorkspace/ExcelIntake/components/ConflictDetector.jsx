const ConflictDetector = ({ issues }) => {
  return (
    <div className="conflict-detector">
      <h3>Conflicts & Duplicates</h3>
      {issues.map((c, i) => (
        <div key={i} className={`conflict ${c.severity.toLowerCase()}`}>
          <strong>{c.type}</strong>: {c.message}
          <span>Rows: {c.affectedRows.join(", ")}</span>
        </div>
      ))}
    </div>
  );
};

export default ConflictDetector;
