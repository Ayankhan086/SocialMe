import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cookie from 'js-cookie';
import { SocketContext } from './SocketContext';
import { AuthContext } from './AuthContext';


const Navbar = () => {

  const { disconnectSocket, Socket } = useContext(SocketContext)
  const { setCUser } = useContext(AuthContext)

  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.replace("/", "") || "home";


  const handleLogout = async () => {
    disconnectSocket()
    cookie.remove("accessToken"); // Remove the token from cookies
    cookie.remove("CurrentUserId")
    setCUser(null)
    navigate("/"); // Optionally redirect to login
  };





  return (

    <nav className="sticky top-0 z-50 bg-white shadow-sm ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-blue-600">SocialME</h1>
          </div>

          


          {/* Navigation Links */}

          <div className="flex items-center space-x-10">

            {(() => {
              if (!(cookie.get("accessToken"))) {
                return (
                  <>
                    <button onClick={() => navigate("/login")} className={`px-3 py-2 rounded text-left ${page === "login" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}>Login</button>
                    <button onClick={() => navigate("/signup")} className={`px-3 py-2 rounded text-left ${page === "signup" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}>Signup</button>
                  </>
                );
              }
                return (
                  <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium transition duration-150">Logout</button>
                );
              
            })()}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;