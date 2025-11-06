import React from "react";
import { Tabs, Table, Tag, Tooltip, Alert, Typography, Divider } from "antd";
import {
  BarChartOutlined,
  OrderedListOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import "../assets/styles/descriptive-panel.scss";

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

const DescriptivePanel = ({ descriptive }) => {
  const hasNumeric =
    descriptive?.numeric && Object.keys(descriptive.numeric).length > 0;
  const hasCategorical =
    descriptive?.categorical && Object.keys(descriptive.categorical).length > 0;
  const hasRemarks = descriptive?.remarks && descriptive.remarks.length > 0;

  if (!hasNumeric && !hasCategorical && !hasRemarks) {
    return (
      <Alert
        message="No descriptive statistics available."
        type="info"
        showIcon
      />
    );
  }

  // 🔢 Numeric table data
  const numericColumns = Object.entries(descriptive.numeric || {}).map(
    ([key, value]) => ({
      key,
      column: key,
      ...value,
    })
  );

  const numericCols = [
    { title: "Column", dataIndex: "column", key: "column" },
    { title: "Count", dataIndex: "count", key: "count" },
    { title: "Min", dataIndex: "min", key: "min" },
    { title: "Max", dataIndex: "max", key: "max" },
    {
      title: "Mean",
      dataIndex: "mean",
      key: "mean",
      render: (val) => val?.toFixed(2),
    },
    { title: "Median", dataIndex: "median", key: "median" },
    {
      title: "Std Dev",
      dataIndex: "std",
      key: "std",
      render: (val) => val?.toFixed(2),
    },
    {
      title: "Skewness",
      dataIndex: "skew",
      key: "skew",
      render: (val) =>
        val > 1 || val < -1 ? (
          <Tag color="volcano">{val.toFixed(2)}</Tag>
        ) : (
          <Tag>{val.toFixed(2)}</Tag>
        ),
    },
    {
      title: "Kurtosis",
      dataIndex: "kurtosis",
      key: "kurtosis",
      render: (val) => <span>{val.toFixed(2)}</span>,
    },
    {
      title: "Outliers",
      dataIndex: "outliers",
      key: "outliers",
      render: (val) =>
        val > 0 ? <Tag color="red">{val}</Tag> : <Tag color="green">0</Tag>,
    },
  ];

  // 🔠 Categorical table data
  const categoricalColumns = Object.entries(descriptive.categorical || {}).map(
    ([key, value]) => ({
      key,
      column: key,
      ...value,
    })
  );

  const categoricalCols = [
    { title: "Column", dataIndex: "column", key: "column" },
    { title: "Count", dataIndex: "count", key: "count" },
    { title: "Unique Values", dataIndex: "unique", key: "unique" },
    {
      title: "Top Values",
      dataIndex: "top_values",
      key: "top_values",
      render: (values) =>
        values.map((item, index) => (
          <Tooltip title={`Percentage: ${item.percent}%`} key={index}>
            <Tag>
              {item.value} ({item.count})
            </Tag>
          </Tooltip>
        )),
    },
  ];

  return (
    <section className="descriptive-panel">
      <Typography className="mb-4">
        <Title level={4}>Descriptive Statistics</Title>
        <Paragraph type="secondary">
          Below are descriptive statistics for both numeric and categorical
          data, including tables, charts, and system-generated analytical
          remarks.
        </Paragraph>
      </Typography>

      <Tabs defaultActiveKey="1">
        {/* ✅ Tab 1: Numeric */}
        <TabPane
          tab={
            <span>
              <BarChartOutlined /> Numeric
            </span>
          }
          key="1">
          {hasNumeric ? (
            <Table
              columns={numericCols}
              dataSource={numericColumns}
              pagination={{ pageSize: 10 }}
              size="middle"
              bordered
            />
          ) : (
            <Alert message="No numeric data available." type="info" />
          )}
        </TabPane>

        {/* ✅ Tab 2: Categorical */}
        <TabPane
          tab={
            <span>
              <OrderedListOutlined /> Categorical
            </span>
          }
          key="2">
          {hasCategorical ? (
            <>
              <Table
                columns={categoricalCols}
                dataSource={categoricalColumns}
                pagination={{ pageSize: 10 }}
                size="middle"
                bordered
              />
              <Divider orientation="left">
                Distribution Charts (Top Values)
              </Divider>

              {categoricalColumns.map((col) => (
                <div key={col.key} style={{ marginBottom: 32 }}>
                  <Title level={5}>{col.column}</Title>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={col.top_values}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="value" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </>
          ) : (
            <Alert message="No categorical data available." type="info" />
          )}
        </TabPane>

        {/* ✅ Tab 3: Remarks */}
        <TabPane
          tab={
            <span>
              <InfoCircleOutlined /> Remarks
            </span>
          }
          key="3">
          {hasRemarks ? (
            <ul className="remarks-list">
              {descriptive.remarks.map((r, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  <Tag color="gold">#remark</Tag> {r}
                </li>
              ))}
            </ul>
          ) : (
            <Alert
              message="No significant remarks found."
              type="success"
              showIcon
            />
          )}
        </TabPane>
      </Tabs>
    </section>
  );
};

export default DescriptivePanel;
