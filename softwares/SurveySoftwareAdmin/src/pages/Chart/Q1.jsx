import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Q1() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/entries`)
      .then((res) => {
        setEntries(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Get today's UTC date (YYYY-MM-DD)
  const todayUTC = new Date().toISOString().split("T")[0];

  const q1s = {};
  entries.forEach((e) => {
    if (!e.q1) return; // ✅ skip undefined/null/empty q1
    if (!q1s[e.q1]) {
      q1s[e.q1] = { today: 0, total: 0 };
    }
    q1s[e.q1].total++;
    if (e.appointmentDate) {
      const entryUTC = new Date(e.appointmentDate).toISOString().split("T")[0];
      if (entryUTC === todayUTC) {
        q1s[e.q1].today++;
      }
    }
  });

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E7E9ED",
    "#8BC34A",
    "#D32F2F",
    "#1976D2",
    "#F57C00",
    "#7B1FA2",
    "#388E3C",
    "#C2185B",
    "#009688",
    "#FBC02D",
    "#5D4037",
    "#455A64",
  ];

  const chartOptions = {
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

  const q1Keys = Object.keys(q1s);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {loading ? (
        // ✅ Skeleton loader
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "16px",
                background: "#e0e0e0",
                borderRadius: "8px",
                marginBottom: "15px",
                animation: "pulse 1.5s infinite",
              }}
            ></div>
            <div
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "#e0e0e0",
                marginBottom: "10px",
                animation: "pulse 1.5s infinite",
              }}
            ></div>
            <div
              style={{
                width: "100px",
                height: "12px",
                background: "#e0e0e0",
                borderRadius: "6px",
                animation: "pulse 1.5s infinite",
              }}
            ></div>
          </div>
        ))
      ) : q1Keys.length === 0 ? (
        // ✅ Show message if no data
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "#666",
            fontSize: "1.2rem",
            padding: "40px",
          }}
        >
          🚫 No Q1 data available
        </div>
      ) : (
        q1Keys.map((q1, index) => {
          const stats = q1s[q1];
          const chartData = {
            datasets: [
              {
                data: [stats.today, stats.total - stats.today],
                backgroundColor: [
                  COLORS[(index * 2) % COLORS.length],
                  COLORS[(index * 2 + 1) % COLORS.length],
                ],
                borderWidth: 0,
              },
            ],
            labels: [ "Total"], // ✅ add labels
          };

          return (
            <div
              key={q1}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-center mb-10">
                <h2 className="text-slate-700 text-1xl sm:text-1xl font-bold">
                  {q1}
                </h2>
              </div>

              <div style={{ width: "100%", height: "250px" }}>
                <Pie data={chartData} options={chartOptions} />
              </div>
              <p style={{ color: "#555" }}>
                {q1}: <b>{stats.total}</b>
              </p>
            </div>
          );
        })
      )}

      <style>
        {`
          @keyframes pulse {
            0% { background-color: #e0e0e0; }
            50% { background-color: #f0f0f0; }
            100% { background-color: #e0e0e0; }
          }
        `}
      </style>
    </div>
  );
}
