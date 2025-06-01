import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Adjust the path if needed
import Cookies from 'js-cookie'; // Ensure you have js-cookie installed // Adjust the path to your profile image
import toast from 'react-hot-toast';
import image from "../../src/assets/images/image.svg"

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.replace("/", "") || "home";
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user data from the server or context
    const fetchUserData = async () => {
      try {

        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/users/current-user`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched:", data.data);
          setUser(data.data);
        } else {
          console.error("Failed to fetch user data");
          toast.error("Failed to load user data");
        }

      } catch (error) {
        console.log("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }

    };
    fetchUserData();
  }, []);

  // Helper to handle navigation only if user is authenticated
  const handleNav = (path) => {
    if (Cookies.get("accessToken")) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col items-center">
          <img
            src={user.avatar || image }
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <h3 className="font-semibold">{user.fullName}</h3>
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-2">
        <button onClick={() => handleNav("/")} className={`flex items-center w-full p-3 rounded-md ${page === " " ? "bg-blue-500 text-white" : "hover:bg-blue-100"} text-left font-medium text-gray-700 `}>
          {/* Home Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </button>
        <button onClick={() => handleNav("/profile")} className={`flex items-center w-full p-3 rounded-md ${page === "profile" ? "bg-blue-500 text-white" : "hover:bg-blue-100"} text-left font-medium text-gray-700 `}>
          {/* Profile Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Profile
        </button>
        <button onClick={() => handleNav("/messages")} className={`flex items-center w-full p-3 rounded-md ${page === "messages" ? "bg-blue-500 text-white" : "hover:bg-blue-100"} text-left font-medium text-gray-700 `}>
          {/* Messages Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Messages
        </button>
        <button onClick={() => handleNav("/settings")} className={`flex items-center w-full p-3 rounded-md ${page === "settings" ? "bg-blue-500 text-white" : "hover:bg-blue-100"} text-left font-medium text-gray-700 `}>
          {/* Settings Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;