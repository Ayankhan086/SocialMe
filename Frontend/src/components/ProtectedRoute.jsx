import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Cookie from "js-cookie";

const ProtectedRoute = ({ children }) => {

  if (!(Cookie.get("accessToken"))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;