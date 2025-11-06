import React, { useState, memo, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ChevronRight, Zap } from "lucide-react";
import "../../assets/styles/_GenericAnalysis.scss";
import ToastNotification from "./ToastNotification";
const JsonViewerItem = memo(({ itemKey, itemValue, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const type = Array.isArray(itemValue) ? "array" : typeof itemValue;
  const isObjectOrArray = type === "object" || type === "array";

  // Xác định số lượng phần tử/thuộc tính
  const length = isObjectOrArray && itemValue ? Object.keys(itemValue).length : null;

  const keyStyle = `json-key json-key-level-${Math.min(level, 4)}`;

  if (!isObjectOrArray || itemValue === null) {
    // Hiển thị giá trị nguyên thủy (primitive)
    let displayValue = String(itemValue);
    if (type === 'string') displayValue = `"${displayValue}"`;

    const valueClass = `json-value json-type-${type}`;
    
    return (
      <motion.li 
        className="json-item-primitive"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.1 }}
      >
        <span className={keyStyle}>{itemKey}</span>: <span className={valueClass}>{displayValue}</span>
      </motion.li>
    );
  }

  // Hiển thị Object hoặc Array
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const summary = type === "array" ? `[${length} items]` : `{${length} properties}`;

  return (
    <motion.li 
      className={`json-item-container ${isExpanded ? "expanded" : "collapsed"}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: level * 0.05 }}
    >
      <div className="json-header" onClick={toggleExpand}>
        <ChevronRight size={16} className={`json-toggle-icon ${isExpanded ? "rotated" : ""}`} />
        <span className={keyStyle}>{itemKey}</span>: <span className="json-summary">{summary}</span>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            className="json-list nested-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {Object.entries(itemValue).map(([key, value]) => (
              <JsonViewerItem key={key} itemKey={key} itemValue={value} level={level + 1} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
});

JsonViewerItem.propTypes = {
  itemKey: PropTypes.string,
  itemValue: PropTypes.any,
  level: PropTypes.number,
};


// Component chính đã được tái thiết kế
function GenericAnalysis({ title, data }) {
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "" });
  // JSON stringify chỉ để tính năng Copy hoạt động
  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const dataEntries = useMemo(() => data ? Object.entries(data) : [], [data]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setToast({ isVisible: true, message: "JSON Structure Copied!", type: "info" });
  };
  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  return (
    <div className="analysis-card holographic-mode" role="region" aria-label={title}>
      <div className="card-header">
        <h3 className="analysis-title"><Zap size={24} className="title-icon" /> {title}</h3>
        <div className="actions">
          <motion.button 
            className="btn-action" 
            onClick={handleCopy}
            whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(0, 245, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy size={16} /> Copy JSON
          </motion.button>
          <motion.button 
            className="btn-action collapse-toggle" 
            onClick={() => setCollapsed(!collapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {collapsed ? "Drill Down (Expand)" : "Roll Up (Collapse)"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            key="content"
            className="json-viewer-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ul className="json-list root-list">
              {dataEntries.map(([key, value]) => (
                // Dùng một cấp độ giả định 'root' để JsonViewerItem có thể đệ quy
                <JsonViewerItem key={key} itemKey={key} itemValue={value} level={0} />
              ))}
            </ul>
            {dataEntries.length === 0 && <div className="empty-state">No data structure to display.</div>}
          </motion.div>
        )}
        {collapsed && (
          <motion.div 
            key="collapsed"
            className="analysis-collapsed-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            **Data Structure Collapsed.** Click "Drill Down" to re-evaluate the data tree.
          </motion.div>
        )}
      </AnimatePresence>
      <ToastNotification 
        message={toast.message} 
        type={toast.type}
        isVisible={toast.isVisible} 
        onClose={handleCloseToast} 
      />
    </div>
  );
}

GenericAnalysis.propTypes = {
  title: PropTypes.string,
  data: PropTypes.any,
};

export default memo(GenericAnalysis);