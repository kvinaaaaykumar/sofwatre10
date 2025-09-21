import React from "react";
import { Pie } from "react-chartjs-2";

const COLORS = [
  "#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40",
  "#E7E9ED","#8BC34A","#D32F2F","#1976D2","#F57C00","#7B1FA2",
  "#388E3C","#C2185B","#009688","#FBC02D","#5D4037","#455A64",
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

export default function GenericChart({ title, dataMap, loading }) {
  if (loading) {
    return (
      <div style={{
        background:"#fff",borderRadius:"12px",padding:"20px",
        boxShadow:"0 4px 10px rgba(0,0,0,0.08)",textAlign:"center"
      }}>
        ⏳ Loading {title}...
      </div>
    );
  }

  if (!dataMap || Object.keys(dataMap).length === 0) {
    return (
      <div style={{
        gridColumn: "1 / -1", textAlign: "center",
        color: "#666", fontSize: "1.2rem", padding: "40px",
      }}>
        🚫 No {title} data available
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="text-slate-600 text-2xl sm:text-3xl font-semibold border-b-2 border-blue-300 inline-block pb-1">
          {title}
        </h2>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px", padding: "20px",
      }}>
        {Object.keys(dataMap).map((option, index) => {
          const stats = dataMap[option];
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
            labels: ["Total", "Hide"],
          };

          return (
            <div key={option} style={{
              background:"#fff",borderRadius:"12px",padding:"20px",
              boxShadow:"0 4px 10px rgba(0,0,0,0.08)",
              display:"flex",flexDirection:"column",alignItems:"center"
            }}>
              <h2 className="text-slate-700 text-1xl font-bold mb-2">{option}</h2>
              <div style={{ width: "100%", height: "250px" }}>
                <Pie data={chartData} options={chartOptions} />
              </div>
              <p style={{ color: "#555" }}>
                Total {option}: <b>{stats.total}</b>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
