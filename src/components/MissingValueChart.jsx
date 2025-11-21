import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MissingValueChart({ summary }) {
  if (!summary) return null;

  const data = Object.keys(summary.before_missing).map((col) => ({
    column: col,
    before: summary.before_missing[col],
    after: summary.after_missing[col],
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Thiếu dữ liệu trước vs sau cleaning</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="column" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="before" fill="#d9534f" name="Trước" />
          <Bar dataKey="after" fill="#5cb85c" name="Sau" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
