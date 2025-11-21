import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  ChevronDown,
  ChevronRight,
  FileCode,
  Database,
  FolderTree,
  Search,
  Minimize2,
  Maximize2
} from "lucide-react";
import "../../assets/styles/IntelliTraceViewer.scss";

const DataNode = ({ label, value, level = 0, globalOpen, filter = "", animationDelay = 0 }) => {
  const [open, setOpen] = useState(globalOpen);
  const isObject = typeof value === "object" && value !== null;
  const isArray = Array.isArray(value);

  // 🔄 Đồng bộ state mở khi globalOpen thay đổi
  useEffect(() => {
    if (isObject) setOpen(globalOpen);
  }, [globalOpen]);

  const icon = isArray ? <FolderTree size={14}/> :
               isObject ? <Database size={14}/> :
               <FileCode size={14}/> ;

  // 🧩 Highlight phần trùng với từ khóa tìm kiếm
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <motion.span
          key={i}
          className="highlight-glow"
          initial={{ backgroundColor: "rgba(255,255,0,0.2)", color: "#FFD700" }}
          animate={{ backgroundColor: "rgba(255,255,0,0.1)", color: "#fff700" }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          {part}
        </motion.span>
      ) : (
        part
      )
    );
  };

  const formatValue = (val) => {
    if (typeof val === "number") return <span className="val-num">{val}</span>;
    if (typeof val === "boolean") return <span className="val-bool">{String(val)}</span>;
    if (val === null) return <span className="val-null">null</span>;
    if (typeof val === "string") return <span className="val-str">"{val}"</span>;
    return String(val);
  };

  return (
    <motion.div
      className={`data-node level-${level}`}
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: animationDelay }}
    >
      <div
        className={`data-node-header ${isObject ? "is-object" : ""}`}
        onClick={() => isObject && setOpen(!open)}
        style={{ paddingLeft: `${level * 1.2}rem` }}
      >
        <span className="data-node-icon">{icon}</span>
        <span className="data-node-label">
          {highlightText(label, filter)}
        </span>
        {isObject ? (
          <span className="data-node-toggle">
            {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/> }
          </span>
        ) : (
          <span className="data-node-value">{formatValue(value)}</span>
        )}
      </div>

      <AnimatePresence>
        {open && isObject && (
          <motion.div
            className="data-node-children"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {Object.entries(value).map(([k, v], i) => (
              <DataNode
                key={i}
                label={k}
                value={v}
                level={level + 1}
                globalOpen={globalOpen}
                filter={filter}
                animationDelay={i * 0.05} // 🌊 cascade effect
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 🔍 Hàm lọc cây đệ quy
const filterTree = (obj, query) => {
  if (!query) return obj;
  if (typeof obj !== "object" || obj === null) return null;

  const filtered = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.toLowerCase().includes(query.toLowerCase())) {
      filtered[key] = val;
    } else if (typeof val === "object") {
      const nested = filterTree(val, query);
      if (nested && Object.keys(nested).length > 0) {
        filtered[key] = nested;
      }
    }
  }
  return filtered;
};

const IntelliTraceViewer = ({ data }) => {
  const [globalOpen, setGlobalOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredData = filterTree(data, filter);

  return (
    <motion.div
      className="intellitrace-viewer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="intellitrace-header">
        <Layers size={20} className="trace-icon"/>
        <h3 className="trace-title">Backend IntelliTrace Console</h3>
        <p className="trace-subtitle">
          Realtime backend data explorer — cascade animation & neon search.
        </p>

        <div className="trace-controls">
          <div className="search-bar">
            <Search size={14}/>
            <input
              placeholder="Tìm khóa dữ liệu..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button onClick={() => setGlobalOpen(!globalOpen)} className="btn-collapse">
            {globalOpen ? <Minimize2 size={14}/> : <Maximize2 size={14}/> }
            {globalOpen ? "Collapse All" : "Expand All"}
          </button>
        </div>
      </div>

      <div className="trace-content">
        {Object.entries(filteredData || {}).map(([key, value], i) => (
          <DataNode
            key={i}
            label={key}
            value={value}
            level={0}
            globalOpen={globalOpen}
            filter={filter}
            animationDelay={i * 0.05}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default IntelliTraceViewer;
