import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar/Sidebar";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { useImageToBase64 } from "../Common/blob/blob";
import { toaster } from "../../clientDashboard/Common/Others/Toaster";
import FileSizeConverter from "../../clientDashboard/Common/Others/FileSizeConverter";
import Header from "../Common/Header/Header";

function UploadPage({ sideBar, setSidebarOpen }) {
  const location = useLocation();
  const state = location.state;
  const ids = JSON.parse(localStorage.getItem("a_login"));
  const navigate = useNavigate();
  const { base64Image, convertToBase64, setBase64Image } = useImageToBase64();
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [blob, setBlob] = useState("");

  const handleFileChange = (e) => {
    if ((e.currentTarget.files[0].size / 1e6) * 10 < 100) {
      convertToBase64(e.currentTarget.files[0]);
      setFileName(e.currentTarget.files[0]?.name);
      setFileSize(e.currentTarget.files[0]?.size);
      setBlob(URL.createObjectURL(e.currentTarget.files[0]));
    } else {
      setFileName("");
      setBase64Image("");
      setFileSize("");
      toaster(false, "Please choose a file smaller than 10 MB");
    }
  };
  const handleRemoveUpload = () => {
    setFileName("");
    setBase64Image("");
    setFileSize("");
  };
  const handleUploadDoc = async () => {
    const body = {
      client_id: ids.client_id,
      user_id: String(ids.user_id),
      dpa_id: String(state.dpaId),
      filename: fileName,
      content: base64Image,
    };
    const res = await postData("u_upload_new_document", body);
    if (res.result == "success") {
      navigate("/upload-review");
    }
  };
  let t = (
    <>
      Document Upload <span> HR</span>
    </>
  );
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

                  <Header title={t} setSidebarOpen={setSidebarOpen} />
                  {/* <!----------- Content Outer Start -----------> */}
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto">
                    {/* <!-------- Main Start --------> */}
                    <div className="row mx-0 h-100">
                      <div className="col-12 px-0 h-100">
                        <div className="row mx-0 uploadSelectionSectionOuter uploadPageSectionOuter  flex-column flex-nowrap h-100">
                          <div className="col-12 uploadSelectionInnner">
                            <div className="row mx-0">
                              <div className="col-md-6 col-12 leftSide">
                                <div className="row mx-0 h-100">
                                  <div className="col-12 h-100 px-0">
                                    <input
                                      type="file"
                                      onChange={(e) => handleFileChange(e)}
                                      accept=".pdf,.jpg,.png,"
                                      id="uploadFile"
                                      hidden
                                    />
                                    <label
                                      className="fileInpOuter"
                                      htmlFor="uploadFile"
                                    >
                                      <div className="row mx-0 flex-column align-items-center justify-content-center h-100">
                                        <div className="col-auto">
                                          <div className="uploadIconOuter">
                                            <img
                                              src="../assets/img/svg/feather_upload-cloud.svg"
                                              className="w-100 h-100"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="selectHeadig">
                                            Select a file or drag and drop here
                                          </div>
                                          <div className="formetText">
                                            JPG, PNG or PDF, file size no more
                                            than 10MB
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="selectFileBtn">
                                            Select file
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
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
                                      <div className="col-12 px-0 reviewText">
                                        As an end-user with your current access
                                        role, you may not be able to directly
                                        train the DPA using documents.
                                        <br />
                                        <br />
                                        However, you can still contribute to the
                                        training process by suggesting documents
                                        htmlFor the admin to review and approve.
                                        <br />
                                        <br />
                                        To do so, you can use the upload widget
                                        located on the left side of the screen.
                                        You can easily upload documents by
                                        either dragging and dropping them into
                                        the widget or by clicking the 'select
                                        file' button.
                                        <br />
                                        <br />
                                        Once your documents have been uploaded,
                                        the admin will <span>
                                          review
                                        </span> and <span>approve</span> them
                                        before they are used to train the DPA.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {fileName && fileName ? (
                            <div className="col-12 flex-fill overflow-hidden uploadedFileOuter">
                              <div className="col-12 px-0 scrollPart h-100 overflow-hidden-auto">
                                <div className="row mx-0 gap-3 uploadedFileInner">
                                  <div className="col-12 uploadedCard">
                                    <span
                                      className="closetBtn"
                                      onClick={() => handleRemoveUpload()}
                                    >
                                      <img
                                        src="../assets/img/svg/close.svg"
                                        alt=""
                                      />
                                    </span>
                                    <div className="row mx-0 align-items-center flex-nowrap">
                                      <div className="col-auto px-0">
                                        <div className="fileImgOuter">
                                          <img
                                            src="../assets/img/svg/file.svg"
                                            className="w-100 h-100"
                                            alt=""
                                          />
                                        </div>
                                      </div>
                                      <div className="col-auto ps-0 fileNameText">
                                        {fileName}
                                      </div>
                                      <NavLink
                                        to="/document-preview"
                                        state={{ data: blob }}
                                        className="col-auto previewText"
                                      >
                                        Preview
                                      </NavLink>
                                      <div className="col px-0 fileSizeText">
                                        {FileSizeConverter(fileSize)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* <div className="col-12 uploadedCard">
                                  <NavLink to="" className="closetBtn">
                                    <img
                                      src="../assets/img/svg/close.svg"
                                      alt=""
                                    />
                                  </NavLink>
                                  <div className="row mx-0 align-items-center flex-nowrap">
                                    <div className="col-auto px-0">
                                      <div className="fileImgOuter">
                                        <img
                                          src="../assets/img/svg/file.svg"
                                          className="w-100 h-100"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div className="col-auto ps-0 fileNameText">
                                      Passport.png
                                    </div>
                                    <NavLink
                                      to=""
                                      className="col-auto previewText"
                                    >
                                      Preview
                                    </NavLink>
                                    <div className="col px-0 fileSizeText">
                                      5.7MB
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 uploadedCard">
                                  <NavLink to="" className="closetBtn">
                                    <img
                                      src="../assets/img/svg/close.svg"
                                      alt=""
                                    />
                                  </NavLink>
                                  <div className="row mx-0 align-items-center flex-nowrap">
                                    <div className="col-auto px-0">
                                      <div className="fileImgOuter">
                                        <img
                                          src="../assets/img/svg/file.svg"
                                          className="w-100 h-100"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div className="col-auto ps-0 fileNameText">
                                      Passport.png
                                    </div>
                                    <NavLink
                                      to=""
                                      className="col-auto previewText"
                                    >
                                      Preview
                                    </NavLink>
                                    <div className="col px-0 fileSizeText">
                                      5.7MB
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 uploadedCard">
                                  <NavLink to="" className="closetBtn">
                                    <img
                                      src="../assets/img/svg/close.svg"
                                      alt=""
                                    />
                                  </NavLink>
                                  <div className="row mx-0 align-items-center flex-nowrap">
                                    <div className="col-auto px-0">
                                      <div className="fileImgOuter">
                                        <img
                                          src="../assets/img/svg/file.svg"
                                          className="w-100 h-100"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div className="col-auto ps-0 fileNameText">
                                      Passport.png
                                    </div>
                                    <NavLink
                                      to=""
                                      className="col-auto previewText"
                                    >
                                      Preview
                                    </NavLink>
                                    <div className="col px-0 fileSizeText">
                                      5.7MB
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 uploadedCard">
                                  <NavLink to="" className="closetBtn">
                                    <img
                                      src="../assets/img/svg/close.svg"
                                      alt=""
                                    />
                                  </NavLink>
                                  <div className="row mx-0 align-items-center flex-nowrap">
                                    <div className="col-auto px-0">
                                      <div className="fileImgOuter">
                                        <img
                                          src="../assets/img/svg/file.svg"
                                          className="w-100 h-100"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div className="col-auto ps-0 fileNameText">
                                      Passport.png
                                    </div>
                                    <NavLink
                                      to=""
                                      className="col-auto previewText"
                                    >
                                      Preview
                                    </NavLink>
                                    <div className="col px-0 fileSizeText">
                                      5.7MB
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 uploadedCard">
                                  <NavLink to="" className="closetBtn">
                                    <img
                                      src="../assets/img/svg/close.svg"
                                      alt=""
                                    />
                                  </NavLink>
                                  <div className="row mx-0 align-items-center flex-nowrap">
                                    <div className="col-auto px-0">
                                      <div className="fileImgOuter">
                                        <img
                                          src="../assets/img/svg/file.svg"
                                          className="w-100 h-100"
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                    <div className="col-auto ps-0 fileNameText">
                                      Passport.png
                                    </div>
                                    <NavLink
                                      to=""
                                      className="col-auto previewText"
                                    >
                                      Preview
                                    </NavLink>
                                    <div className="col px-0 fileSizeText">
                                      5.7MB
                                    </div>
                                  </div>
                                </div> */}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* <!---- No file select --> */}
                              <div className="col-12 pt-md-5 pb-4 mt-md-5 noFile">
                                No files uploaded yet
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!---------- Footer Start ----------> */}
                  <div className="col-12 bottomBar d-flex align-items-center justify-content-end gap-3">
                    {/* <!--- Please add disabled className in uploadBtn--> */}
                    <div
                      onClick={() => window.history.back()}
                      className="btn cancelBtn"
                    >
                      Cancel
                    </div>
                    <div
                      onClick={() => handleUploadDoc()}
                      className="btn uploadBtn"
                    >
                      <img
                        src="../assets/img/svg/upload2.svg"
                        className="me-2"
                        alt=""
                      />
                      Upload for Review
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

export default UploadPage;
