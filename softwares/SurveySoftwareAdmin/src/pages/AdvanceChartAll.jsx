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
  BubbleController,
} from "chart.js";
import { Pie, Doughnut, Line, Bar, Radar, Bubble } from "react-chartjs-2";

// Register chart elements
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

export default function AdvanceChartAll() {
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

  const todayUTC = new Date().toISOString().split("T")[0];

  // ✅ helper → group responses by field
  const buildStats = (field) => {
    const map = {};
    entries.forEach((e) => {
      if (!e[field]) return;
      if (!map[e[field]]) map[e[field]] = { today: 0, total: 0 };
      map[e[field]].total++;
      if (e.appointmentDate) {
        const entryUTC = new Date(e.appointmentDate)
          .toISOString()
          .split("T")[0];
        if (entryUTC === todayUTC) map[e[field]].today++;
      }
    });
    return map;
  };

  // ✅ config for all questions
  const chartsConfig = [
    { field: "age", title: "Gender" },
    { field: "q1", title: "Q1: उम्र" },
    { field: "q2", title: "Q2: स्थान" },
    { field: "q3", title: "Q3: शिक्षा" },
    { field: "q4", title: "Q4: परिवार की आर्थिक हालत" },
    { field: "q5", title: "Q5: राजनीति में रुचि" },
    { field: "q6", title: "Q6: आपका पेशा/व्यवसाय" },
    { field: "q7", title: "Q7: धर्म" },
    { field: "q8", title: "Q8: जाति/समुदाय" },
    { field: "q9", title: "Q9: लिंग" },
    { field: "q10", title: "Q10: आपको किस नेता पर सबसे ज़्यादा भरोसा है?" },
    {
      field: "q11",
      title: "Q11: मौजूदा सरकार के कामकाज से आप कितना संतुष्ट हैं?",
    },
    {
      field: "q12",
      title: "Q12: बेरोजगारी की स्थिति को लेकर आपका क्या विचार है?",
    },
    {
      field: "q13",
      title: "Q13: महंगाई पर सरकार का नियंत्रण आपको कैसा लग रहा है?",
    },
    { field: "q14", title: "Q14: शिक्षा व्यवस्था से आप कितने संतुष्ट हैं?" },
    {
      field: "q15",
      title: "Q15: स्वास्थ्य सेवाओं की स्थिति आपके अनुसार कैसी है?",
    },
    { field: "q16", title: "Q16: किसानों के लिए सरकार की योजनाओं पर आपकी राय" },
    { field: "q17", title: "Q17: युवाओं को अवसर मिलने की स्थिति कैसी है?" },
    {
      field: "q18",
      title: "Q18: महिलाओं की सुरक्षा को लेकर आपका क्या विचार है?",
    },
    {
      field: "q19",
      title: "Q19: सड़क, बिजली और पानी की स्थिति आपके क्षेत्र में कैसी है?",
    },
    { field: "q20", title: "Q20: भ्रष्टाचार की स्थिति पर आपकी राय" },
    { field: "q21", title: "Q21: कानून-व्यवस्था की स्थिति कैसी है?" },
    {
      field: "q22",
      title: "Q22: रोजगार के अवसर बढ़ाने में सरकार कितनी सफल है?",
    },
    {
      field: "q23",
      title: "Q23: स्थानीय प्रतिनिधि का कामकाज आपको कैसा लगता है?",
    },
    { field: "q24", title: "Q24: विपक्ष की भूमिका को आप कैसे देखते हैं?" },
    {
      field: "q25",
      title: "Q25: क्या आपको लगता है कि सरकार जनहित में काम कर रही है?",
    },
    { field: "q26", title: "Q26: आपका पसंदीदा प्रधानमंत्री उम्मीदवार कौन है?" },
    { field: "q27", title: "Q27: आपका पसंदीदा मुख्यमंत्री उम्मीदवार कौन है?" },
    {
      field: "q28",
      title: "Q28: किस पार्टी की नीतियाँ आपको ज़्यादा पसंद हैं?",
    },
    { field: "q29", title: "Q29: क्या आपको लगता है कि मीडिया निष्पक्ष है?" },
    {
      field: "q30",
      title: "Q30: आपकी नज़र में देश की सबसे बड़ी समस्या क्या है?",
    },
    {
      field: "q31",
      title: "Q31: आने वाले चुनाव में आप किस पार्टी को वोट देंगे?",
    },
    {
      field: "q32",
      title:
        "Q32: वर्तमान हालातों में किस पार्टी की सरकार बनती हुई दिख रही है?",
    },
  ];

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

  if (loading) return <h2 className="text-center">⏳ Loading charts...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      {chartsConfig.map(({ field, title }) => {
        const stats = buildStats(field);
        const labels = Object.keys(stats);
        if (!labels.length) return null;

        const todayData = labels.map((l) => stats[l].today);
        const totalData = labels.map((l) => stats[l].total);

        return (
          <div key={field} style={{ marginBottom: "40px" }}>
            
            <div className="text-center mb-5">
              <h2 className="text-slate-600 text-2xl sm:text-3xl font-semibold border-b-2 border-blue-300 inline-block pb-1">
                {title}
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Doughnut */}
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h3>Doughnut</h3>
                <Doughnut
                  data={{
                    labels,
                    datasets: [{ data: totalData, backgroundColor: COLORS }],
                  }}
                  options={commonOptions}
                />
              </div>

              {/* Line */}
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h3>Line</h3>
                <Line
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Today",
                        data: todayData,
                        borderColor: "#36A2EB",
                        backgroundColor: "rgba(54,162,235,0.2)",
                      },
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

              {/* Bar */}
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h3>Bar</h3>
                <Bar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Total",
                        data: totalData,
                        backgroundColor: "#FF6384",
                      },
                    ],
                  }}
                  options={commonOptions}
                />
              </div>

              {/* Radar */}
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h3>Radar</h3>
                <Radar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Today",
                        data: todayData,
                        backgroundColor: "rgba(179,181,198,0.2)",
                        borderColor: "rgba(179,181,198,1)",
                      },
                      {
                        label: "Total",
                        data: totalData,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                      },
                    ],
                  }}
                  options={commonOptions}
                />
              </div>

              {/* Bubble */}
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h3>Bubble</h3>
                <Bubble
                  data={{
                    datasets: labels.map((label, i) => ({
                      label,
                      data: [
                        {
                          x: totalData[i],
                          y: todayData[i],
                          r: totalData[i] * 2,
                        },
                      ],
                      backgroundColor: COLORS[i % COLORS.length],
                    })),
                  }}
                  options={commonOptions}
                />
              </div>

              {/* Pie */}
              <div
                style={{
                  height: 300,
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h3>Pie</h3>
                <Pie
                  data={{
                    labels,
                    datasets: [{ data: totalData, backgroundColor: COLORS }],
                  }}
                  options={commonOptions}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
