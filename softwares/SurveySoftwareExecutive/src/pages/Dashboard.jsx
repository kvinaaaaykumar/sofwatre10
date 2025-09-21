import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MdModeEditOutline } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import { FiCalendar, FiList } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import { Plus, Edit3, Loader2 } from "lucide-react";
import { X, User, Calendar, Home, ClipboardList, FileText } from "lucide-react";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa6";
import { useUser } from "@clerk/clerk-react";
import AdvanceChart from "./AdvanceChart";
import Cart from "./Cart";
import PostPage from "./PostPage";
import Social from "./Social";
import Dashboard2 from "./Dashboard2";
// import PostCategory from "./PostCategory";

export default function Dashboard() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    purpose: "",
    mobileNumber: "",
    appointmentDate: "",
    createdBy: "",

    // Survey Questions
    q1: "", // उम्र
    q2: "", // स्थान
    q3: "", // शिक्षा
    q4: "", // परिवार की आर्थिक हालत
    q5: "", // राजनीति में रुचि
    q6: "", // आप क्या काम करते हैं?
    q7: "", // अपने जीवन से कितना खुश हैं?
    q8: "", // परिवार की मुख्य समस्या

    // सरकार की योजनाएँ
    q9a: "", // मनरेगा
    q9b: "", // PM किसान - 6000
    q9c: "", // 108 Ambulance
    q9d: "", // 100 पुलिस सहायता
    q9e: "", // किसान कर्जा माफी
    q9f: "", // छात्रों को Laptop
    q9g: "", // उज्जवला गैस योजना
    q9h: "", // स्वच्छ भारत शौचालय

    q10: "", // स्थानीय विधायक काम से संतुष्टि
    q11: "", // टिकट मिलेगा तो दोबारा चुनना चाहेंगे?
    q12: "", // वर्तमान सरकार से संतुष्टि
    q13: "", // सरकार को दोबारा चुनना चाहेंगे?
    q14: "", // अगले मुख्यमंत्री के रूप में किसे देखना चाहते हैं?

    // पार्टी पसंद
    q15: "", // भाजपा
    q16: "", // समाजवादी पार्टी
    q17: "", // बसपा
    q18: "", // कांग्रेस
    q19: "", // प्रगतिशील समाजवादी पार्टी

    // संभावित उम्मीदवार
    q20: "", // भाजपा
    q21: "", // सपा
    q22: "", // बसपा
    q23: "", // कांग्रेस
    q24: "", // अन्य दल
    q25: "", // अगले विधायक

    q26: "", // वोट का आधार
    q27: "", // सामाजिक वर्ग
    q28: "", // धर्म
    q29: "", // 2017 विधान सभा वोट
    q30: "", // 2019 लोकसभा वोट
    q31: "", // आज वोट देंगे किसको
    q32: "", // किस पार्टी की सरकार बनेगी
  });

  // Mapping for survey questions
  const surveyQuestions = [
    { key: "q1", label: "Q1: उम्र", icon: "🎂" },
    { key: "q2", label: "Q2: स्थान", icon: "📍" },
    { key: "q3", label: "Q3: शिक्षा", icon: "📘" },
    { key: "q4", label: "Q4: परिवार की आर्थिक हालत", icon: "💰" },
    { key: "q5", label: "Q5: राजनीति में रुचि", icon: "🎯" },
    { key: "q6", label: "Q6: आप क्या काम करते हैं?", icon: "⚒️" },
    { key: "q7", label: "Q7: अपने जीवन से कितना खुश हैं?", icon: "😊" },
    { key: "q8", label: "Q8: परिवार की मुख्य समस्या", icon: "⚠️" },

    // सरकार की योजनाएँ
    { key: "q9a", label: "Q9A: मनरेगा", icon: "🏗️" },
    { key: "q9b", label: "Q9B: PM किसान", icon: "🌾" },
    { key: "q9c", label: "Q9C: 108 Ambulance", icon: "🚑" },
    { key: "q9d", label: "Q9D: 100 पुलिस सहायता", icon: "🚓" },
    { key: "q9e", label: "Q9E: किसान कर्जा माफी", icon: "💳" },
    { key: "q9f", label: "Q9F: छात्रों को Laptop", icon: "💻" },
    { key: "q9g", label: "Q9G: उज्जवला गैस योजना", icon: "⛽" },
    { key: "q9h", label: "Q9H: स्वच्छ भारत शौचालय", icon: "🚽" },

    { key: "q10", label: "Q10: विधायक से संतुष्टि", icon: "🏛️" },
    { key: "q11", label: "Q11: टिकट मिलेगा तो?", icon: "🎫" },
    { key: "q12", label: "Q12: वर्तमान सरकार से संतुष्टि", icon: "🏢" },
    { key: "q13", label: "Q13: सरकार को दोबारा चुनेंगे?", icon: "🔁" },
    { key: "q14", label: "Q14: अगला मुख्यमंत्री", icon: "👑" },

    // पार्टी पसंद
    { key: "q15", label: "Q15: भाजपा", icon: "🟠" },
    { key: "q16", label: "Q16: समाजवादी पार्टी", icon: "🔴" },
    { key: "q17", label: "Q17: बसपा", icon: "🔵" },
    { key: "q18", label: "Q18: कांग्रेस", icon: "🟢" },
    { key: "q19", label: "Q19: प्रगतिशील समाजवादी पार्टी", icon: "⚖️" },

    // संभावित उम्मीदवार
    { key: "q20", label: "Q20: भाजपा उम्मीदवार", icon: "🧑‍💼" },
    { key: "q21", label: "Q21: सपा उम्मीदवार", icon: "🧑‍💼" },
    { key: "q22", label: "Q22: बसपा उम्मीदवार", icon: "🧑‍💼" },
    { key: "q23", label: "Q23: कांग्रेस उम्मीदवार", icon: "🧑‍💼" },
    { key: "q24", label: "Q24: अन्य दल उम्मीदवार", icon: "🧑‍💼" },
    { key: "q25", label: "Q25: स्थानीय विधायक", icon: "👥" },

    { key: "q26", label: "Q26: वोट का आधार", icon: "🗳️" },
    { key: "q27", label: "Q27: सामाजिक वर्ग", icon: "👪" },
    { key: "q28", label: "Q28: धर्म", icon: "☪️" },
    { key: "q29", label: "Q29: 2017 विधानसभा वोट", icon: "📊" },
    { key: "q30", label: "Q30: 2019 लोकसभा वोट", icon: "📊" },
    { key: "q31", label: "Q31: आज वोट देंगे किसको", icon: "🗳️" },
    { key: "q32", label: "Q32: किसकी सरकार बनेगी?", icon: "🏛️" },
  ];

  // Questions Config with Icons
  const surveyQuestionsFull = [
    {
      key: "q1",
      label: "Q1: उम्र",
      icon: "🎂",
      options: ["18 से 23", "24 से 35", "36 से 45", "46 से 60", "60 से अधिक"],
    },
    {
      key: "q2",
      label: "Q2: स्थान",
      icon: "📍",
      options: ["गांव", "कस्बा", "शहर"],
    },
    {
      key: "q3",
      label: "Q3: शिक्षा",
      icon: "📘",
      options: [
        "अशिक्षित",
        "शिक्षित",
        "प्राइमरी",
        "दसवीं पास",
        "बाहरवीं पास",
        "स्नातक/स्नात्कोत्तर",
      ],
    },
    {
      key: "q4",
      label: "Q4: परिवार की आर्थिक हालत",
      icon: "💰",
      options: ["संभ्रांत", "मध्यम वर्ग", "गरीब", "अति गरीब"],
    },
    {
      key: "q5",
      label: "Q5: राजनीति में रुचि",
      icon: "🎯",
      options: [
        "बहुत अधिक 😄",
        "काफ़ी हद तक 🙂",
        "सामान्य 😐",
        "कम 🙁",
        "बिल्कुल नहीं 😡",
      ],
    },
    {
      key: "q6",
      label: "Q6: आप क्या काम करते हैं?",
      icon: "⚒️",
      options: [
        "बेरोजगार",
        "सामान्य मजदूर",
        "औद्योगिक मजदूर",
        "सड़क विक्रेता",
        "गृहणी",
        "लघु उद्योग",
        "छात्र",
        "किसान",
        "सेवा निवृत",
        "छोटा व्यवसाय",
        "प्राइवेट नौकरी",
        "सरकारी नौकरी",
        "बड़ा व्यवसाय",
        "व्यावसायिक",
        "अन्य",
      ],
    },
    {
      key: "q7",
      label: "Q7: अपने जीवन से कितना खुश हैं?",
      icon: "😊",
      options: [
        "बहुत खुश 😄",
        "खुश 🙂",
        "ठीक-ठाक 😐",
        "उदास 🙁",
        "बहुत उदास 😢",
      ],
    },
    {
      key: "q8",
      label: "Q8: परिवार की मुख्य समस्या",
      icon: "⚠️",
      options: [
        "दो समय का भोजन",
        "बेरोजगारी",
        "कानून व्यवस्था",
        "भ्रष्टाचार",
        "महंगाई",
        "सामंप्रदायिक तनाव",
        "सरकारी स्वास्थ्य सुविधाएं",
        "पीने का पानी",
        "शिक्षा व्यवस्था",
        "सड़कें",
        "समाज में सम्मान",
        "विकास की कमी",
      ],
    },

    // सरकार की योजनाएँ
    {
      key: "q9a",
      label: "Q9A: मनरेगा",
      icon: "🏗️",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9b",
      label: "Q9B: PM किसान - 6000 रूपए साल",
      icon: "🌾",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9c",
      label: "Q9C: 108 Ambulance",
      icon: "🚑",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9d",
      label: "Q9D: 100 पुलिस सहायता",
      icon: "🚓",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9e",
      label: "Q9E: किसान कर्जा माफी",
      icon: "💳",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9f",
      label: "Q9F: छात्रों को Laptop",
      icon: "💻",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9g",
      label: "Q9G: उज्जवला रसाई गैस योजना",
      icon: "⛽",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },
    {
      key: "q9h",
      label: "Q9H: स्वच्छ भारत में शौचालय का निर्माण",
      icon: "🚽",
      options: ["नहीं सुना है", "सुना है", "लाभ मिला है"],
    },

    {
      key: "q10",
      label: "Q10: स्थानीय विधायक के काम काज से कितना संतुष्ट है?",
      icon: "🏛️",
      options: [
        "पूर्णतः संतुष्ट 😄",
        "संतुष्ट 🙂",
        "ठीक-ठाक 😐",
        "असंतुष्ट 🙁",
        "पूर्णतः असंतुष् 😡",
      ],
    },
    {
      key: "q11",
      label: "Q11: अगर चुनाव में टिकट मिलेगा तो दोबारा चुनना चाहेंगे?",
      icon: "🎫",
      options: ["हां 😄", "शायद/पता नहीं 😐", "नहीं 😡"],
    },
    {
      key: "q12",
      label: "Q12: वर्तमान सरकार के काम काज से कितना संतुष्ट है?",
      icon: "🏢",
      options: [
        "पूर्णतः संतुष्ट 😄",
        "संतुष्ट 🙂",
        "ठीक-ठाक 😐",
        "असंतुष्ट 🙁",
        "पूर्णतः असंतुष् 😡",
      ],
    },
    {
      key: "q13",
      label:
        "Q13: क्या आने वाले चुनाव में वर्तमान सरकार को दोबारा चुनना चाहेंगे?",
      icon: "🔁",
      options: ["हां 😄", "शायद/पता नहीं 😐", "नहीं 😡"],
    },
    {
      key: "q14",
      label:
        "Q14: आप किस नेता को प्रदेश का अगले मुख्यमंत्री के रुप में देखना चाहते हैं?",
      icon: "👑",
      options: [
        "योगी आदित्यनाथ जी",
        "भाजपा से अन्य",
        "अखिलेश यादव जी",
        "सपा से अन्य",
        "मायावती जी",
        "बसपा से अन्य",
        "अजय कुमार लल्लू",
        "कांग्रेस से अन्य",
        "जयंत चौधरी जी",
        "कोई और",
      ],
    },

    // पार्टी पसंद
    {
      key: "q15",
      label: "Q15: आप भाजपा को कितना पसंद करते हैं?",
      icon: "🟠",
      options: [
        "पूर्णतः संतुष्ट 😄",
        "संतुष्ट 🙂",
        "ठीक-ठाक 😐",
        "असंतुष्ट 🙁",
        "पूर्णतः असंतुष् 😡",
      ],
    },
    {
      key: "q16",
      label: "Q16: आप समाजवादी पार्टी को कितना पसंद करते हैं?",
      icon: "🔴",
      options: [
        "पूर्णतः संतुष्ट 😄",
        "संतुष्ट 🙂",
        "ठीक-ठाक 😐",
        "असंतुष्ट 🙁",
        "पूर्णतः असंतुष् 😡",
      ],
    },
    {
      key: "q17",
      label: "Q17: आप बसपा को कितना पसंद करते हैं?",
      icon: "🔵",
      options: [
        "पूर्णतः संतुष्ट 😄",
        "संतुष्ट 🙂",
        "ठीक-ठाक 😐",
        "असंतुष्ट 🙁",
        "पूर्णतः असंतुष् 😡",
      ],
    },
    {
      key: "q18",
      label: "Q18: आप कांग्रेस को कितना पसंद करते हैं?",
      icon: "🟢",
      options: [
        "पूर्णतः संतुष्ट 😄",
        "संतुष्ट 🙂",
        "ठीक-ठाक 😐",
        "असंतुष्ट 🙁",
        "पूर्णतः असंतुष् 😡",
      ],
    },
    {
      key: "q19",
      label: "Q19: आप प्रगतिशील समाजवादी पार्टी को कितना पसंद करते हैं?",
      icon: "⚖️",
      options: ["हां 😄", "शायद/पता नहीं 😐", "नहीं 😡"],
    },

    // संभावित उम्मीदवार
    {
      key: "q20",
      label:
        "Q20: भाजपा के संभावित नामों में से आप किसको उम्मीदवार के रूप में देखना चाहते हैं?",
      icon: "🧑‍💼",
      options: ["अन्य / नहीं कह सकते"],
    },
    {
      key: "q21",
      label:
        "Q21: सपा के संभावित नामों में से आप किसको उम्मीदवार के रूप में देखना चाहते हैं?",
      icon: "🧑‍💼",
      options: ["अन्य / नहीं कह सकते"],
    },
    {
      key: "q22",
      label:
        "Q22: बसपा के संभावित नामों में से आप किसको उम्मीदवार के रूप में देखना चाहते हैं?",
      icon: "🧑‍💼",
      options: ["अन्य / नहीं कह सकते"],
    },
    {
      key: "q23",
      label:
        "Q23: कांग्रेस के संभावित नामों में से आप किसको उम्मीदवार के रूप में देखना चाहते हैं?",
      icon: "🧑‍💼",
      options: ["अन्य / नहीं कह सकते"],
    },
    {
      key: "q24",
      label:
        "Q24: अन्य दलो के संभावित नामों में से आप किसको उम्मीदवार के रूप में देखना चाहते हैं?",
      icon: "🧑‍💼",
      options: ["अन्य / नहीं कह सकते"],
    },
    {
      key: "q25",
      label:
        "Q25: आप किस स्थानीय नेता को क्षेत्र के अगले विधायक के रूप में देखना चाहते हैं?",
      icon: "👥",
      options: ["अन्य / नहीं कह सकते"],
    },

    {
      key: "q26",
      label: "Q26: आप आने वाले चुनाव में किस आधार पर अपने वोट का फैसला लेंगें?",
      icon: "🗳️",
      options: [
        "पार्टी",
        "मुख्यमंत्री उम्मीदवार",
        "विधायक उम्मीदवार",
        "अपने समाज के साथ",
        "कह नहीं सकते",
      ],
    },
    {
      key: "q27",
      label: "Q27: सामाजिक वर्ग",
      icon: "👪",
      options: [
        "सवर्ण",
        "पिछड़ी जातियां",
        "अनुसूचित जाति",
        "अगड़े मुस्लिम",
        "पिछड़े मुस्लिम",
        "अन्य",
      ],
    },
    {
      key: "q28",
      label: "Q28: धर्म",
      icon: "☪️",
      options: ["हिन्दू", "मुस्लिम", "सिख", "अन्य"],
    },
    {
      key: "q29",
      label: "Q29: 2017 विधानसभा वोट",
      icon: "📊",
      options: [
        "भाजपा + समर्थक दल",
        "सपा-कांग्रेस",
        "बसपा",
        "रालोद",
        "अन्य",
        "वोट नहीं था",
        "वोट नहीं दिया",
      ],
    },
    {
      key: "q30",
      label: "Q30: 2019 लोकसभा वोट",
      icon: "📊",
      options: [
        "भाजपा + समर्थक दल",
        "सपा-बसपा",
        "कांग्रेस",
        "PSPL",
        "अन्य",
        "वोट नहीं था",
        "वोट नहीं दिया",
      ],
    },
    {
      key: "q31",
      label: "Q31: आज वोट देंगे किसको",
      icon: "🗳️",
      options: [
        "भाजपा + समर्थक दल",
        "सपा",
        "बसपा",
        "कांग्रेस",
        "PSPL",
        "अन्य",
        "तय नहीं किया है",
      ],
    },
    {
      key: "q32",
      label: "Q32: किसकी सरकार बनेगी?",
      icon: "🏛️",
      options: [
        "भाजपा + समर्थक दल",
        "सपा",
        "बसपा",
        "कांग्रेस",
        "अन्य",
        "पता नहीं",
      ],
    },
  ];

  const API_URL = import.meta.env.VITE_API_URL;
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ todayCount: 0, totalCount: 0 });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useUser();

  // Loading states
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // New state for viewing details
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      setLoadingEntries(true);
      const res = await axios.get(`${API_URL}/api/entries`);
      setEntries(res.data);
      const statRes = await axios.get(`${API_URL}/api/entries/stats`);
      setStats(statRes.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch entries", "error");
    } finally {
      setLoadingEntries(false);
    }
  };

  const submitForm = async () => {
    try {
      setSubmitting(true);
      if (editId) {
        await axios.put(`${API_URL}/api/entries/${editId}`, form);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "The entry was updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/api/entries`, form);
        Swal.fire({
          icon: "success",
          title: "🎉 Added!",
          text: "New entry has been added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setForm({
        name: "",
        age: "",
        address: "",
        purpose: "",
        mobileNumber: "",
        appointmentDate: "",
        createdBy: "",

        // Survey Questions
        q1: "", // उम्र
        q2: "", // स्थान
        q3: "", // शिक्षा
        q4: "", // परिवार की आर्थिक हालत
        q5: "", // राजनीति में रुचि
        q6: "", // आप क्या काम करते हैं?
        q7: "", // अपने जीवन से कितना खुश हैं?
        q8: "", // परिवार की मुख्य समस्या

        // सरकार की योजनाएँ
        q9a: "", // मनरेगा
        q9b: "", // PM किसान - 6000
        q9c: "", // 108 Ambulance
        q9d: "", // 100 पुलिस सहायता
        q9e: "", // किसान कर्जा माफी
        q9f: "", // छात्रों को Laptop
        q9g: "", // उज्जवला गैस योजना
        q9h: "", // स्वच्छ भारत शौचालय

        q10: "", // स्थानीय विधायक काम से संतुष्टि
        q11: "", // टिकट मिलेगा तो दोबारा चुनना चाहेंगे?
        q12: "", // वर्तमान सरकार से संतुष्टि
        q13: "", // सरकार को दोबारा चुनना चाहेंगे?
        q14: "", // अगले मुख्यमंत्री के रूप में किसे देखना चाहते हैं?

        // पार्टी पसंद
        q15: "", // भाजपा
        q16: "", // समाजवादी पार्टी
        q17: "", // बसपा
        q18: "", // कांग्रेस
        q19: "", // प्रगतिशील समाजवादी पार्टी

        // संभावित उम्मीदवार
        q20: "", // भाजपा
        q21: "", // सपा
        q22: "", // बसपा
        q23: "", // कांग्रेस
        q24: "", // अन्य दल
        q25: "", // अगले विधायक

        q26: "", // वोट का आधार
        q27: "", // सामाजिक वर्ग
        q28: "", // धर्म
        q29: "", // 2017 विधान सभा वोट
        q30: "", // 2019 लोकसभा वोट
        q31: "", // आज वोट देंगे किसको
        q32: "", // किस पार्टी की सरकार बनेगी
      });

      setIsModalOpen(false);
      fetchEntries();
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (entry) => {
    setForm({
      name: entry.name,
      age: entry.age,
      address: entry.address,
      purpose: entry.purpose,
      mobileNumber: entry.mobileNumber,
      appointmentDate: entry.appointmentDate,
      createdBy: entry.createdBy,

      // Survey Questions
      q1: entry.q1,
      q2: entry.q2,
      q3: entry.q3,
      q4: entry.q4,
      q5: entry.q5,
      q6: entry.q6,
      q7: entry.q7,
      q8: entry.q8,

      // सरकार की योजनाएँ
      q9a: entry.q9a,
      q9b: entry.q9b,
      q9c: entry.q9c,
      q9d: entry.q9d,
      q9e: entry.q9e,
      q9f: entry.q9f,
      q9g: entry.q9g,
      q9h: entry.q9h,

      q10: entry.q10,
      q11: entry.q11,
      q12: entry.q12,
      q13: entry.q13,
      q14: entry.q14,

      // पार्टी पसंद
      q15: entry.q15,
      q16: entry.q16,
      q17: entry.q17,
      q18: entry.q18,
      q19: entry.q19,

      // संभावित उम्मीदवार
      q20: entry.q20,
      q21: entry.q21,
      q22: entry.q22,
      q23: entry.q23,
      q24: entry.q24,
      q25: entry.q25,

      q26: entry.q26,
      q27: entry.q27,
      q28: entry.q28,
      q29: entry.q29,
      q30: entry.q30,
      q31: entry.q31,
      q32: entry.q32,
    });

    setEditId(entry._id);
    setIsModalOpen(true);
  };

  const viewEntry = (entry) => {
    setSelectedEntry(entry);
    setViewModalOpen(true);
  };

  const downloadExcel = async () => {
    try {
      setDownloading(true);
      window.location.href = `${API_URL}/api/entries/download`;
      setTimeout(() => setDownloading(false), 2000); // reset after a short delay
    } catch (err) {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      <Dashboard2 />

      <PostPage />
      <Social />
    </div>
  );
}
