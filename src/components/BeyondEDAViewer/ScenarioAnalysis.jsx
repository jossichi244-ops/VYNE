import React, { useState, memo, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
// Vẫn giữ import SCSS. Giả định _ScenarioAnalysis.scss đã được nâng cấp
import "../../assets/styles/_ScenarioAnalysis.scss"; 
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Zap,
    Lightbulb,
    TrendingUp,
    Clock, // Icon mới cho Time Series
    ArrowRight,
} from "lucide-react";

// --- Helper Components ---

// 1. Impact Bar với Glow
const ImpactBar = memo(({ value, maxValue }) => {
    const absoluteValue = Math.abs(parseFloat(value) || 0);
    const widthPercentage = Math.min(100, (absoluteValue / maxValue) * 100);
    const isPositive = (parseFloat(value) || 0) >= 0;

    // Màu sắc: Positive (Xanh Neon) / Negative (Đỏ/Hổ Phách)
    const barClass = isPositive ? "positive" : "negative";

    return (
        <div className="impact-bar-container">
            <motion.div
                className={`impact-bar ${barClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${widthPercentage}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            />
        </div>
    );
});
ImpactBar.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxValue: PropTypes.number,
};


// 2. Truncated List - Tối ưu hóa hiển thị Narratives
function TruncatedList({ items = [], initial = 6, renderer }) {
    const [open, setOpen] = useState(false);
    if (!items || items.length === 0)
        return <div className="empty-state">No relevant data points found.</div>;

    const visibleItems = open ? items : items.slice(0, initial);

    return (
        <div className="truncated-list">
            <ul className="list-content">
                <AnimatePresence initial={false}>
                    {visibleItems.map((it, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            className="list-item"
                        >
                            {renderer ? renderer(it, i) : it}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
            {items.length > initial && (
                <motion.button
                    className="btn-toggle"
                    onClick={() => setOpen(!open)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {open ? "▲ Thu Gọn" : `▼ Xem Thêm (${items.length - initial} mục)`}
                </motion.button>
            )}
        </div>
    );
}
TruncatedList.propTypes = {
    items: PropTypes.array,
    initial: PropTypes.number,
    renderer: PropTypes.func,
};


// 3. Time Series Impact Renderer
const TimeSeriesChartMockup = memo(({ series }) => {
    if (!series || series.length === 0) {
        return <div className="empty-state">No time-series data to plot.</div>;
    }
    
    // Đảm bảo dữ liệu là số và tính toán min/max
    const meanValues = series.map(d => parseFloat(d.mean_value) || 0);
    const minVal = Math.min(...meanValues);
    const maxVal = Math.max(...meanValues);
    const range = maxVal - minVal;
    
    // Lấy tên cột thời gian (ví dụ: 'theo năm')
    const timeLabelCol = Object.keys(series[0]).find(k => k !== 'mean_value') || 'Period';

    // Lấy 5-8 điểm dữ liệu gần nhất để hiển thị trực quan
    const displaySeries = series.slice(-8);

    const firstVal = meanValues[0];
    const lastVal = meanValues[meanValues.length - 1];
    const change = lastVal - firstVal;
    const changePct = (firstVal !== 0 ? (change / firstVal) * 100 : 0);
    const direction = change > 0 ? "Increase" : change < 0 ? "Decrease" : "Stable";
    
    // Hàm chuẩn hóa giá trị cho thanh bar (từ 20% đến 100% chiều cao)
    const normalizeValue = (val) => {
        if (range === 0) return 50; // Tránh chia cho 0, trả về trung bình
        return ((val - minVal) / range) * 80 + 20;
    };

    return (
        <div className={`time-series-mockup trend-${direction.toLowerCase()}`}>
            
            {/* Vùng biểu đồ */}
            <div className="series-preview-line">
                {displaySeries.map((d, i) => (
                    <motion.div
                        key={i}
                        className="data-point"
                        // Chiều cao được chuẩn hóa
                        style={{ height: `${normalizeValue(d.mean_value)}%` }} 
                        initial={{ scaleY: 0.2 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                        {/* Tooltip hiển thị giá trị */}
                        <span className="tooltip-value">{d.mean_value.toFixed(2)}</span>
                    </motion.div>
                ))}
            </div>

            {/* Chú thích Trục X chi tiết */}
            <div className="series-x-axis-labels">
                {displaySeries.map((d, i) => (
                    <span key={i} className="x-label">
                        {d[timeLabelCol]}
                    </span>
                ))}
            </div>

            {/* Bảng tóm tắt chi tiết (Summary Grid) */}
            <div className="series-summary-grid">
                <div className="summary-item">
                    <span className="label">Start Value ({series[0][timeLabelCol]}):</span>
                    <span className="value">{firstVal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span className="label">End Value ({series[series.length - 1][timeLabelCol]}):</span>
                    <span className="value value-end">{lastVal.toFixed(2)}</span>
                </div>
                <div className="summary-item total-change">
                    <span className="label">Total Change:</span>
                    <span className={`value value-${direction.toLowerCase()}`}>
                        {change.toFixed(2)} ({changePct.toFixed(1)}%)
                    </span>
                </div>
            </div>
        </div>
    );
});
TimeSeriesChartMockup.propTypes = {
    series: PropTypes.array,
};


// --- Main Component ---
function ScenarioAnalysis({ title, data }) {
    const {
        narratives = [],
        "ảnh_hưởng": impacts = {},
        "ví_dụ_bản_ghi": samples = [],
        "cột_mới": newCols = [],
        hypotheses = [],
        "okr_draft": okrDraft = { Objective: "Chưa có OKR", KeyResults: [] },
        "time_series_impacts": timeSeriesImpacts = [], 
        ml_coefficients = {}, 
        ml_importances = {},
    } = data || {};

    // --- Time Series Filtering Logic (NEW) ---
    // Mapping tần suất từ code sang tên hiển thị
    const freqMap = useMemo(() => ({
        'W': 'Tuần (W)',
        'M': 'Tháng (M)',
        'Q': 'Quý (Q)',
        'Y': 'Năm (Y)',
    }), []);

    // 1. Tìm ra các tần suất có sẵn
    const availableFrequencies = useMemo(() => {
        const frequencies = new Set();
        timeSeriesImpacts.forEach(ts => {
            if (freqMap[ts.frequency]) {
                frequencies.add(ts.frequency);
            }
        });
        // Sắp xếp ưu tiên: Năm > Quý > Tháng
        const order = ['Y', 'Q', 'M', 'W'];
        const sorted = Array.from(frequencies).sort((a, b) => {
            return order.indexOf(a) - order.indexOf(b);
        });
        return sorted;
    }, [timeSeriesImpacts, freqMap]);
    
    // 2. State cho tần suất đang hoạt động (Mặc định là Năm nếu có, không thì lấy cái đầu tiên)
    const [activeFrequency, setActiveFrequency] = useState('Y');

    // 3. Đặt lại activeFrequency nếu 'Y' không có
    useEffect(() => {
        if (!availableFrequencies.includes(activeFrequency) && availableFrequencies.length > 0) {
            setActiveFrequency(availableFrequencies[0]);
        }
        // Trường hợp không có dữ liệu time series nào, giữ nguyên 'Y'
        if (availableFrequencies.length === 0) {
            setActiveFrequency('');
        }
    }, [availableFrequencies, activeFrequency]);

    // 4. Lọc dữ liệu Time Series theo tần suất
    const filteredTimeSeries = useMemo(() => {
        return timeSeriesImpacts.filter(ts => ts.frequency === activeFrequency);
    }, [timeSeriesImpacts, activeFrequency]);

    // --- End Time Series Filtering Logic ---


    const allImpacts = useMemo(
        () => Object.values(impacts).map((v) => Math.abs(parseFloat(v) || 0)),
        [impacts]
    );
    const maxImpact = Math.max(...allImpacts, 0) || 1; 
    const newColsSet = useMemo(() => new Set(newCols), [newCols]);
    const sampleHeaders = useMemo(
        () => (samples.length > 0 ? Object.keys(samples[0]) : []),
        [samples]
    );

    // Animation variants (Giữ nguyên)
    const wrapperVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const blockVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: [0.17, 0.67, 0.83, 0.67] }, // Custom ease
        },
    };
    
    // OKR logic (Bị ẩn trong code cũ, giữ nguyên logic để tránh lỗi)
    const isOKREmpty = !okrDraft.KeyResults || okrDraft.KeyResults.length === 0;

    return (
        <motion.div
            className="analysis-card scenario-mode"
            role="region"
            aria-label={title}
            variants={blockVariants}
            initial="hidden"
            animate="visible"
        >
            <header className="card-header">
                <h3 className="analysis-title">
                    <Zap className="title-icon icon-neon-zap" /> {title}
                </h3>
                {/* Hiệu ứng sáng lấp lánh nâng cao */}
                <motion.div
                    className="title-sparkle"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                />
            </header>

            <motion.div
                className="scenario-wrapper grid-2-1-1" 
                variants={wrapperVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 1. NARRATIVES & HYPOTHESES - Cột ưu tiên */}
                <div className="scenario-column narrative-hypotheses-stack">
                    <motion.section 
                        className="scenario-block narrative-focus" 
                        variants={blockVariants}
                        // Bổ sung thêm Glow cho Narrative
                        style={{ border: "1px solid rgba(0, 245, 255, 0.2)", boxShadow: "0 0 15px rgba(0, 245, 255, 0.1)" }}
                    >
                        <h4 className="scenario-subtitle">
                            <BookOpen size={20} className="icon-neon" /> EXECUTIVE NARRATIVES (Định Hướng Chiến Lược)
                        </h4>
                        <p className="narrative-intro">
                            Tóm tắt kịch bản, các chuỗi tác động liên hoàn và ý nghĩa chiến lược được mô hình tạo ra:
                        </p>
                        <TruncatedList
                            items={narratives}
                            initial={5}
                            renderer={(n) => (
                                <motion.div
                                    className="narrative-item-content"
                                    initial={{ backgroundColor: "transparent" }}
                                    whileHover={{ backgroundColor: "rgba(0, 245, 255, 0.05)" }}
                                    transition={{ duration: 0.1 }}
                                    dangerouslySetInnerHTML={{
                                        __html: n.replace(/(?:\r\n|\r|\n)/g, "<br>"),
                                    }}
                                />
                            )}
                        />
                    </motion.section>
                    
                    <motion.section className="scenario-block compact-block" variants={blockVariants}>
                        <h4 className="scenario-subtitle">
                            <Lightbulb size={20} className="icon-neon" /> CORE HYPOTHESES (Giả Thuyết Tác Động)
                        </h4>
                        <TruncatedList
                            items={hypotheses}
                            initial={3}
                            renderer={(h) => {
                                const text = h["giả_thuyết"] || h["giả thuyết"] || JSON.stringify(h);
                                const prob = h["xác_suất"] ?? h["xác suất xảy ra"] ?? h["xác suất"] ?? "";
                                return (
                                    <div className="hypothesis-item">
                                        <ArrowRight size={14} className="icon-arrow" />
                                        <span>{text}</span>
                                        {prob !== "" && (
                                            <motion.em
                                                className="prob"
                                                initial={{ opacity: 0.5 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatType: "reverse" }}
                                            >
                                                {" "}— **{prob}%**
                                            </motion.em>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </motion.section>
                </div>


                {/* 2. OKR DRAFT & TIME SERIES IMPACTS - Cột thông tin nhanh */}
                <div className="scenario-column info-stack">
                
                    {/* OKR DRAFT (Giữ nguyên vì đã bị comment trong code gốc) */}

                    <motion.section className="scenario-block time-series-block" variants={blockVariants}>
                        <h4 className="scenario-subtitle">
                            <Clock size={20} className="icon-neon" /> TIME-SERIES TRENDS (Theo Thời Gian)
                        </h4>
                        
                        {/* Bộ lọc tần suất (MỚI) */}
                        {availableFrequencies.length > 1 && (
                            <div className="frequency-selector-group">
                                {availableFrequencies.map(freq => (
                                    <button
                                        key={freq}
                                        onClick={() => setActiveFrequency(freq)}
                                        // Sử dụng Tailwind CSS cho phong cách Neon button
                                         className={`frequency-button ${activeFrequency === freq ? 'active' : ''}`}
                                    >
                                        {freqMap[freq] || freq}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Hiển thị dữ liệu đã lọc */}
                        <TruncatedList
                            items={filteredTimeSeries}
                            initial={2}
                            renderer={(ts, i) => {
                                return (
                                    <div key={i} className="time-series-item"> 
                                        <div className="ts-header">
                                            **{ts.datetime_col}** - {ts.label} ({ts.frequency})
                                        </div>

                                        <TimeSeriesChartMockup series={ts.series} />
                                    </div>
                                );
                            }}
                        />
                        {filteredTimeSeries.length === 0 && availableFrequencies.length > 0 && (
                            <div className="empty-state">
                                No data available for the **{freqMap[activeFrequency] || activeFrequency}** frequency.
                            </div>
                        )}
                        {availableFrequencies.length === 0 && (
                             <div className="empty-state">
                                No Time-Series Impact data provided by the model.
                            </div>
                        )}
                    </motion.section>
                </div>


                {/* 3. IMPACT & DATA SAMPLE - Toàn bộ chiều rộng */}
                <motion.section className="scenario-block full-width" variants={blockVariants}>
                    <h4 className="scenario-subtitle">
                        <TrendingUp size={20} className="icon-neon" /> ESTIMATED IMPACT & DATA TRACE
                    </h4>
                    
                    {/* Bảng Estimated Impact */}
                    <div className="table-wrap impact-table-section">
                        <h5 className="section-minor-title">Variable Impact Scores (Propagation & Correlation)</h5>
                        <table className="scenario-table impact-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "35%" }}>Variable</th>
                                    <th style={{ width: "15%" }}>Impact</th>
                                    <th style={{ width: "50%" }}>Magnitude & Direction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(impacts).length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-state">
                                            No impact estimates available.
                                        </td>
                                    </tr>
                                ) : (
                                    Object.entries(impacts).map(([k, v]) => (
                                        <motion.tr
                                            key={k}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ backgroundColor: "rgba(36, 38, 59, 0.5)" }}
                                        >
                                            <td className="variable-name">{k}</td>
                                            <td className="impact-value">{v}</td>
                                            <td>
                                                <ImpactBar value={v} maxValue={maxImpact} />
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="spacer" />

                    {/* Bảng Data Sample */}
                    <h5 className="section-minor-title">Scenario Data Sample (Top 5 Records - Traceability)</h5>
                    <div className="data-sample-wrapper enhanced-sample">
                        <table className="data-sample-table">
                            <thead>
                                <tr>
                                    {sampleHeaders.map((h) => (
                                        <motion.th
                                            key={h}
                                            className={newColsSet.has(h) ? "highlight-col" : ""}
                                            initial={{ scale: 1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            {h}
                                        </motion.th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {samples.map((row, i) => {
                                    const trends = sampleHeaders.map((h) => {
                                        const val = parseFloat(row[h]);
                                        if (isNaN(val)) return "neutral";
                                        let baselineCol = h;
                                        if (/_scenario/.test(h)) {
                                            baselineCol = h.replace(/_scenario.*$/, "").replace(/_Customer_Type$/, "");
                                        }
                                        const baseline = parseFloat(row[baselineCol]) || 0;
                                        if (val > baseline) return "up";
                                        if (val < baseline) return "down";
                                        return "neutral";
                                    });

                                    return (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            {sampleHeaders.map((h, idx) => {
                                                const trend = trends[idx];
                                                let trendClass = "";
                                                if (trend === "up") trendClass = "trend-up";
                                                if (trend === "down") trendClass = "trend-down";
                                                if (trend === "neutral") trendClass = "trend-neutral";

                                                return (
                                                    <td
                                                        key={h}
                                                        className={`data-cell ${
                                                            newColsSet.has(h) ? "highlight-col" : ""
                                                        } ${trendClass}`}
                                                    >
                                                        {/* Định dạng giá trị để trực quan hơn */}
                                                        {typeof row[h] === "number"
                                                            ? row[h].toFixed(3)
                                                            : String(row[h])}
                                                    </td>
                                                );
                                            })}
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </motion.section>
            </motion.div>
        </motion.div>
    );
}

ScenarioAnalysis.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
};

export default memo(ScenarioAnalysis);
