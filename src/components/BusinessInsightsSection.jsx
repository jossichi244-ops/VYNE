import React from "react";
import { Card, Collapse, Typography, Tag, Alert, Space } from "antd";
import {
  ClusterOutlined,
  LineChartOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Paragraph } = Typography;
const { Panel } = Collapse;

// Helper to handle parsing and rendering of specific parts of the report.
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
  return <p>{text.trim()}</p>;
};

// Main component for the Business Insights section.
const BusinessInsightsSection = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <Alert
        message="Không có dữ liệu phân tích chuyên sâu."
        description="Hãy đảm bảo dữ liệu của bạn đủ lớn và có các thuộc tính phù hợp để thực hiện phân tích nâng cao."
        type="info"
        showIcon
      />
    );
  }

  // A more robust parser to handle the different insight types.
  const parseInsights = (lines) => {
    const insights = {
      segmentation: { header: null, groups: [] },
      timeSeries: { header: null, details: [] },
      keyDrivers: { anova: [], chi2: [] },
    };

    let currentSection = null;
    let currentBlock = null; // { type: 'anova' | 'chi2', data: { main: ..., details: [...] } }

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // --- Xác định section chính ---
      if (trimmedLine.startsWith("- Dữ liệu được phân chia")) {
        currentSection = "segmentation";
        insights.segmentation.header = trimmedLine.replace(/^- /, "");
        currentBlock = null;
      } else if (trimmedLine.startsWith("- Phân tích chuỗi thời gian")) {
        currentSection = "timeSeries";
        insights.timeSeries.header = trimmedLine.replace(/^- /, "");
        currentBlock = null;
      }
      // --- Xác định block Key Drivers ---
      else if (trimmedLine.startsWith("- ✅ Kiểm định ANOVA")) {
        currentSection = "keyDrivers";
        currentBlock = {
          type: "anova",
          data: { main: trimmedLine, details: [] },
        };
        insights.keyDrivers.anova.push(currentBlock.data);
      } else if (trimmedLine.startsWith("- ✅ Kiểm định Chi-square")) {
        currentSection = "keyDrivers";
        currentBlock = {
          type: "chi2",
          data: { main: trimmedLine, details: [] },
        };
        insights.keyDrivers.chi2.push(currentBlock.data);
      }
      // --- Gán dòng con vào block hiện tại ---
      else if (
        currentSection === "segmentation" &&
        trimmedLine.startsWith("Nhóm")
      ) {
        insights.segmentation.groups.push(trimmedLine);
      } else if (
        currentSection === "timeSeries" &&
        (trimmedLine.startsWith("Có tính mùa vụ") ||
          trimmedLine.startsWith("Xu hướng") ||
          trimmedLine.startsWith("Phát hiện"))
      ) {
        insights.timeSeries.details.push(trimmedLine);
      } else if (currentSection === "keyDrivers") {
        if (
          currentBlock &&
          (trimmedLine.startsWith("→") ||
            trimmedLine.startsWith("- Kết quả") ||
            trimmedLine.startsWith("- **So what**") ||
            trimmedLine.startsWith("- **Now what**") ||
            trimmedLine.startsWith("- **Root cause**"))
        ) {
          currentBlock.data.details.push(trimmedLine);
        }
      }
      // --- Nếu gặp dòng mới không phải →, reset block (an toàn) ---
      else if (currentSection === "keyDrivers" && trimmedLine.startsWith("-")) {
        currentBlock = null;
      }
    });

    return insights;
  };

  const parsedInsights = parseInsights(content);

  return (
    <div className="insights-grid">
      {/* === Segmentation Section === */}
      {parsedInsights.segmentation.header && (
        <Card
          title={
            <Space>
              <ClusterOutlined /> Phân khúc đối tượng
            </Space>
          }
          className="insights-card">
          <Paragraph className="card-description">
            {parsedInsights.segmentation.header}
          </Paragraph>
          <Collapse ghost>
            <Panel header="Xem chi tiết các nhóm" key="1">
              <ul className="cluster-list">
                {parsedInsights.segmentation.groups.map((group, index) => (
                  <li key={index} className="cluster-item">
                    {renderInsightLine(group)}
                  </li>
                ))}
              </ul>
            </Panel>
          </Collapse>
        </Card>
      )}

      {/* === Time Series Section === */}
      {parsedInsights.timeSeries.header && (
        <Card
          title={
            <Space>
              <LineChartOutlined /> Phân tích Chuỗi Thời gian
            </Space>
          }
          className="insights-card">
          <Paragraph className="card-description">
            {parsedInsights.timeSeries.header}
          </Paragraph>
          <ul className="ts-insights-list">
            {parsedInsights.timeSeries.details.map((detail, index) => (
              <li key={index}>{renderInsightLine(detail)}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* === Key Drivers Section === */}
      {(parsedInsights.keyDrivers.anova.length > 0 ||
        parsedInsights.keyDrivers.chi2.length > 0) && (
        <Card
          title={
            <Space>
              <BulbOutlined /> Các Yếu Tố Tác Động
            </Space>
          }
          className="insights-card">
          <Collapse ghost>
            {/* ANOVA Insights */}
            {parsedInsights.keyDrivers.anova.map((insight, index) => (
              <Panel
                header={renderInsightLine(insight.main)}
                key={`anova-${index}`}>
                <Paragraph className="explanation-text">
                  {insight.details.join(" ")}
                </Paragraph>
              </Panel>
            ))}
            {/* Chi-square Insights */}
            {parsedInsights.keyDrivers.chi2.map((insight, index) => (
              <Panel
                header={renderInsightLine(insight.main)}
                key={`chi2-${index}`}>
                <Paragraph className="explanation-text">
                  {insight.details.join(" ")}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}
    </div>
  );
};

export default BusinessInsightsSection;
