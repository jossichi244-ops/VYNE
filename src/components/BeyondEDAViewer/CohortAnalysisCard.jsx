import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { User, Calendar, Table, Activity, LineChart as ChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../../assets/styles/_CohortAnalysis.scss"; // File SCSS cần được cập nhật

const getRetentionColor = (rate) => {
 if (rate >= 70) return "high-retention";
 if (rate >= 40) return "medium-retention";
 if (rate >= 10) return "low-retention";
 return "very-low-retention";
};


const extractCohortData = (data) => {
    if (!data || data.error || !data.cohort_matrix || !data.retention_matrix) {
        return { 
            success: false, 
            title: data?.hint || "Missing Cohort Configuration", 
            narrative: data?.error ? `Error: ${data.error}` : "Cohort requires proper data." 
        };
    }

    const cohortMatrix = data.cohort_matrix;
    const cohortKeys = Object.keys(cohortMatrix);

    if (cohortKeys.length === 0) {
        return { success: false, title: "No Cohort Data", narrative: "Cohort data empty" };
    }

    let flatRows = [];
    let totalUsers = 0;
    let validCohorts = [];
    const periodsSet = new Set();
    const chartMap = new Map(); // Dữ liệu cho Line Chart

    cohortKeys.forEach((ck) => {
        const cohortDates = Object.keys(cohortMatrix[ck]).sort();
        const baseUsers = cohortMatrix[ck][cohortDates[0]] || 0;

        // Bỏ qua cohort rỗng (không có người dùng ban đầu)
        if (baseUsers <= 0) return;

        validCohorts.push(ck);
        totalUsers += baseUsers;

        cohortDates.forEach((date, idx) => {
            const periodKey = `P${idx}`;
            periodsSet.add(periodKey);

            const users = cohortMatrix[ck][date] || 0;
            const retention = baseUsers > 0 
                ? Math.round((users / baseUsers) * 100) 
                : 0;

            flatRows.push({ 
                cohort: ck, 
                date: date.split(" ")[0], 
                users, 
                retention, 
                period: periodKey 
            });

            // Xây dựng dữ liệu biểu đồ
            if (!chartMap.has(periodKey)) {
                chartMap.set(periodKey, { period: periodKey });
            }
            chartMap.get(periodKey)[ck] = retention;
        });
    });

    // Cảnh báo nếu tất cả retention = 100%
    const all100 = flatRows.length > 0 && flatRows.every((r) => r.retention === 100);
    const warningNote = all100 
        ? " ⚠️ Warning: All retention values are 100%, check data quality." 
        : "";

    const narrative = `Analyzed **${totalUsers.toLocaleString()}** users across ${validCohorts.length} cohort(s), reflecting actual decay over time.${warningNote}`;

    const periods = Array.from(periodsSet).sort((a, b) => {
        const pA = parseInt(a.replace("P", ""));
        const pB = parseInt(b.replace("P", ""));
        return pA - pB;
    });

    // Chuyển Map thành Array cho Recharts
    const chartData = Array.from(chartMap.values()).sort((a, b) => {
        const pA = parseInt(a.period.replace("P", ""));
        const pB = parseInt(b.period.replace("P", ""));
        return pA - pB;
    });

    return {
        success: true,
        title: "Cohort Retention Matrix & Trends",
        rows: flatRows,
        periods,
        chartData,
        cohortKeys: validCohorts,   // chỉ giữ cohort có user thật
        total_users: totalUsers,
        narrative,
    };
};


const CohortAnalysisCard = memo(({ data }) => {
    // Sử dụng useMemo để tính toán model chỉ khi data thay đổi
    const model = useMemo(() => extractCohortData(data), [data]);

    const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.6, 0.3, 0.9] } },
   };

   if (!model.success) {
      return (
           <motion.div className="cohort-card analysis-error" variants={cardVariants} initial="hidden" animate="visible">
            <div className="card-header">
             <h3 className="cohort-title">Cohort Analysis Unavailable</h3>
            </div>
            <p className="narrative-summary error-text">{model.narrative}</p>
           </motion.div>
      );
   }

    const lineColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

 return (
  <motion.div
   className="cohort-card executive-mode matrix-vision"
   variants={cardVariants}
   initial="hidden"
   animate="visible"
   role="region"
   aria-label={model.title}
  >
   <header className="card-header">
    <Activity size={24} className="icon-main" />
    <h3 className="cohort-title">{model.title}</h3>
   </header>
      
      {/* Narrative Summary */}
      <section className="narrative-section">
    <p className="narrative-summary">{model.narrative}</p>
   </section>
      
      {/* Main Content: Chart (60%) and Table (40%) */}
      <div className="cohort-grid-layout">
        
        {/* --- 1. Line Chart View (Trực quan hóa sự suy giảm) --- */}
        <div className="chart-panel">
            <h4 className="panel-title">Retention Trend Over Periods</h4>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={model.chartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                        <XAxis 
                            dataKey="period" 
                            className="chart-axis" 
                            tickLine={false} 
                            axisLine={{ stroke: '#475569' }} 
                            label={{ value: 'Period Index (P0, P1, P2...)', position: 'bottom', fill: '#94a3b8' }}
                        />
                        <YAxis 
                            className="chart-axis" 
                            tickLine={false} 
                            axisLine={false} 
                            domain={[0, 100]} 
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                            formatter={(value) => [`${value}% Retention`, 'Rate']}
                            labelFormatter={(label) => `Period: ${label}`}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0', borderRadius: '6px' }} 
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                        
                        {model.cohortKeys.map((key, index) => (
                            <Line 
                                key={key} 
                                type="monotone" 
                                dataKey={key} 
                                name={key}
                                stroke={lineColors[index % lineColors.length]}
                                strokeWidth={3} 
                                dot={{ r: 4 }} 
                                activeDot={{ r: 7 }} 
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* --- 2. Table and Key Metrics --- */}
        <div className="table-metric-panel">
            <h4 className="panel-title">Key Metrics</h4>
            <div className="metric-summary">
            <div className="metric-block">
             <p className="metric-label"><User size={16} /> Total Users</p>
             <h4 className="metric-value">{model.total_users.toLocaleString()}</h4>
            </div>
            <div className="metric-block">
             <p className="metric-label"><Calendar size={16} /> Cohort Count</p>
             <h4 className="metric-value">{model.cohortKeys.length}</h4>
            </div>
        </div>

            <h4 className="panel-title table-title">Detailed Retention Matrix (Flattened)</h4>
            <motion.div className="retention-table-container" initial={{ opacity: 0, scaleY: 0.9 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <table className="retention-table">
             <thead>
              <tr>
               <th>Cohort</th>
               <th>Date</th>
               <th>Period</th>
               <th>Users</th>
               <th>Retention %</th>
              </tr>
             </thead>
             <tbody>
              {model.rows.map((row, idx) => (
               <tr key={idx}>
                <td>{row.cohort}</td>
                <td>{row.date}</td>
                <td>{row.period}</td>
                <td>{row.users.toLocaleString()}</td>
                <td className={`retention-cell ${getRetentionColor(row.retention)}`}>{row.retention}%</td>
               </tr>
              ))}
             </tbody>
            </table>
        </motion.div>
        </div>
      </div>
      
  </motion.div>
 );
});

CohortAnalysisCard.propTypes = { data: PropTypes.object.isRequired };

export default CohortAnalysisCard;