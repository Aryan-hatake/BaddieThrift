import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
 

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth/login");
      return
    }

    if (user) {

      if (user.role !== "seller") navigate("/");
    }
  }, [user, loading, navigate]);

    if (!user || user.role !== "seller") return <Navigate to="/" replace />;

  return children;
};

export default Protected;
