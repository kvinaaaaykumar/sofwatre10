import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  BubbleController
} from "chart.js";
import { Pie, Doughnut, Line, Bar, Radar, Bubble } from "react-chartjs-2";

// Register all chart elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  BubbleController
);

export default function AdvanceChart() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/entries`)
      .then((res) => {
        setEntries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const todayUTC = new Date().toISOString().split("T")[0];
  const purposes = {};

  entries.forEach((e) => {
    if (!purposes[e.purpose]) purposes[e.purpose] = { today: 0, total: 0 };
    purposes[e.purpose].total++;
    if (e.appointmentDate) {
      const entryUTC = new Date(e.appointmentDate).toISOString().split("T")[0];
      if (entryUTC === todayUTC) purposes[e.purpose].today++;
    }
  });

  const COLORS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#8BC34A", "#D32F2F", "#1976D2", "#F57C00"
  ];

  const labels = Object.keys(purposes);
  const todayData = labels.map((p) => purposes[p].today);
  const totalData = labels.map((p) => purposes[p].total);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { backgroundColor: "#333", titleColor: "#fff", bodyColor: "#fff" }
    }
  };

  // Skeleton Loader UI
  const SkeletonCard = () => (
    <div
      style={{
        height: 300,
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}
      className="animate-pulse"
    >
      <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          padding: "20px"
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
        padding: "20px"
      }}
    >
      {/* Doughnut Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Doughnut Chart</h3>
        <Doughnut data={{ labels, datasets: [{ data: totalData, backgroundColor: COLORS }] }} options={commonOptions} />
      </div>

      {/* Line Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Line Chart</h3>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Today",
                data: totalData,
                borderColor: "#36A2EB",
                backgroundColor: "rgba(54,162,235,0.2)",
                tension: 0.3
              }
            ]
          }}
          options={commonOptions}
        />
      </div>

      {/* Bar Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Bar Chart</h3>
        <Bar data={{ labels, datasets: [{ label: "Total", data: totalData, backgroundColor: "#FF6384" }] }} options={commonOptions} />
      </div>

      {/* Radar Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Radar Chart</h3>
        <Radar
          data={{
            labels,
            datasets: [
              { label: "Today", data: todayData, backgroundColor: "rgba(179,181,198,0.2)", borderColor: "rgba(179,181,198,1)" },
              { label: "Total", data: totalData, backgroundColor: "rgba(255,99,132,0.2)", borderColor: "rgba(255,99,132,1)" }
            ]
          }}
          options={commonOptions}
        />
      </div>

      {/* Bubble Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Bubble Chart</h3>
        <Bubble
          data={{
            datasets: labels.map((label, i) => ({
              label,
              data: [{ x: totalData[i], y: todayData[i], r: totalData[i] * 2 }],
              backgroundColor: COLORS[i % COLORS.length]
            }))
          }}
          options={commonOptions}
        />
      </div>

      {/* Multiple Line Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Multiple Line Chart</h3>
        <Line
          data={{
            labels,
            datasets: [
              { label: "Today", data: todayData, borderColor: "#36A2EB", backgroundColor: "rgba(54,162,235,0.2)" },
              { label: "Total", data: totalData, borderColor: "#FF6384", backgroundColor: "rgba(255,99,132,0.2)" }
            ]
          }}
          options={commonOptions}
        />
      </div>

      {/* Multiple Bar Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Multiple Bar Chart</h3>
        <Bar
          data={{
            labels,
            datasets: [
              { label: "Today", data: todayData, backgroundColor: "#36A2EB" },
              { label: "Total", data: totalData, backgroundColor: "#FF6384" }
            ]
          }}
          options={commonOptions}
        />
      </div>

      {/* Custom Legends Pie Chart */}
      <div style={{ height: 300, background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>Pie Chart</h3>
        <Pie
          data={{ labels, datasets: [{ data: totalData, backgroundColor: COLORS }] }}
          options={{
            ...commonOptions,
            plugins: {
              legend: {
                position: "right",
                labels: { usePointStyle: true, color: "#000" }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
