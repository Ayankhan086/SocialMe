import React, { useState, useEffect } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Navbar from '../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';

const SettingsPage = () => {


  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(image)
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  // When user selects a new avatar, show preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {


      const formdata = new FormData();

      formdata.append("fullName", fullName);
      formdata.append("username", username);
      formdata.append("email", email);

      const response = await fetch("${import.meta.env.VITE_APP_SERVER_URL}/users/update-account", {
        method: "POST",
        credentials: "include",
        body: formdata
      });

      if (response.ok) {

        const data = await response.json();
        console.log(" User detail Updated ", data.data);

        setFullName(data.data.fullName)
        setUsername(data.data.username)
        setEmail(data.data.email)

        toast.success("Profile Successfully Updated.")

      }
      else {
        console.log("some error caused");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();


    const formdata = new FormData()

    if (newAvatar) {
      formdata.append("avatar", newAvatar);
    }

    try {

      const response = await fetch("${import.meta.env.VITE_APP_SERVER_URL}/users/avatar", {
        method: "POST",
        credentials: "include",
        body: formdata
      })

      if (response.ok) {
        const data = await response.json();
        console.log("Avatar Uploaded. ", data.data);
        setNewAvatar(null)
        toast.success("Avatar uploaded Successfully.")
      }

    } catch (error) {
      console.log("Error while uploading Avatar", error);
    }
  }

  useEffect(() => {

    const getCurrentUser = async () => {
      try {
        const response = await fetch('${import.meta.env.VITE_APP_SERVER_URL}/users/current-user', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Current user:", data.data);

          setFullName(data.data.fullName)
          setUsername(data.data.username)
          setEmail(data.data.email)
          setAvatarPreview(data.data.avatar)

        } else {
          console.error("Failed to fetch current user");
          toast.error("Failed to fetch current user.");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast.error("An error occurred while fetching current user.");
      }
    };

    getCurrentUser();

  }, [])


  return (

    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      {/* Reuse the same navbar from homepage */}
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar (same as homepage) */}
          <LeftSidebar />
          {/* Main settings content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">Account Settings</h1>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Profile Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile Information</h2>
                    <div className="flex items-center mb-6">
                      <img
                        src={avatarPreview || <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <label htmlFor="avatar" className='flex border border-black bg-gray-400 text-black rounded px-2 py-1  bg items-center  hover:text-gray-700 cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg> Change Avatar</label>
                        <input
                          type="file"
                          name="avatar"
                          id="avatar"
                          accept='image/*'
                          style={{ display: "none" }}
                          onChange={handleAvatarChange}
                        />
                      </div>

                      <button onClick={handleAvatarUpload} type="button" className='ml-2 px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
                        change
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          name="email"
                          value={email}
                          placeholder='jhonDoe@mail.con'
                          onChange={(e) => setEmail(e.target.value)}
                          type='email'
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                      </div>
                    </div>
                  </div>




                  {/* Actions Section */}
                  <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;