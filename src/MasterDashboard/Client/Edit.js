import React, { useEffect, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { RightSidebar } from "../../clientDashboard/Common/Sidebar/RightSidebar";
import MasterClientHighchart from "../Common/MasterChart/MasterClientHighChart";
import { Header } from "../Common/Header/Header";
import { postData } from "../../clientDashboard/Common/fetchservices";

function Edit({ sideBar, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  let item = location?.state?.item;
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();

  const handleClientInfo = async () => {
    const body = {
      client_id: String(item),
    };
    const res1 = await postData("get_client_info", body);
    setUserInfo(res1?.result);
    const res = await postData("get_client_all_users", body);
    let fill = res?.result?.filter((el) => el?.client_id === String(item));
    setUser(fill[0]);
    const data = {
      client_id: fill[0]?.client_id,
      user_id: fill[0]?.id,
    };
    localStorage.setItem("a_login", JSON.stringify(data));
  };

  useEffect(() => {
    handleClientInfo();
  }, []);
  const handleClientConfig = () => {
    if (localStorage.getItem("a_login")) {
      window.open("/Dashboard","__blank") 
    }
  };
  return (
    <main className="container-fluid h-100">
      <div className="row mainInner h-100">
        <div
          className="col-12 px-0 flex-fill h-100"
          data-page-name="categoriesPage"
        >
          <div className="container-fluid h-100">
            <div
              className={`row main h-100 menuIcon masterDashboard ${
                sideBar == "mgrid" ? "show" : ""
              }`}
            >
              <div className="col-auto px-0 leftPart h-100">
                <div className="row sideBar h-100">
                  <Sidebar setSidebarOpen={setSidebarOpen} />
                </div>
              </div>
              <div className="col rightBgPart px-0 h-100">
                <div className="row mx-0 h-100 justify-content-center">
                  <div className="col px-0 rightPart singleRightPart h-100">
                    <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                      <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                        <div className="row h-100 mx-0">
                          <div className="col-12 h-100 px-0 scrollPart d-flex flex-column">
                            <div className="row mx-0 sticky-top stickyHeader">
                              <Header
                                title={"Client’s Profile"}
                                setSidebarOpen={setSidebarOpen}
                              />
                            </div>
                            <div className="row mx-0 justify-content-center h-100 flex-fill overflow-hidden">
                              <div className="col-xxl-8 h-100">
                                <div className="row py-3 overflow-hidden-auto h-100">
                                  <div className="col-12 px-0">
                                    <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                      <div className="col pageHeading px-0">
                                        Client’s Profile
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-12">
                                        <button
                                          className="backBtn"
                                          onClick={() => window.history.back()}
                                        >
                                          <img
                                            src="./../assets/img/svg/leftarrow.svg"
                                            alt=""
                                          />
                                          Back
                                        </button>
                                      </div>
                                      <div className="col-12">
                                        <div className="cavastirSection">
                                          <div className="row">
                                            <div className="col-12">
                                              <div className="cavastirSectionHeading">
                                                {userInfo?.name}
                                              </div>
                                            </div>
                                            <div className="col-12">
                                              <div className="row align-items-center">
                                                <div className="col-sm col-12">
                                                  <div className="cavastirSectionSubHeading mb-2">
                                                    Contact Representative:{" "}
                                                    {user?.name}
                                                  </div>
                                                  <div className="cavastirSectionSubHeading">
                                                    Contact Email: {user?.email}
                                                  </div>
                                                </div>
                                                <div className="col-sm-auto col-12 mt-3 mt-sm-0 d-flex flex-column align-items-center">
                                                  <button
                                                    className="editBtn"
                                                    onClick={() =>
                                                      navigate("/editdetail", {
                                                        state: {
                                                          user: user,
                                                          userInfo: userInfo,
                                                        },
                                                      })
                                                    }
                                                  >
                                                    <img
                                                      src="./../assets/img/svg/edit.svg"
                                                      alt=""
                                                    />
                                                    Edit Details
                                                  </button>
                                                  <button
                                                    className="accessBtn"
                                                    onClick={handleClientConfig}
                                                  >
                                                    <img
                                                      src="./../assets/img/svg/edit.svg"
                                                      alt=""
                                                    />
                                                    Access Client Dashboard
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <MasterClientHighchart
                                      title={"Modal Usage"}
                                      item={item}
                                    />
                                    <MasterClientHighchart
                                      title={"Embedding Usage"}
                                      item={item}
                                    />
                                  </div>
                                </div>
                              </div>
                              <RightSidebar
                                sideBar={sideBar}
                                setSidebarOpen={setSidebarOpen}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Edit;
