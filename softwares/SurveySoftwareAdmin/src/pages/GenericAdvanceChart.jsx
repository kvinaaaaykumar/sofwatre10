import React from "react";
import { Pie, Doughnut, Line, Bar, Radar, Bubble } from "react-chartjs-2";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8BC34A",
  "#D32F2F",
  "#1976D2",
  "#F57C00",
];

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      backgroundColor: "#333",
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },
};

export default function GenericAdvanceChart({ title, dataMap, loading }) {
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        ⏳ Loading {title}...
      </div>
    );
  }

  if (!dataMap || Object.keys(dataMap).length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        🚫 No {title} data available
      </div>
    );
  }

  const labels = Object.keys(dataMap);
  const totalData = labels.map((opt) => dataMap[opt].total);
  const todayData = labels.map((opt) => dataMap[opt].today);

  return (
    <div style={{ marginBottom: "50px" }}>
      <h2 className="text-slate-700 text-2xl font-bold mb-4 text-center">
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
        }}
      >
        {/* Doughnut Chart */}
        <div
          style={{
            height: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <h3 className="font-semibold mb-2">Doughnut</h3>
          <Doughnut
            data={{
              labels,
              datasets: [{ data: totalData, backgroundColor: COLORS }],
            }}
            options={commonOptions}
          />
        </div>

        {/* Pie Chart */}
        <div
          style={{
            height: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <h3 className="font-semibold mb-2">Pie</h3>
          <Pie
            data={{
              labels,
              datasets: [{ data: totalData, backgroundColor: COLORS }],
            }}
            options={commonOptions}
          />
        </div>

        {/* Bar Chart */}
        <div
          style={{
            height: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <h3 className="font-semibold mb-2">Bar</h3>
          <Bar
            data={{
              labels,
              datasets: [
                { label: "Total", data: totalData, backgroundColor: "#36A2EB" },
              ],
            }}
            options={commonOptions}
          />
        </div>

        {/* Line Chart */}
        <div
          style={{
            height: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <h3 className="font-semibold mb-2">Line</h3>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Total",
                  data: totalData,
                  borderColor: "#FF6384",
                  backgroundColor: "rgba(255,99,132,0.2)",
                },
              ],
            }}
            options={commonOptions}
          />
        </div>

        {/* Radar Chart */}
        <div
          style={{
            height: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <h3 className="font-semibold mb-2">Radar</h3>
          <Radar
            data={{
              labels,
              datasets: [
                {
                  label: "Total",
                  data: totalData,
                  backgroundColor: "rgba(54,162,235,0.2)",
                  borderColor: "#36A2EB",
                },
              ],
            }}
            options={commonOptions}
          />
        </div>

        {/* Bubble Chart */}
        <div
          style={{
            height: 300,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <h3 className="font-semibold mb-2">Bubble</h3>
          <Bubble
            data={{
              datasets: labels.map((label, i) => ({
                label,
                data: [
                  { x: totalData[i], y: todayData[i], r: totalData[i] * 2 },
                ],
                backgroundColor: COLORS[i % COLORS.length],
              })),
            }}
            options={commonOptions}
          />
        </div>
      </div>
    </div>
  );
}
