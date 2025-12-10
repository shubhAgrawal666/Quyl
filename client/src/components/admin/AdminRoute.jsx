import React from "react";
import { Navigate } from "react-router-dom";

/*
  Simple front-end protector for preview:
  Checks localStorage.user.role === "admin".
  Real security must be done on the server.
*/
export default function AdminRoute({ children }) {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return <Navigate to="/login" replace />;
    const user = JSON.parse(stored);
    if (user.role !== "admin") return <Navigate to="/login" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
