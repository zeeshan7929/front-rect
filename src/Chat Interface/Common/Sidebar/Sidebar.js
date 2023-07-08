import React from "react";
import { NavLink, json, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ setSidebarOpen }) {
  const token = JSON.parse(localStorage.getItem("a_login"));

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const hanldeLogout = () => {
    if (token) {
      localStorage.removeItem("a_login");
      navigate("/master-login");
    }
  };
  const handleAdmin = () => {
    if (JSON.parse(localStorage.getItem("m_login"))) {
      navigate("/master-dashboard");
    } else {
      navigate("/master-login");
    }
  };
  return (
    <div className="col-auto leftPart px-0 h-100">
      <div className="row flex-column flex-nowrap h-100 mx-0">
        <div className="col-12 logoOuter">
          <img src="../assets/img/logo/Logo2.svg" alt="" />
          <img
            src="../assets/img/svg/menuClose.svg"
            className="d-lg-none menuCloseIcon ms-2"
            id="menuClose"
            alt="menu close"
            onClick={() => setSidebarOpen("")}
          />
        </div>
        <div className="col-12 userBoxOuter mb-lg-5 mb-md-3 mt-lg-4 mt-md-3 my-2">
          <NavLink to="javascript:;" className="userImg">
            <img
              src="../assets/img/Avatar2.png"
              className="w-100 h-100"
              alt=""
            />
          </NavLink>
          <span className="userName">Carmen</span>
          <span className="userSubHeading">USER</span>
        </div>
        <div className="col 12 px-0 flex-fill overflow-hidden">
          <div className="row mx-0 h-100">
            <div className="col-12 h-100 overflow-hidden-auto px-0 scroolHide">
              <ul className="sideBarLinks list-unstyled">
                <li>
                  <NavLink
                    to="/dpa-selection"
                    className={`sLink ${
                      pathname == "/dpa-selection" ? "active" : ""
                    }`}
                    onClick={() => setSidebarOpen("")}
                  >
                    <img
                      src="../assets/img/svg/grid.svg"
                      className="me-2"
                      alt=""
                    />
                    DPA Selection
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/document-upload"
                    className={`sLink ${
                      pathname == "/document-upload" ? "active" : ""
                    }`}
                    onClick={() => setSidebarOpen("")}
                  >
                    <img
                      src="../assets/img/svg/upload2.svg"
                      className="me-2"
                      alt=""
                    />
                    Document Upload
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/track-my-usage"
                    className={`sLink ${
                      pathname == "/track-my-usage" ? "active" : ""
                    }`}
                    onClick={() => setSidebarOpen("")}
                  >
                    <img
                      src="../assets/img/svg/track.svg"
                      className="me-2"
                      alt=""
                    />
                    Track My Usage
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user-settings"
                    className={`sLink ${
                      pathname == "/user-settings" ? "active" : ""
                    }`}
                    onClick={() => setSidebarOpen("")}
                  >
                    <img
                      src="../assets/img/svg/settings.svg"
                      className="me-2"
                      alt=""
                    />
                    User Settings
                  </NavLink>
                </li>
                <li>
                  <div
                    onClick={() => handleAdmin()}
                    className="sLink locked pointer"
                  >
                    <img
                      src="../assets/img/svg/crown2.svg"
                      className="me-2"
                      alt=""
                    />
                    Admin Dashboard
                    <img
                      src="../assets/img/svg/lock.svg"
                      className="ms-2 lockImg"
                      alt=""
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 sideBottomPart">
          <div onClick={() => hanldeLogout()} className="logOutBtn pointer">
            <img src="../assets/img/svg/logout2.svg" className="me-2" alt="" />
            Logout
          </div>
          <span className="powerText">Powered by Kairav</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
