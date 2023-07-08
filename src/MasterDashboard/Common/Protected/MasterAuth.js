import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const MasterAuth = () => {
  const token = JSON.parse(localStorage.getItem("m_login"));

  return token ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/master-login" />
  );
};
export default MasterAuth;
