import React, { useEffect, useState } from "react";
import { addBlurClass } from "../../clientDashboard/Common/Others/AddBlurClass";
import Sidebar from "../Common/Sidebar/Sidebar";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { Header } from "../Common/Header/Header";
import MasterHighchart from "../Common/MasterChart/MasterHighchart";
import { CountConverter } from "../../clientDashboard/Common/Others/CountConverter";
import Modal from "../../clientDashboard/Common/Modal";
import { toast } from "react-toastify";
function MDashboard({ sideBar, setSidebarOpen }) {
  const [count, setCount] = useState({});
  const [updateApi, SetUpdate] = useState("");
  const [open, setopen] = useState(false);

  const handleCount = async () => {
    const clientC = await postData("m_clients_count");
    const dpaC = await postData("m_dpa_count");
    const modelC = await postData("m_model_usage_count");
    const embeddingC = await postData("m_embedding_usage_count");
    const apiK = await postData("m_get_api_key");
    setCount({
      ...count,
      clientCount: clientC?.result,
      dpaCount: dpaC?.result,
      modelCount: modelC?.result,
      embeddingCount: embeddingC?.result,
    });
    SetUpdate(apiK?.result);
  };

  const handleUpdateApi = async () => {
    const body = {
      api_key: updateApi,
    };
    const res = await postData("m_update_api_key", body);
    setopen(false);
    if (res?.result == "success") {
      handleCount();
      toast(true, "Successfully Update");
    } else {
      toast(false, "Error in APi");
    }
  };

  useEffect(() => {
    handleCount();
    addBlurClass();
  }, []);

  return (
    <>
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
                    <div className="col-8 px-0 rightPart singleRightPart h-100">
                      <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                        <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                          <div className="row h-100 mx-0">
                            <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                              <div className="row mx-0 sticky-top stickyHeader">
                                <Header
                                  title={"Dashboard"}
                                  setSidebarOpen={setSidebarOpen}
                                />
                              </div>
                              <div className="row mx-0 justify-content-center">
                                <div className="col-xxl-8">
                                  <div className="row py-3">
                                    <div className="col-12 px-0">
                                      <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                        <div className="col pageHeading px-0">
                                          Dashboard
                                        </div>
                                      </div>
                                      <div className="row dashboardCardDetail g-3">
                                        <div className="col-md-3 col-sm-6">
                                          <div
                                            className="dashboardCard"
                                            style={{
                                              backgroundColor: "#464255",
                                            }}
                                          >
                                            <div className="row">
                                              <div className="col-12 d-flex justify-content-between">
                                                <div className="dashboardNumber">
                                                  {count?.clientCount}
                                                </div>
                                                {/* <!-- <div className="dashboardIcon"><img src="./../assets/img/svg/userIcon.svg" alt=""></div> --> */}
                                              </div>
                                              <div className="col-12 pe-0">
                                                <div className="dashboardCardText">
                                                  Company Clients
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-3 col-sm-6">
                                          <div
                                            className="dashboardCard"
                                            style={{
                                              backgroundColor: "#4A5C77",
                                            }}
                                          >
                                            <div className="row">
                                              <div className="col-12 d-flex justify-content-between">
                                                <div className="dashboardNumber">
                                                  {count?.dpaCount}
                                                </div>
                                                {/* <!-- <div className="dashboardIcon"><img src="./../assets/img/svg/grid.svg" alt=""></div> --> */}
                                              </div>
                                              <div className="col-12 pe-0">
                                                <div className="dashboardCardText">
                                                  DPAs
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-3 col-sm-6">
                                          <div
                                            className="dashboardCard"
                                            style={{
                                              backgroundColor: "#9BB7C2",
                                            }}
                                          >
                                            <div className="row">
                                              <div className="col-12 d-flex justify-content-between">
                                                <div className="dashboardNumber">
                                                  {/* {modelCount} */}
                                                  {count?.modelCount >=
                                                    "1000" &&
                                                  count?.modelCount <= "1000000"
                                                    ? `${(
                                                        count?.modelCount / 1000
                                                      ).toFixed(1)}k`
                                                    : count?.modelCount >=
                                                      1000000
                                                    ? `${(
                                                        count?.modelCount /
                                                        1000000
                                                      ).toFixed(1)}M`
                                                    : count?.modelCount}
                                                </div>
                                                {/* <!-- <div className="dashboardIcon"><img src="./../assets/img/svg/trending-up.svg" alt=""></div> --> */}
                                              </div>
                                              <div className="col-12 pe-0">
                                                <div className="dashboardCardText">
                                                  Model Usage
                                                  <br />
                                                  Month-to-Date
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-3 col-sm-6">
                                          <div
                                            className="dashboardCard"
                                            style={{
                                              backgroundColor: "#AEC7E8",
                                            }}
                                          >
                                            <div className="row">
                                              <div className="col-12 d-flex justify-content-between">
                                                <div className="dashboardNumber">
                                                  {CountConverter(
                                                    count?.embeddingCount
                                                  )}
                                                </div>
                                                {/* <!-- <div className="dashboardIcon"><img src="./../assets/img/svg/user.svg" alt=""></div> --> */}
                                              </div>
                                              <div className="col-12 pe-0">
                                                <div className="dashboardCardText">
                                                  Embedding Usage <br />
                                                  Month-to-Date
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="apiHolder row mx-0">
                                        <div className="col-12">
                                          <div className="apiHolderHeading">
                                            Update OpenAI API Key
                                          </div>
                                        </div>
                                        <div className="col-12 position-relative">
                                          <input
                                            type="text"
                                            value={updateApi}
                                            onChange={(e) =>
                                              SetUpdate(e.target.value)
                                            }
                                            className="apiHolderInp form-control"
                                            name="updateApi"
                                            id="updateApi"
                                            placeholder="sk-...hpKK"
                                          />
                                          <button
                                            className="apiHolderBtn"
                                            onClick={() => setopen(true)}
                                          >
                                            Update
                                          </button>
                                        </div>
                                      </div>
                                      <MasterHighchart title={"Modal Usage"} />
                                      <MasterHighchart
                                        title={"Embedding Usage"}
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
            </div>
          </div>
        </div>
      </main>
      <Modal
        type={"Apply Changes"}
        modelOpen={open}
        setModelOpen={setopen}
        hanldeFunction={handleUpdateApi}
      />
    </>
  );
}

export default MDashboard;
