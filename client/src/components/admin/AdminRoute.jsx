import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  
  if (loading) {
    return <p className="text-center mt-10">Checking admin access...</p>;
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  
  return children;
}
