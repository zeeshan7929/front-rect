import React, { useEffect, useState } from "react";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { Line } from "rc-progress";
import { randomBackground } from "../../Common/Others/RandonColor";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { postData } from "../../Common/fetchservices";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SelectColors } from "../../Common/Others/SelectColors";
import { CountConverter } from "../../Common/Others/CountConverter";

const ManageDpaDatabase = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let item = location?.state?.data;
  const ids = JSON.parse(localStorage.getItem("a_login"));
  let trainedToken = location?.state?.trainToken;
  const [tokenUsage,setTokenUsage] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tierInfo,setTierInfo] = useState([]);
  const [searchValue,setSearchValue] = useState([]);
  const [allDocs,setAllDocs] = useState([]);
  const dpaID = location?.state?.dpaId
    ? location?.state?.dpaId
    : location?.state?.data?.id;
  console.log(trainedToken)
  const get_dpa_all_document = async () => {
    const body = {
      client_id: ids.client_id,
      dpa_id: String(dpaID),
    };
    const res = await postData("get_dpa_all_documents", body);
    setDocuments(res.result);
    setAllDocs(res.result);
    const tokens = await postData("get_dpa_training_token_usage_count", body);
    setTokenUsage(tokens.result.dpa_training_token_usage_count);
    
    const res55 = await postData("get_client_tier_info", body);
    setTierInfo(res55.result);
    

  };
  
  const onDeleteFile = async(el)=>{
    const body = {
      dpa_id:String(dpaID),
      doc_id:el.doc_id,
      client_id:ids.client_id,
      file_path:el.file_path
    }
    const res = await postData("delete_document", body);
    if (res.result === "success"){
      get_dpa_all_document()
    }
  }
  const handlerSearch = (e)=>{
    
    let doc = documents;
    if (e ==="" || e === undefined){
      setDocuments(allDocs);
      return;
    }
    const  newDoc = []
    doc.forEach(element => {
      if (element.filename.includes(e)){
        newDoc.push(element)
      }
      
      setDocuments(newDoc);
    });
  }
  useEffect(() => {
    addBlurClass();
    get_dpa_all_document();
  }, []);

  function generateColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const color = `rgb(${r - 50}, ${g - 50}, ${b - 50})`;
    const textColor = yiq >= 128 ? "#000" : "#fff";
    return { color, textColor };
  }
  const convertDateTODayMonthYear = (date) => {
    let formated = new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const month = formated.split(" ")[0];
    const day = formated.split(" ")[1].split(",")[0];
    const year = formated.split(" ")[2];
    let finalDate = `${day} ${month} ${year}`;
    return finalDate;
  };
  const { color, textColor } = generateColor();

  return (
    <main className="container-fluid h-100">
      <div className="row mainInner h-100">
        <div
          className="col-12 px-0 flex-fill h-100"
          data-page-name="categoriesPage"
        >
          <div className="container-fluid h-100">
            <div
              className={`row main h-100 menuIcon ${
                sideBar == "grid" ? "show" : ""
              }`}
            >
              <div className="col-auto px-0 leftPart h-100">
                <div className="row sideBar h-100">
                  <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
                </div>
              </div>
              <div className="col px-0 rightPart rightBgInnerPart h-100">
                <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                  <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                    <div className="row h-100 mx-0">
                      <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0">
                        <div className="row mx-0 sticky-top stickyHeader">
                          <Header
                            setSidebarOpen={setSidebarOpen}
                            sideBar={sideBar}
                            textHeader={"Manage DPA Database"}
                            textSubHeader={
                              "welcome carmen, you can find all information you require here."
                            }
                          />
                        </div>
                        <div className="row py-3">
                          <div className="col-12">
                            <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                              <div className="col pageHeading px-0">
                                Manage DPA Database
                              </div>
                              <div className="col pageSubheading px-0">
                                welcome carmen, you can find all your billing
                                history here.
                              </div>
                            </div>
                            <div className="row mx-0">
                              <div className="col-xxl-8">
                                <div className="row">
                                  <div className="col-12">
                                    <button
                                      className="backBtn"
                                      onClick={() => navigate(-1)}
                                    >
                                      <img
                                        src="assets/img/svg/leftarrow.svg"
                                        alt="image"
                                      />
                                      Back
                                    </button>
                                  </div>
                                  <div className="col-12 py-3">
                                    <div className="relationBar">
                                      <div className="row align-items-center justify-content-center mx-0">
                                        <div className="col px-0 d-flex alignItems-center">
                                          <div
                                            className="circle"
                                            style={{
                                              width: "34px",
                                              height: "34px",
                                              borderRadius: "50%",
                                              border: "none",
                                              backgroundColor: item?.dpa_color,
                                            }}
                                          />
                                          <div
                                            className="hWorkplace"
                                            style={{
                                              color: "#1E1E1E",
                                              fontSize: "26px",
                                              // fontWeight: "bold",
                                            }}
                                          >
                                            {item?.dpa_name
                                              ? item?.dpa_name
                                              : "no name"}
                                          </div>
                                        </div>
                                        <div className="col-auto d-flex justify-content-end pe-0">
                                          <NavLink
                                            to="/dpa-settings"
                                            state={{
                                              item: item ? item : "",
                                              dpaID,
                                              trainedToken: tokenUsage
                                                ? tokenUsage
                                                : "",
                                            }}
                                            className="relationBarright text-dec"
                                          >
                                            <button className="relationBarrightBtn">
                                              <img
                                                src="assets/img/svg/settings.svg"
                                                alt="image"
                                              />
                                              Edit DPA Settings &amp; Users
                                            </button>
                                          </NavLink>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xxl-4 mb-3 mb-xxl-0">
                                <div className="trainedDataBox">
                                  <div className="row">
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="trainedDataBoxHead">
                                        <img
                                          src="assets/img/svg/traineddata.svg"
                                          alt="image"
                                        />{" "}
                                        Trained Data
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="row">
                                        <div className="col">
                                          <div className="progressBarTxt d-flex align-items-center">
                                            <div className="percent">
                                              {Math.round((tokenUsage / tierInfo.training_tokens) * 100)
                                                
                                                }
                                              %
                                            </div>
                                            <span>used</span>
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="progressBarTxt1">
                                            {CountConverter(tierInfo.training_tokens)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <Line
                                        percent={
                                          (tokenUsage / tierInfo.training_tokens) * 100
                                        }
                                        strokeWidth={1}
                                        trailWidth={1}
                                        strokeColor={[
                                          randomBackground(),
                                          randomBackground(),
                                        ]}
                                      />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="progressBottomTxt">
                                        <span>{CountConverter(tierInfo.training_tokens - tokenUsage)} </span> remaining
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <div className="row mx-0">
                                  <div className="col-xxl mb-3 mb-xxl-0">
                                    <div className="row">
                                      {/* <div className="col-sm-6 col-md-auto mb-3 mb-sm-0">
                                        <div
                                          className="dashboardCard"
                                          style={{ backgroundColor: "#E7EBB8" }}
                                        >
                                          <div className="row">
                                            <div className="col-12 d-flex justify-content-between">
                                              <div className="dashboardNumber">
                                                6
                                              </div>
                                              <div className="dashboardIcon">
                                                <img
                                                  src="assets/img/svg/grid.svg"
                                                  alt="image"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-12 pe-0">
                                              <div className="dashboardCardText">
                                                of 12 DPAs
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div> */}

                                      <div className="col-sm-6 col-md-auto ps-md-0">
                                        <div
                                          className="dashboardCard"
                                          style={{ backgroundColor: "#4A5C77" }}
                                        >
                                          <div className="row">
                                            <div className="col-12 d-flex justify-content-between">
                                              <div className="dashboardNumber">
                                                {documents?.length}
                                              </div>
                                              <div className="dashboardIcon">
                                                <img
                                                  src="assets/img/svg/traineddata.svg"
                                                  alt="image"
                                                />
                                              </div>
                                            </div>
                                            <div className="col-12 pe-0">
                                              <div className="dashboardCardText">
                                                Documents
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-auto px-0 mt-3 mt-md-0">
                                        <div className="row mx-0 flex-md-column">
                                          <div className="col-md-12 col-sm-6 px-md-0">
                                            <NavLink
                                              to="/approve-upload"
                                              state={{
                                                data: item,
                                                dpaId: String(dpaID),
                                              }}
                                              htmlFor="approveupload"
                                              className="pill mb-2 pointer text-dec"
                                              style={{
                                                backgroundColor: "#897FFF",
                                              }}
                                            >
                                              <img
                                                src="assets/img/svg/cloud.svg"
                                                alt="image"
                                              />
                                              Approve Upload
                                            </NavLink>
                                          </div>
                                          <div className="col-md-12 col-sm-6 px-md-0">
                                            <NavLink
                                              to="/upload-documents"
                                              state={{
                                                data: item,
                                                dpaId: String(dpaID),
                                              }}
                                              htmlFor="uploaddocuments"
                                              className="pill pointer text-dec"
                                              style={{
                                                backgroundColor: "#5BCD97",
                                              }}
                                            >
                                              <img
                                                src="assets/img/svg/cloud.svg"
                                                alt="image"
                                              />
                                              Upload Documents
                                            </NavLink>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-xxl-auto d-flex justify-content-end align-items-end px-0">
                                    <div className="row w-100 mx-0">
                                      <div className="col col-xxl-auto position-relative">
                                        <input
                                          type="text"
                                          className="inP form-control shadow-none"
                                          name
                                          id
                                          
                                          onChange={(e)=>{
                                            handlerSearch(e.target.value);
                                          }}
                                          placeholder="Search Document Database"
                                        />
                                        <div className="parent">
                                          <img
                                            src="assets/img/svg/search.svg"
                                            alt="image"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-auto">
                                        <button className="resetBtn" onClick={()=>{
                                          document.getElementsByClassName('inP')[0].value = "";
                                          setDocuments(allDocs);
                                        }}>
                                          Reset Filters
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row mx-0">
                              <div className=" col-12 pt-3 pb-5 card me-2 my-3">
                                <table>
                                  <thead className="col-12  border-0">
                                    <tr>
                                      <th className="list-header col-3 ps-2">
                                        Document Title
                                      </th>
                                      <th className="list-header">Format</th>
                                      <th className="list-header ">
                                        Database Usage
                                      </th>

                                      <th className="list-header ">
                                        Upload Date
                                      </th>
                                      <th className="list-header">User</th>
                                      <th className="list-header">Actions</th>
                                      <th className="list-header ">Tags</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {documents?.map((el) => {
                                      return (
                                        <tr className="  ">
                                          <td className="list-body col-3 ">
                                            {el?.filename}
                                          </td>
                                          <td className="list-body">
                                            {el.format}
                                          </td>
                                          <td className="list-body ps-3">
                                            {CountConverter(el.database_usage)}
                                          </td>
                                          <td className="list-body ">
                                            {convertDateTODayMonthYear(
                                              el.upload_date
                                            )}
                                          </td>
                                          <td className="list-body">
                                            {el.username}
                                          </td>
                                          <td className="list-body d-flex justify-content-a align-items-center">
                                            <i
                                              className="bi bi-eye pointer"
                                              onClick={() =>
                                                navigate("/document-viewer", {
                                                  state: {
                                                    docId: el?.id,
                                                    
                                                    data: item,
                                                  },
                                                })
                                              }
                                            ></i>
                                            <i className="bi bi-download ps-2 pointer"
                                            onClick={()=>{
                                              alert("download file ...")
                                            }}
                                            >

                                            </i>
                                            <i className="bi bi-trash3 ps-2 pointer"
                                            onClick={()=>{
                                              onDeleteFile(el);
                                            }}
                                            >
                                              
                                            </i>
                                          </td>
                                          <td className="list-body  ">
                                            <span
                                              className="tags"
                                              style={{
                                                color: color,
                                                backgroundColor: "#f4f2ff",
                                              }}
                                            >
                                              Market
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                                {/* <div className="dpaDatabase">
                                  <img
                                    src="assets/img/svg/dpadatabase.svg"
                                    alt="image"
                                  />
                                </div> */}
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

export default ManageDpaDatabase;
