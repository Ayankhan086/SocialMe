import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Cookie from "js-cookie";

const ProtectedRoute = ({ children }) => {

  const {cUser} = useContext(AuthContext)


  if (!cUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;