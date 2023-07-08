import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const Authentication = () => {
  const token1 = JSON.parse(localStorage.getItem("a_login"));

  return token1 ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/assistant-login" />
  );
};
export default Authentication;
