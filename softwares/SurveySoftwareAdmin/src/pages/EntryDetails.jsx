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
// import PostCategory from "./PostCategory";

export default function EntryDetails() {
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="text-slate-700 text-3xl sm:text-4xl font-bold">
          Entry Details
        </h2>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedEntry && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-3xl relative animate-fadeIn border border-gray-200 flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-gray-800 py-6 text-center border-b">
              📋 Entry Details
            </h2>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Details */}
              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-blue-500">👤</span>
                <p>
                  <strong>Name:</strong> {selectedEntry.name}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-purple-500">🎂</span>
                <p>
                  <strong>Age:</strong> {selectedEntry.age}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-orange-500">📱</span>
                <p>
                  <strong>Mobile:</strong> {selectedEntry.mobileNumber}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-green-500">📍</span>
                <p>
                  <strong>Address:</strong> {selectedEntry.address}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-orange-500">🎯</span>
                <p>
                  <strong>Purpose:</strong> {selectedEntry.purpose}
                </p>
              </div>

              {/* Loop Survey Questions */}
              {surveyQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3"
                >
                  <span className="text-indigo-500">{q.icon}</span>
                  <p>
                    <strong>{q.label}:</strong> {selectedEntry[q.key]}
                  </p>
                </div>
              ))}

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-pink-500">📅</span>
                <p>
                  <strong>Booking Date:</strong> {selectedEntry.appointmentDate}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-gray-600">⏳</span>
                <p>
                  <strong>Created:</strong> {selectedEntry.createDate}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-orange-500">✍️</span>
                <p>
                  <strong>Created By:</strong> {selectedEntry.createdBy}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="py-4 flex justify-center border-t">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:scale-105 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Table */}
      <div className="flex items-center p-4 bg-white shadow-md rounded-2xl border border-gray-200">
        {loadingEntries ? (
          <div className="w-full text-center text-gray-500">
            Loading entries...
          </div>
        ) : (
          <table className="min-w-full text-left text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border">S.No</th>
                <th className="py-3 px-4 border">Name</th>
                {/* <th className="py-3 px-4 border">Age</th> */}
                {/* <th className="py-3 px-4 border">Address</th> */}
                {/* <th className="py-3 px-4 border">Purpose</th> */}
                {/* <th className="py-3 px-4 border">Appointment Date</th> */}
                {/* <th className="py-3 px-4 border">Create Date</th> */}
                <th className="py-3 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e._id}>
                  <td className="py-3 px-4 border">{i + 1}</td>
                  <td className="py-3 px-4 border">{e.name}</td>
                  {/* <td className="py-3 px-4 border">{e.age}</td> */}
                  {/* <td className="py-3 px-4 border">{e.address}</td> */}
                  {/* <td className="py-3 px-4 border">{e.purpose}</td> */}
                  {/* <td className="py-3 px-4 border">{e.appointmentDate}</td> */}
                  {/* <td className="py-3 px-4 border">{e.createDate}</td> */}
                  <td className="py-3 px-4 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewEntry(e)}
                        className="p-2 bg-green-100 hover:bg-green-600 text-green-800 hover:text-white rounded-full"
                      >
                        <AiOutlineEye />
                      </button>
                      <button
                        onClick={() => startEdit(e)}
                        className="p-2 bg-blue-100 hover:bg-blue-600 text-blue-800 hover:text-white rounded-full"
                      >
                        <MdModeEditOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Submit Button Loader */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative animate-fadeIn flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditId(null);
                setForm({
                  // reset fields...
                  name: "",
                  age: "",
                  address: "",
                  purpose: "",
                  mobileNumber: "",
                  createdBy: "",
                  appointmentDate: "",
                  q1: "",
                  q2: "",
                  q3: "",
                  q4: "",
                  q5: "",
                  q6: "",
                  q7: "",
                  q8: "",
                  q9a: "",
                  q9b: "",
                  q9c: "",
                  q9d: "",
                  q9e: "",
                  q9f: "",
                  q9g: "",
                  q9h: "",
                  q10: "",
                  q11: "",
                  q12: "",
                  q13: "",
                  q14: "",
                  q15: "",
                  q16: "",
                  q17: "",
                  q18: "",
                  q19: "",
                  q20: "",
                  q21: "",
                  q22: "",
                  q23: "",
                  q24: "",
                  q25: "",
                  q26: "",
                  q27: "",
                  q28: "",
                  q29: "",
                  q30: "",
                  q31: "",
                  q32: "",
                });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 py-5 text-center border-b">
              {editId ? "✏️ Edit Entry" : "📌 Create New Entry"}
            </h2>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <User size={18} className="text-blue-500 mr-2" />
                    <input
                      className="w-full p-2 focus:outline-none"
                      placeholder="Enter name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Gender
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <ClipboardList size={18} className="text-purple-500 mr-2" />
                    <select
                      className="w-full p-2 focus:outline-none"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <FaPhoneVolume size={18} className="text-red-500 mr-2" />
                    <input
                      type="number"
                      className="w-full p-2 focus:outline-none"
                      placeholder="Enter Mobile Number"
                      value={form.mobileNumber}
                      onChange={(e) =>
                        setForm({ ...form, mobileNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <Home size={18} className="text-green-500 mr-2" />
                    <input
                      className="w-full p-2 focus:outline-none"
                      placeholder="Enter address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Purpose
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <FileText size={18} className="text-orange-500 mr-2" />
                    <select
                      className="w-full p-2 focus:outline-none"
                      value={form.purpose}
                      onChange={(e) =>
                        setForm({ ...form, purpose: e.target.value })
                      }
                    >
                      <option value="">Select Purpose</option>
                      {/* your options... */}
                    </select>
                  </div>
                </div>

                {surveyQuestionsFull.map((q) => (
                  <div key={q.key} className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {q.label}
                    </label>
                    <div className="flex items-center border rounded-lg px-3">
                      <span className="mr-2 text-lg">{q.icon}</span>
                      <select
                        className="w-full p-2 focus:outline-none"
                        value={form[q.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [q.key]: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {/* Appointment Date */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Booking Date
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <Calendar size={18} className="text-pink-500 mr-2" />
                    <input
                      type="date"
                      className="w-full p-2 focus:outline-none"
                      value={form.appointmentDate}
                      onChange={(e) =>
                        setForm({ ...form, appointmentDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Created By */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Created By
                  </label>
                  <div className="flex items-center border rounded-lg px-3">
                    <FaUserTie size={18} className="text-orange-500 mr-2" />
                    <select
                      className="w-full p-2 focus:outline-none"
                      value={form.createdBy}
                      onChange={(e) =>
                        setForm({ ...form, createdBy: e.target.value })
                      }
                    >
                      <option value="">Select Created By</option>
                      <option>
                        {user.firstName} {user.lastName} (
                        {user.primaryEmailAddress?.emailAddress})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Submit */}
            <div className="p-4 border-t flex justify-center">
              <button
                onClick={submitForm}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full 
            text-white font-medium shadow-md transition transform ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:scale-105 active:scale-95"
            }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Processing...
                  </>
                ) : editId ? (
                  "✅ Update Entry"
                ) : (
                  "🚀 Submit Entry"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
