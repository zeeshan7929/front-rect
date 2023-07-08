import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = JSON.parse(localStorage.getItem("m_login"));
  const hanldeLogout = () => {
    if (token) {
      localStorage.removeItem("m_login");
      navigate("/master-login");
    }
  };
  return (
    <div className="col-12 sideBarInner h-100">
      <div className="row d-flex  flex-column h-100 flex-nowrap">
        <div className="col-12 sideBarHeader">
          <div className="companyLogo">
            <img src="./../assets/img/svg/dashboardlogo.svg" alt="" />
          </div>
          <img
            src="./../assets/img/svg/menuClose.svg"
            className="d-lg-none menuCloseIcon pointer"
            id="menuClose"
            alt="menu close"
            onClick={() => setSidebarOpen("")}
          />
        </div>
        <div className="col-12 sideBarBody flex-fill overflow-hidden-auto h-100">
          <ul className="sidebarUL list-unstyled">
            <li
              className={`sidebarLi ${
                pathname == "/master-dashboard" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/master-dashboard" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="./../assets/img/svg/home.svg"
                  alt=""
                />
              </NavLink>
              Dashboard
            </li>
            <li
              className={`sidebarLi ${pathname == "/client" ? "active" : ""}`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/client" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="./../assets/img/svg/users.svg"
                  alt=""
                />
              </NavLink>
              Clients
            </li>
            <li
              className={`sidebarLi ${pathname == "/tier" ? "active" : ""}`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/tier" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="./../assets/img/svg/tiers.svg"
                  alt=""
                />
              </NavLink>
              Tiers
            </li>
            <li
              className={`sidebarLi ${
                pathname == "/payment-history" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/payment-history" className="stretched-link">
                <img
                  className="sidebarImg billingIcon"
                  src="./../assets/img/svg/creditcard.svg"
                  alt=""
                />
              </NavLink>
              Payment History
            </li>
          </ul>
        </div>
        <div className="col-12 sideBarFooter d-flex flex-column justify-content-end">
          <div className="col-12 d-flex justify-content-center">
            <div className="logout pointer" onClick={() => hanldeLogout()}>
              <img src="./../assets/img/svg/logout.svg" alt="" /> Logout
            </div>
          </div>
          <div className="sideBarTxt">
            <span>Powered by Kairav</span>
            <span>© 2023 All Rights Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
