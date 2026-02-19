export const detectConflicts = ({ rows = [], inspection = {} }) => {
  const issues = [];

  if (!rows.length || !inspection.columns) return issues;

  const columnsInspection = inspection.columns;

  Object.entries(columnsInspection).forEach(([col, info]) => {
    const nullPercent = info.null_percent ?? 0;

    // 🔴 CRITICAL missing field
    if (nullPercent >= 0.3) {
      issues.push({
        type: "CRITICAL",
        column: col,
        message: `High missing rate (${Math.round(nullPercent * 100)}%) in field "${col}"`,
      });
    }

    // 🟡 WARNING missing field
    else if (nullPercent > 0.05) {
      issues.push({
        type: "WARNING",
        column: col,
        message: `Missing values detected in field "${col}"`,
      });
    }
  });

  return issues;
};
