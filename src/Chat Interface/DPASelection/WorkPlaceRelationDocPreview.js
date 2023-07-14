import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { useLocation, useSearchParams } from "react-router-dom";
import { useOnClickOutside } from "../../clientDashboard/Common/Others/useOnClickOutside";
import Header from "../Common/Header/Header";
import { Document, Font, PDFViewer, Page, Text } from "@react-pdf/renderer";

function WorkPlaceRelationDocPreview({ sideBar, setSidebarOpen }) {
  const location = useLocation();
  let item = location?.state?.item;
  let ids = JSON.parse(localStorage.getItem("a_login"));

  const [searchParams,] = useSearchParams();

  const [content, setContent] = useState("");

  const getUploadedDocs = async () => {
    const body = {
      doc_id: searchParams.get("id"),
    };
    const responce = await postData("u_get_file_content", body);
    const readableBase64 = atob(responce.result.content);
    setContent(readableBase64);
  };

  useEffect(() => {
    
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

    getUploadedDocs();
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
              <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
              <div className="col-auto rightPart px-0 h-100">
                <div className="row mx-0 flex-column flex-nowrap overflow-hidden">
                  <Header
                    title={"Workplace Relation Document Preview"}
                    setSidebarOpen={setSidebarOpen}
                  />
                </div>
              
                
                <div className="col-12 align-items-center ps--4a px-4 py-3">
                  <div className="rw">
                    <PDFViewer
                      showToolbar={true}
                      style={{
                        height: window.innerHeight,
                        marginVertical: "2%",
                        width: "100%",
                      }}
                    >
                      <Document>
                        <Page pageNumber={1} size="A4">
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
    </main>
  );
}

export default WorkPlaceRelationDocPreview;
