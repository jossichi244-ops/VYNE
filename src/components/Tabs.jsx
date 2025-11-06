// src/components/Tabs.jsx
import React, { useState } from "react";
import "../assets/styles/tabs.scss";

/**
 * Tabbed interface component.
 * Suitable for displaying segmented views in dashboards or data analysis UIs.
 *
 * @param {Array} tabs - Array of tab objects with `id`, `title`, and `content`.
 */
export default function Tabs({ tabs }) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTabId)?.content;

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTabId === tab.id ? "active" : ""}`}
            onClick={() => setActiveTabId(tab.id)}>
            {tab.title}
          </button>
        ))}
      </div>

      <div className="tabs-content">{activeTabContent}</div>
    </div>
  );
}
