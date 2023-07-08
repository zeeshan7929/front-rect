import React from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../Common/Sidebar/Sidebar";

function UploadReview() {
  return (
    <main className="container-fluid h-100">
      <div className="row chatbotMainInner h-100">
        <div className="col-12 px-0 h-100" data-page-name="upload-3">
          <div className="container-fluid h-100">
            <div className="row h-100 mx-0 menuIcon">
              {/* <!--------- Sidebar Start ----------> */}
              <Sidebar />
              {/* <!--------- Right Side Start ----------> */}
              <div className="col-auto rightPart px-0 h-100">
                <div className="row mx-0 h-100 flex-column flex-nowrap overflow-hidden">
                  {/* <!---------- Header Start -----------> */}
                  <div className="col-12 topPart ">
                    <div className="row h-100 mx-0 align-items-center">
                      <div className="col-12 h-100 topPartnner">
                        <div className="row h-100 align-items-center">
                          <div className="col-auto menuIconBtn me-2 d-lg-none d-lg-block ps-0">
                            <img src="../assets/img/svg/grid.svg" alt="" />
                          </div>
                          <div className="col-auto px-0">
                            <div className="pageHeading">
                              Document Upload <span> HR</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!----------- Content Outer Start -----------> */}
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto">
                    {/* <!-------- Main Start -------->

                                <!--Complete Start--> */}
                    <div className="row mx-0 h-100 align-items-center justify-content-center">
                      <div className="col-auto successBoxOuter">
                        <div className="successImg">
                          <img
                            src="../assets/img/svg/success 1.gif"
                            className="w-100 h-100"
                            alt=""
                          />
                        </div>
                        <div className="successHeading">Success!</div>
                        <div className="successText">
                          Documents have been uploaded successfully, the admin
                          will review the upload shortly.
                        </div>
                        <NavLink to="/dpa-selection" className="backBtn2">
                          Back to DPA Selection
                        </NavLink>
                      </div>
                    </div>
                  </div>
                  {/* <!---------- Footer Start ----------> */}
                  <div className="col-12 bottomBar d-flex align-items-center justify-content-end gap-3">
                    {/* <!--- Please add disabled className in uploadBtn--> */}
                    {/* <NavLink to="" className="btn cancelBtn">
                      Cancel
                    </NavLink>
                    <NavLink to="" className="btn uploadBtn">
                      <img
                        src="../assets/img/svg/upload2.svg"
                        className="me-2"
                        alt=""
                      />
                      Upload for Review
                    </NavLink> */}
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

export default UploadReview;
