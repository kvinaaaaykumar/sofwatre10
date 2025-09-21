import React, { useEffect } from "react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/ai"); // change this route as per your setup
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <div className="max-w-lg w-full space-y-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Admin Panel Access</h1>
        <p className="text-lg text-gray-300">
          Please login to manage entries, team members, and reports.
        </p>

        {user ? (
          <div className="flex justify-center items-center space-x-4">
            <span className="text-base">Welcome, {user.firstName}</span>
            <UserButton afterSignOutUrl="/dashboard" />
          </div>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full shadow hover:shadow-xl transition"
          >
            Admin Login
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
