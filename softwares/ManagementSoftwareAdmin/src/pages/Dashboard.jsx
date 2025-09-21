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
  });
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
      createdBy: entry.createdBy,
      appointmentDate: entry.appointmentDate,
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

      <AdvanceChart />
      <div className="text-center mb-5 mt-5">
        <h2 className="text-slate-700 text-3xl sm:text-4xl font-bold">
          All Chart
        </h2>
      </div>
      <Cart />
      
      <PostPage />
      {/* <PostCategory /> */}
      <Social />
      

    </div>
  );
}
