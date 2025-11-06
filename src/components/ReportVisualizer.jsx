// src/components/ReportVisualizer.jsx
import React from "react";
import { Card, Collapse, Typography, Tag, Space } from "antd";
import {
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClusterOutlined,
  BulbOutlined,
  RocketOutlined,
  AuditOutlined,
} from "@ant-design/icons";

import BusinessInsightsSection from "./BusinessInsightsSection"; // Import component chuyên biệt
import "../assets/styles/ReportVisualizer.scss";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

// Helper: render 1 dòng insight với style khác nhau
const renderInsightLine = (text) => {
  if (text.startsWith("✅")) {
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        {text.substring(1).trim()}
      </Tag>
    );
  }
  if (text.startsWith("⚠️") || text.startsWith("🚨")) {
    return (
      <Tag icon={<WarningOutlined />} color="warning">
        {text.substring(1).trim()}
      </Tag>
    );
  }
  if (
    text.startsWith("📌") ||
    text.startsWith("📊") ||
    text.startsWith("🔎") ||
    text.startsWith("💡") ||
    text.startsWith("📑")
  ) {
    return <Title level={4}>{text.substring(2).trim()}</Title>;
  }
  return <p>{text.trim()}</p>;
};

// Parse report string thành object { sectionTitle: [lines...] }
const parseReport = (reportString) => {
  const sections = reportString.split(/\n\n(?=.)/); // Tách theo 2 newline
  const parsed = {};

  sections.forEach((section) => {
    const lines = section.split("\n").filter((line) => line.trim() !== "");
    if (lines.length > 0) {
      // Lấy header và loại bỏ emoji
      const header = lines[0].replace(/^(📌|📊|🔎|⚠️|💡|📑)\s*/, "").trim();
      const content = lines.slice(1);
      parsed[header] = content;
    }
  });

  return parsed;
};

const ReportVisualizer = ({ report }) => {
  if (!report) {
    return <p>No report available.</p>;
  }

  const parsedReport = parseReport(report);

  // Thứ tự các section và icon tương ứng
  const sectionOrder = [
    { title: "Executive Summary", icon: <BulbOutlined />, key: "Executive Summary" },
    { title: "Data Quality & Reliability", icon: <AuditOutlined />, key: "Data Quality & Reliability" },
    {
      title: "Business Insights",
      icon: <ClusterOutlined />,
      key: "Business Insights",
      component: BusinessInsightsSection,
    },
    { title: "Risks & Opportunities", icon: <WarningOutlined />, key: "Risks & Opportunities" },
    { title: "Strategic Recommendations", icon: <RocketOutlined />, key: "Strategic Recommendations" },
    { title: "Appendix / Technical Notes", icon: <InfoCircleOutlined />, key: "Appendix / Technical Notes" },
  ];

  return (
    <div className="report-visualizer-container">
      <Card className="report-card">
        <Title level={3} className="report-main-title">
          Data Analysis Report (EDA)
        </Title>
        <Paragraph type="secondary" className="report-main-subtitle">
          Automatic synthesis of findings and strategic recommendations based on data.
        </Paragraph>

        <Collapse accordion ghost expandIconPosition="right" className="report-collapse">
          {sectionOrder.map(({ title, icon, key, component: Component }) => {
            const sectionContent = parsedReport[key];
            if (!sectionContent) return null;

            return (
              <Panel
                header={
                  <Space>
                    <span className="panel-icon">{icon}</span> {title}
                  </Space>
                }
                key={key}
              >
                {Component ? (
                  <Component content={sectionContent} />
                ) : (
                  <ul className="section-content-list">
                    {sectionContent.map((line, i) => (
                      <li key={i}>{renderInsightLine(line)}</li>
                    ))}
                  </ul>
                )}
              </Panel>
            );
          })}
        </Collapse>
      </Card>
    </div>
  );
};

export default ReportVisualizer;
