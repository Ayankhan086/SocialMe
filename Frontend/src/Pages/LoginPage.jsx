import React, { useState, useEffect } from "react";
import { createCookie, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import cookie from "js-cookie";
import { SocketContext } from "../components/SocketContext"


const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { setCUser, cUser } = useContext(AuthContext);
  const { connectSocket, onlineUsers } = useContext(SocketContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      console.log("Submitting login with:", formData);
      // Send a POST request to the login endpoint


      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        }
      });



      if (response.ok) {


        const data = await response.json();

        setCUser(data.data)
        

        if (data.data.accessToken) {
          cookie.set("accessToken", data.data.accessToken, { expires: 7, secure: true }); // Store token in cookie
          // cookie.set("CurrentUserId", data.data.user._id, { expires: 7, secure: true })
        }

        connectSocket();
        
        navigate("/home");

      }
      else {
        toast.error("Invalid email or password.");
      }

    } catch (error) {

      toast.error("Login failed. Please try again.");
      console.log("Error : ", error);


    }
  };

  






  return (
    <>
      <Toaster position="top-center" />
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
              💹
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to SocialApp
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with friends and share your moments
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>



              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>



              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;