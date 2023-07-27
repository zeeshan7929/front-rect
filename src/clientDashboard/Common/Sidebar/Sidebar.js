import React, { useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useOnClickOutside } from "../Others/useOnClickOutside";

const Sidebar = ({ setSidebarOpen, sideBar }) => {
  const myref = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const token = JSON.parse(localStorage.getItem("a_login"));

  const hanldeLogout = () => {
    if (token) {
      localStorage.removeItem("a_login");
      navigate("/master-login");
    }
  };
  const autoClose = () => {
    if (sideBar == "grid") {
      setSidebarOpen("");
    }
  };

  useOnClickOutside(myref, autoClose);

  return (
    <div ref={myref} className="col-12 sideBarInner h-100">
      <div className="row d-flex  flex-column h-100 flex-nowrap">
        <div className="col-12 sideBarHeader">
          <div className="companyLogo">
            <img src="assets/img/logo/Logo.svg" alt="image" />
          </div>
          <img
            src="assets/img/svg/menuClose.svg"
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
                splitLocation[1] === "dashboard" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/dashboard" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="assets/img/svg/home.svg"
                  alt="image"
                />
              </NavLink>{" "}
              Dashboard
            </li>
            <li
              className={`sidebarLi ${
                splitLocation[1] === "dpa-interface" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to={"/dpa-selection"} className="stretched-link">
                <img
                  className="sidebarImg"
                  src="assets/img/svg/message.svg"
                  alt="image"
                />
              </NavLink>{" "}
              DPA Interface
            </li>
            <li
              className={`sidebarLi ${
                splitLocation[1] === "user-overview" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to={"/user-overview"} className="stretched-link">
                <img
                  className="sidebarImg"
                  src="assets/img/svg/users.svg"
                  alt="image"
                />
              </NavLink>{" "}
              Users
            </li>
            <li
              className={`sidebarLi ${
                splitLocation[1] === "usage-tracking" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/usage-tracking" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="assets/img/svg/trending-up.svg"
                  alt="image"
                />
              </NavLink>{" "}
              Usage Tracking
            </li>
            <li
              className={`sidebarLi ${
                splitLocation[1] === "dpa-overview" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/dpa-overview" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="assets/img/svg/grid.svg"
                  alt="image"
                />
              </NavLink>{" "}
              Database &amp; DPA
            </li>
            <li
              className={`sidebarLi ${
                splitLocation[1] === "billing-plans" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/billing-plans" className="stretched-link">
                <img
                  className="sidebarImg"
                  src="assets/img/svg/creditcard.svg"
                  alt="image"
                />
              </NavLink>{" "}
              Billing &amp; Plans
            </li>
            <li
              className={`sidebarLi ${
                splitLocation[1] === "settings" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen("")}
            >
              <NavLink to="/settings" className="stretched-link" state={{c_info:{"name":"Zeesofts"}}}>
                
                <img
                  className="sidebarImg"
                  src="assets/img/svg/settings.svg"
                  alt="image"
                />
              </NavLink>{" "}
              Settings
            </li>
          </ul>
        </div>
        <div className="col-12 sideBarFooter d-flex flex-column justify-content-end">
          <div className="col-12 d-flex justify-content-center">
            <div className="logout pointer" onClick={() => hanldeLogout()}>
              <img src="assets/img/svg/logout.svg" alt="image" /> Logout
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
