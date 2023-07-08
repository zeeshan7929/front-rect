import React from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import {
  Document,
  Image,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";

function Preview({ sideBar, setSidebarOpen }) {
  const location = useLocation();
  let img = location.state.data;
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      color: "red",
      height: window.innerHeight - 100,
      overflow: "hidden",
    },
    viewer: {
      height: window.innerHeight - 80,
      marginVertical: "10%",
      width: "100%",
    },
    image: {
      width: "200px",
      height: "200px",
    },
  });

  return (
    <main className="container-fluid h-100">
      <div className="row chatbotMainInner h-100">
        <div className="col-12 px-0 h-100" data-page-name="upload-3">
          <div className="container-fluid h-100">
            <div
              className={`row h-100 mx-0 menuIcon ${
                sideBar == "cgrid" ? "show" : ""
              }`}
            >
              {/*------- Sidebar Start --------*/}

              <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />

              {/*------- Right Side Start --------*/}
              <div className="col-auto rightPart px-0 h-100">
                <div className="row mx-0 h-100 flex-column flex-nowrap overflow-hidden">
                  {/*-------- Header Start ---------*/}
                  <div className="col-12 topPart ">
                    <div className="row h-100 mx-0 align-items-center">
                      <div className="col-12 h-100 topPartnner">
                        <div className="row h-100 align-items-center">
                          <div
                            className="col-auto menuIconBtn me-2 d-lg-none d-lg-block ps-0"
                            onClick={() => setSidebarOpen("cgrid")}
                          >
                            <img src="../assets/img/svg/grid.svg" alt />
                          </div>
                          <div className="col-11 col-sm-12 d-flex align-items-center justify-content-between ">
                            <div className="pageHeading">
                              DPA <span> Workplace Relations</span>
                            </div>
                            <div class="col-sm-auto position-relative d-flex align-items-center">
                              <input
                                type="text"
                                class="form-control inpSearch w-100"
                                placeholder="Search documents"
                                style={{
                                  position: "relative",
                                  borderRadius: "18px",
                                }}
                              />
                              <div
                                class="inpSearchBtn"
                                style={{
                                  right: "15px",
                                  zIndex: 1,
                                  position: "absolute",
                                }}
                              >
                                <img
                                  src="/../assets/img/svg/search.svg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*--------- Content Outer Start ---------*/}
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto">
                    {/*------ Main Start ------*/}
                    {/*Complete Start*/}
                    <div className="row mx-0 h-100  align-items-center ">
                      <PDFViewer showToolbar={true} style={styles.viewer}>
                        <Document>
                          <Page size={"A4"} style={styles.page} pageNumber={1}>
                            <View
                              style={{
                                //   width: "30%",
                                paddingLeft: "10px 0 0 10px",
                              }}
                            >
                              <Image
                                src={img ? img : "../assets/img/resume.png"}
                                //    style={{ height: "100px", width: "100px" }}
                                style={{
                                  width: "100%",
                                  height: window.innerHeight,
                                }}
                              ></Image>
                            </View>
                          </Page>
                        </Document>
                      </PDFViewer>
                    </div>
                  </div>
                  {/*-------- Footer Start --------*/}
                  {/* <div className="col-12 bottomBar d-flex align-items-center justify-content-end gap-3"> */}
                  {/*- Please add disabled class in uploadBtn*/}
                  {/* <a href="javascript:;" class="btn cancelBtn">Cancel</a>
                        <a href="javascript:;" class="btn uploadBtn">
                            <img src="../assets/img/svg/upload2.svg" class="me-2" alt="">
                            Upload for Review</a> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Preview;
