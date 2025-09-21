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


export default function EntryDetails() {  
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="text-slate-700 text-3xl sm:text-4xl font-bold">
          Entry Details
        </h2>
      </div>

      
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
                <th className="py-3 px-4 border">Purpose</th>
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
                  <td className="py-3 px-4 border">{e.purpose}</td>
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
        <div className="fixed overflow-y-auto pt-[40px] inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditId(null);
                setForm({
                  name: "",
                  age: "",
                  address: "",
                  purpose: "",
                  mobileNumber: "",
                  createdBy: "",
                  appointmentDate: "",
                });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {editId ? "✏️ Edit Entry" : "📌 Create New Entry"}
            </h2>

            {/* Form */}
            <div className="grid grid-cols-2 h-full gap-4 ">
              {/* Name */}
              <div className="">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <div className="flex items-center border rounded-lg px-3">
                  <User size={18} className="text-blue-500 mr-2" />
                  <input
                    className="w-full p-2 focus:outline-none"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Gender  */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Gender
                </label>
                <div className="flex items-center border rounded-lg px-3">
                  <ClipboardList size={18} className="text-purple-500 mr-2" />
                  <select
                    className="w-full p-2 focus:outline-none"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    {/* {[...Array(100).keys()].map((a) => (
                      <option key={a + 1}>{a + 1}</option>
                    ))} */}
                  </select>
                </div>
              </div>
              {/* Mobile Number */}
              <div className="col-span-2 relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center border rounded-lg px-3">
                  <FaPhoneVolume size={18} className="text-red-500 mr-2" />

                  <input
                    className="w-full p-2 focus:outline-none"
                    placeholder="Enter Mobile Number"
                    value={form.mobileNumber}
                    type="number"
                    onChange={(e) =>
                      setForm({ ...form, mobileNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-2 relative">
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
              <div className="col-span-2 relative">
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
                    <option>Party Meeting ke Liye</option>
                    <option>Aadhar Card Ke Liye</option>
                    <option>Voter ID Card</option>
                    <option>Rashan Card</option>
                    <option>Mahilaon Ki Yojana Ke Liye</option>
                    <option>Pardhan Mantri Yojna Ke Liye</option>
                    <option>Nali Ki Shikayat Ke Liye</option>
                    <option>Sewer Ki Shikayat Ke Liye</option>
                    <option>Kude Ki Shikayat Ke Liye</option>
                    <option>Bijli Bill Ki Shikayat Ke Liye</option>
                    <option>MCD Ke Karmachaariyon Kee Shikaayat Ke Liye</option>
                    <option>Gunda Kee Shikaayat Ke Liye</option>
                    <option>Ladai Jhagada Kee Shikaayat Ke Liye</option>
                    <option>Gharelu Jhagada Kee Shikaayat Ke Liye</option>
                    <option>Parking Kee Shikaayat Ke Liye</option>
                    <option>Pedon Kee Shikaayat Ke Liye</option>
                    <option>Park Booking Ke Liye Shadi</option>
                    <option>Mandir Booking Ke Liye Shadi</option>
                    <option>Banquet Hall Booking Ke Liye Shadi</option>
                    <option>Mrtyu Ke Liye</option>
                    <option>Mandir Booking Ke Liye Mrtyu</option>
                    <option>Banquet Hall Booking Ke Liye Mrtyu</option>
                    <option>Janamdin Ke Liye Invitation</option>
                    <option>Banquet Hall Booking Ke Liye</option>
                    <option>Park Booking Ke Liye Janamdin</option>
                    <option>Mandir Booking Ke Liye Janamdin</option>
                    <option>Banquet Hall Booking Ke Liye Janamdin</option>
                    <option>Hospital Udghatan Ke Liye</option>
                    <option>School Udghatan Ke Liye</option>
                    <option>Collage Udghatan Ke Liye</option>
                    <option>Dukan Udghatan Ke Liye</option>
                    <option>Sadak Udghatan Ke Liye</option>
                    <option>Flyover Udghatan Ke Liye</option>
                    <option>Ghar Udghatan Ke Liye</option>
                    <option>Office Udghatan Ke Liye</option>
                    <option>Shadi Ke Liye Card</option>
                    <option>Sagai Ke Liye Card</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
{/* Appointment Date */}
              <div className="col-span-2 relative">
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

              {/* createdBy */}
              <div className="col-span-2 relative">
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
                    <option>{user.firstName} {user.lastName} ({user.primaryEmailAddress?.emailAddress})</option>
                    
                  </select>
                  
                </div>
              </div>

              

              {/* Submit Button */}
              <button
                onClick={submitForm}
                disabled={submitting}
                className={`col-span-2 mt-4 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full 
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
