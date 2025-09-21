import React, { useEffect, useState } from "react";
import axios from "axios";
import GenericChart from "./GenericChart";

const Cart = () => {
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

  // helper function → किसी भी field को group कर देगा
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

  // config for all questions
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

  return (
    <div>
      <div className="text-center mb-10 mt-10">
        <h2 className="text-slate-800 text-4xl sm:text-5xl font-extrabold tracking-wide">
          All Chart
        </h2>
      </div>

      {chartsConfig.map(({ field, title }) => (
        <GenericChart
          key={field}
          title={title}
          dataMap={buildStats(field)}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default Cart;
