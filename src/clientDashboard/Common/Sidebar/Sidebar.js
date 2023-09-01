import React, { useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useOnClickOutside } from "../Others/useOnClickOutside";
import { postData } from "../fetchservices";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = ({ setSidebarOpen, sideBar }) => {
  const myref = useRef(null);
  const [profileImage,setProfileImage] = useState("")
  const [clientInfo,setClientInfo] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const token = JSON.parse(localStorage.getItem("a_login"));

  const hanldeLogout = () => {
    if (token) {
      localStorage.removeItem("a_login");
      navigate("/assistant-login");
    }
  };
  const autoClose = () => {
    if (sideBar === "grid") {
      setSidebarOpen("");
    }
  };

  useOnClickOutside(myref, autoClose);

  useEffect(() => {
      postData("get_client_info", {
        client_id: token.client_id,
        user_id: token.user_id.toString(),
      })
        .then((res) => {
          
          if (String(res?.result.logo_path) !== "Logo_images/"){
            get_base64_image(res?.result.logo_path)
          }
          setClientInfo(res?.result)
        })
        .catch((er) => {
          console.warn(er);
        });
      
    }, []);
  let get_base64_image =  async(image) =>{
    const body = {
      filename:image
    }
    const res = await postData("reterive_image", body);
    if (res.result !== ""){
    setProfileImage(res?.result)
    console.log(profileImage)
    }
  }
  return (
    <div ref={myref} className="col-12 sideBarInner h-100">
      <div className="row d-flex  flex-column h-100 flex-nowrap">
        <div className="col-12 sideBarHeader " style={{justifyContent:"center",alignItems:"center",gap:"5px",marginBottom:"20px"}}>
          <div className="" style={{marginBottom:"5px",padding:"0px"}}>
            <img width={"50px"} height={"50px"} style={{border:"1px solid gray" , borderRadius:"50px"}} src={profileImage !== "" ? "data:image/png;base64, "+profileImage : ""} alt="image" />
            
          </div>
          <h4>{clientInfo.name}</h4>
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
