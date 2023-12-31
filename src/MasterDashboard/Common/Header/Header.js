import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Header = ({ title, setSidebarOpen, sideBar }) => {
  const { pathname } = useLocation();
  let uPathName = pathname.split("/");
  const [windowSize, setWindowSize] = useState({
    width: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="col-12 header px-0">
      <div className="row mx-0 justify-content-center align-items-center">
        <div className="col-12 leftSide">
          <div className="row mx-0 align-items-center">
            <div
              className="col-auto menuIconBtn me-2 d-lg-none d-lg-block ps-0 pointer"
              onClick={() => setSidebarOpen("mgrid")}
            >
              <img src="./../assets/img/svg/grid.svg" alt="" />
            </div>
            <div className="col textSide ps-0">
              <div className="row flex-column mx-0 d-none d-md-flex">
                <div className="col pageHeading px-0">{title}</div>
              </div>
            </div>
            <div className="col-auto imgSide pe-0">
              <div className="row mx-0 imgSideInner">
                {uPathName[1] == "edit" ||
                (uPathName[1] == "editdetail" && windowSize.width < "1398") ? (
                  <div
                    className="notificationBtn pointer"
                    id="openSearch"
                    onClick={() => setSidebarOpen("side")}
                  >
                    <img
                      src="assets/img/svg/topSearch.svg"
                      className="w100"
                      alt=""
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="col-auto px-0">
                  <a href="javascript:;" className="notificationBtn">
                    <img
                      src="./../assets/img/svg/001-notification.svg"
                      className="w100"
                      alt=""
                    />
                    <div className="notificationText">2</div>
                  </a>
                </div>
                <div className="col-auto px-0">
                  <a href="javascript:;" className="userImgBtn">
                    <img
                      src="./../assets/img/bg/Avatar.png"
                      className="w-100"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`col-xxl-4 rightSide chartSide ${
            sideBar == "side" ? "show" : ""
          }`}
          id="SearchOffcanvas"
        >
          <div className="row mx-0 align-items-center">
            {sideBar && windowSize.width < "1398" ? (
              <div className="col-xxl-12 col searchgroup">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control shadow-none fw-normal border-0"
                    placeholder="Search here..."
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                  <button
                    type="button"
                    className="input-group-text border-0"
                    id="basic-addon1"
                  >
                    <img src="assets/img/svg/032-search.svg" alt="" />
                  </button>
                </div>
              </div>
            ) : null}
            <div
              className="col-auto d-xxl-none pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <img
                src="assets/img/svg/menuClose.svg"
                className="searchCloseIcon"
                style={{ cursor: "pointer" }}
                id="searchClose"
                alt="menu close"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
