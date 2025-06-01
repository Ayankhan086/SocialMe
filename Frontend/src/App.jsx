import React , { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MessagesPage from "./Pages/MessagesPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignUpPage";
import { AuthContext, AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faCoffee, faUser)




function AppLayout() {
   
 

  return (
    <>
      <AuthProvider>
        <div className="flex min-h-screen">
          <main className="flex-1 ">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </>
  );
}

// Sidebar component with navigati



function App() {

  return (
    <Router >
      <AppLayout />
    </Router>
  )
}

export default App;