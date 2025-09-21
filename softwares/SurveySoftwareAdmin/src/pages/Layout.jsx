import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";


const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      // Get IST time
      const date = new Date();
      const utcHours = date.getUTCHours();
      const utcMinutes = date.getUTCMinutes();
      // Convert to IST (+5:30)
      let hoursIST = (utcHours + 5 + Math.floor((utcMinutes + 30) / 60)) % 24;

      if (hoursIST >= 5 && hoursIST < 12) {
        return "Good Morning";
      } else if (hoursIST >= 12 && hoursIST < 17) {
        return "Good Afternoon";
      } else if (hoursIST >= 17 && hoursIST < 21) {
        return "Good Evening";
      } else {
        return "Good Night";
      }
    };

    setGreeting(getGreeting());
  }, []);

  return user ? (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Fixed Navbar */}
      <nav className="h-16 shadow-md bg-white fixed top-0 left-0 right-0 z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <p
            className="text-lg font-semibold cursor-pointer"
            onClick={() => navigate("/ai")}
          >
           {greeting}, <span className="text-[#3B82F6]">{user.firstName}</span> 👋
          </p>

          {sidebar ? (
            <IoMdClose
              onClick={() => setSidebar(false)}
              className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
            />
          ) : (
            <RiMenu3Line
              onClick={() => setSidebar(true)}
              className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
            />
          )}
        </div>
      </nav>

      {/* ✅ Push content beside sidebar */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

      <div className="flex-1 flex w-full pt-16 sm:ml-60">
        <main className="flex-1 bg-[#F4F7FB] overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
