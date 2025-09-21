import React, { useEffect } from "react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/ai");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-white text-center space-y-10">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Welcome, Executive
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Access your dashboard, manage your tasks, and stay on top of your game.
        </p>

        {user ? (
          <div className="flex justify-center items-center space-x-4">
            <span className="text-base">Hi, {user.firstName}</span>
            <UserButton afterSignOutUrl="/executive-login" />
          </div>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-white text-indigo-800 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition"
          >
            Login to Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
