import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar/Sidebar";
import Header from "../Common/Header/Header";

import { postData } from "../../clientDashboard/Common/fetchservices";
function DocumentUpload({ sideBar, setSidebarOpen }) {
  const navigate = useNavigate();
  const ids = JSON.parse(localStorage.getItem("a_login"));
  const [AllDpa, setAllDpa] = useState([]);
  const [selectedDpa, setSelectedDpa] = useState([]);

  const all_assign_dpa = async () => {
    const body = {
      client_id: ids.client_id,
      user_id: String(ids.user_id),
    };
    const res = await postData("u_get_user_all_assign_dpa", body);
    setAllDpa(res.result);
  };

  useEffect(() => {
    all_assign_dpa();
  }, []);

  return (
    <main className="container-fluid h-100">
      <div className="row chatbotMainInner h-100">
        <div className="col-12 px-0 h-100" data-page-name="Homepage">
          <div className="container-fluid h-100">
            <div
              className={`row h-100 mx-0 menuIcon ${
                sideBar == "cgrid" ? "show" : ""
              }`}
            >
              {/* <!--------- Sidebar Start ----------> */}
              <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
              {/* <!--------- Right Side Start ----------> */}
              <div className="col-auto rightPart px-0 h-100">
                <div className="row mx-0 h-100 flex-column flex-nowrap overflow-hidden">
                  {/* <!---------- Header Start -----------> */}
                  <Header
                    title={" Document Upload"}
                    setSidebarOpen={setSidebarOpen}
                  />
                  {/* <!----------- Content Outer Start -----------> */}
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto">
                    {/* <!-------- Main Start --------> */}
                    <div className="row mx-0 h-100 uploadSelectionSectionOuter">
                      <div className="col-12 h-100 uploadSelectionInnner">
                        <div className="row mx-0 h-100">
                          <div className="col-md-6 col-12 h-100 leftSide">
                            <div className="row mx-0 h-100 flex-nowrap flex-column overflow-hidden">
                              <div className="col-12 px-0 sideHeading">
                                Select DPA to Upload to
                              </div>
                              {AllDpa.length ? (
                                <div className="col-12 overflow-hidden-auto flex-fill px-0">
                                  <div className="row mx-0 flex-column align-items-center gap-3 pb-3 dataCardOuter">
                                    {AllDpa?.map((el, i) => {
                                      return (
                                        <div
                                          key={Math.random()}
                                          className="col-12 px-0"
                                          onClick={() => {
                                            if (el.dpa_id == selectedDpa.id) {
                                              setSelectedDpa([]);
                                            } else {
                                              setSelectedDpa({"id":el.dpa_id,"name":el.dpa_name});
                                            }
                                          }}
                                        >
                                          <div
                                            className={`card dataCard bg-two  ${
                                              selectedDpa.id == el.dpa_id
                                                ? "chat-active"
                                                : ""
                                            }`}
                                            style={{
                                              backgroundColor: `${AllDpa[i].dpa_color}`,
                                            }}
                                          >
                                            <div className="row mx-0 flex-column h-100 flex-nowrap">
                                              <div className="col-auto px-0">
                                                <div className="dataCardImg">
                                                  <img
                                                    src="../assets/img/svg/grid.svg"
                                                    className="w-100 h-100"
                                                    alt=""
                                                  />
                                                </div>
                                              </div>
                                              <div className="col px-0 dataCardHeading">
                                                {el?.dpa_name}
                                              </div>
                                              <div className="col px-0 dataCardText">
                                                {el?.description}
                                              </div>
                                              <div className="col px-0 flex-fill d-flex">
                                                <NavLink className="cardLink mt-auto ms-auto">
                                                  Use this DPA →
                                                </NavLink>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="col-12 overflow-hidden-auto flex-fill px-0">
                                  <div className="row mx-0 flex-column align-items-center gap-3 pb-3 dataCardOuter text-danger mt-3">
                                    No data found
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 col-12 rightSide">
                            <div className="row mx-0">
                              <div className="col-12 px-0 sideHeading">
                                <img
                                  src="../assets/img/svg/review.svg"
                                  alt=""
                                />
                                Review needed
                              </div>
                              <div className="col-12 px-0">
                                <div className="row mx-0">
                                  <div className="col-12 px-0 reviewText mb-5">
                                    As an end-user with your current access
                                    role, you may not be able to directly train
                                    the DPA using documents.
                                    <br />
                                    <br />
                                    However, you can still contribute to the
                                    training process by suggesting documents for
                                    the admin to review and approve.
                                    <br />
                                    <br />
                                    To do so, you can use the upload widget
                                    located on the left side of the screen. You
                                    can easily upload documents by either
                                    dragging and dropping them into the widget
                                    or by clicking the 'select file' button.
                                    <br />
                                    <br />
                                    Once your documents have been uploaded, the
                                    admin will <span>review</span> and{" "}
                                    <span>approve</span> them before they are
                                    used to train the DPA.
                                  </div>
                                  <div className="col-12 px-0 d-flex align-items-center justify-content-center pb-3">
                                    {/* <!-- Please remove disabled className fform uploadPageBtn--> */}
                                    <div
                                      onClick={() => {
                                        if (selectedDpa) {
                                          navigate("/upload-page", {
                                            state: { dpa_details: selectedDpa },
                                          });
                                        }
                                      }}
                                      className="uploadPageBtn "
                                    >
                                      <img
                                        src="../assets/img/svg/upload2.svg"
                                        className="me-2"
                                        alt=""
                                      />
                                      Go to Upload page
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
                  {/* <!---------- Footer Start ---------->
                                    <!-- <div className="col-12 bottomBar d-flex align-items-center justify-content-end gap-3">
                                        <NavLink className="btn cancelBtn">Cancel</NavLink>
                                        <NavLink className="btn uploadBtn">
                                            <img src="../assets/img/svg/upload2.svg" className="me-2" alt="">
                                            Upload for Review</NavLink>
                                    </div> --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DocumentUpload;
