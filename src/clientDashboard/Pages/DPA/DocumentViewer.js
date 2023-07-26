import React, { useEffect, useState } from "react";

import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { PDFViewerer } from "../../Common/Others/PDFViewerer";
// import font from "../../../../assets/fonts/Poppins/Poppins-Regular.ttf";

import { Logger } from "logging-library";
import FileViewer from "react-file-viewer";
import { CustomErrorComponent } from "custom-error";
// import pdf from "../../Common/Others/document-viewer.pdf";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";
import pdf from "../../Common/Others/pdf";
import { postData } from "../../Common/fetchservices";
import {useNavigate, useLocation } from "react-router-dom";
{
}
export const DocumentViewer = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  let dpaInfo = location.state.data;
  console.log(location)
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [dpaNAme, setDpaName] = useState("");

  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
      },
      {
        src: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
        fontWeight: "bold",
      },
      {
        src: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
        fontWeight: "normal",
        fontStyle: "italic",
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      color: "black",
      fontFamily: "Poppins",
    },
    viewer: {
      width: "50%", //the pdf viewer will take up all of the width and height
      height: window.innerHeight - 100,
    },
    d_flex: {
      display: "flex",
      flexDirection: "row",
    },
    line: {
      height: "1px",
      opacity: "0.25",
      backgroundColor: "#474d52",
    },
  });

  const getUploadedDocs = async () => {
    const body = {
      document_id: `${location.state.docId}`,
    };
    const responce = await postData("get_file_content", body);
    const readableBase64 = atob(responce.result.content);
    console.log(responce)
    setContent(readableBase64);
    setFileName(responce.result.fileName);
    setDpaName(responce.result.dpa_name);
  };

  useEffect(() => {
    addBlurClass();
    getUploadedDocs();
  }, []);
  return (
    <main className="container-fluid h-100">
      <div className="row mainInner h-100">
        <div
          className="col-12 px-0 flex-fill h-100"
          data-page-name="dpasetting"
        >
          <div className="container-fluid h-100">
            <div
              className={`row main h-100 menuIcon ${
                sideBar == "grid" ? "show" : ""
              }`}
            >
              <div className="col-auto px-0 leftPart h-100">
                <div className="row sideBar h-100">
                  <Sidebar setSidebarOpen={setSidebarOpen} sideBar={sideBar} />
                </div>
              </div>
              <div className="col px-0 rightPart rightBgInnerPart h-100">
                <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                  <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                    <div className="row h-100 mx-0 dpasetting">
                      <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0">
                        <div className="row mx-0 sticky-top stickyHeader">
                          <Header
                            setSidebarOpen={setSidebarOpen}
                            sideBar={sideBar}
                            textHeader={"Document Viewer"}
                            textSubHeader={
                              "welcome carmen, you can find all information you require here."
                            }
                          />
                        </div>
                        <div className="row py-3 dpaSettingInnerPage mx-0 bg-transparent">
                          <div className="col-12 pe-xxl-0">
                            <div className="row pe-xxl-4 pe-0 py-3 mx-0">
                              <div className="col-12 pb-3 pb-sm-0 realtionCard px-0">
                                <div className="mb-3 d-flex align-items-center">
                                  <button
                                    type="button"
                                    onClick={()=>{navigate(-2)}}
                                    className="dpadeleteBtn backBtn btn rounded-pill text-white d-flex align-items-center gap-3 border-0 fw-medium"
                                  >
                                    <img
                                      src="assets/img/svg/arrow-left.svg"
                                      className="w-100"
                                      alt
                                    />
                                    Back
                                  </button>
                                </div>
                                <div className="col-12 editSetting uploadFile px-0 pt-1">
                                  <div className="row mx-0">
                                    <div className="col-12 px-0 TableCointainer align-items-center justify-content-beetween  mt-1">
                                      <div className="col-12 row mx-0 align-items-center">
                                        <div className="col-12 my-s4">
                                          <div className="d-flex align-items-center justify-content-between pt-pb-3  ">
                                            <div className="col-8 workplaceCard mb-xxl-0 mb-">
                                              <div className="row mx-0 innerbody  p-2 align-items-center">
                                                <div className="col-auto">
                                                  <div
                                                    className="workplacePoint rounded-circle"
                                                    style={{
                                                      backgroundColor:
                                                        dpaInfo.dpa_color,
                                                    }}
                                                  />
                                                </div>
                                                <div className="col fs-6 workrelation fw-semibold px-0">
                                                  {dpaInfo.dpa_name}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-auto searchgroup mt-4 h-25">
                                              <div className="input-group h-25">
                                                <input
                                                  type="search"
                                                  className="form-control w-50  shadow-none fw-normal border-0 rounded-pill rounded-end-0 bg-white px-3 pe-0"
                                                  placeholder="Search document"
                                                  aria-label="Username"
                                                  aria-describedby="basic-addon1"
                                                />
                                                <button
                                                  type="button"
                                                  className="input-group-text border-0 rounded-pill rounded-start-0 bg-white py-0 ps-0"
                                                  id="basic-addon1"
                                                >
                                                  <img
                                                    src="assets/img/svg/032-search.svg"
                                                    alt
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12 align-items-center ps--4a px-4 py-3">
                                            <div className="rw">
                                              <PDFViewer
                                              
                                                showToolbar={false}
                                                style={{
                                                  height: window.innerHeight,
                                                  marginVertical: "2%",
                                                  width: "100%",
                                                }}
                                              >
                                                <Document>
                                                  <Page
                                                    pageNumber={1}
                                                    size="A4"
                                                  >
                                                    <Text>{content}</Text>
                                                  </Page>
                                                </Document>
                                              </PDFViewer>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
