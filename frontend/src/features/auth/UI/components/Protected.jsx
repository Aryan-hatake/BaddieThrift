import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }

    if (loading) return <h1>Loading...</h1>;

    if (!loading && user) {
      if (user.role !== "seller") navigate("/");
    }
  }, []);

  

  return children;
};

export default Protected;
