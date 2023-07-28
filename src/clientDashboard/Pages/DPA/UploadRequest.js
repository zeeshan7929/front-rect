import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { postData } from "../../Common/fetchservices";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { CountConverter } from "../../Common/Others/CountConverter";
import { toaster } from "../../Common/Others/Toaster";

const UploadRequest = ({ sideBar, setSidebarOpen }) => {

  const ids = JSON.parse(localStorage.getItem('a_login'));

  const location = useLocation()
  const navigate = useNavigate();
  let item = location.state.data;
  // console.log(item)
  let dpaID = location.state.dpaId;
  const [tokenUsage,setTokenUsage] = useState([]);
  const [tierInfo,setTierInfo] = useState([]);
  const [documents,setDocuments] = useState([]);
  const [allDocs,setAllDocs] = useState([]);
  const [databaseConsume,setDatabaseConsume] = useState([]);
  let u = 0
  const get_dpa_all_pending_document = async () => {
    const body = {
      client_id: ids.client_id,
      dpa_id: String(dpaID),
    };
    const res = await postData("get_dpa_all_pending_document", body);
    setDocuments(res.result);
    setAllDocs(res.result);
    u = 0;
    res.result.forEach((el)=>{
      u += el.database_usage;
    })
    
    setDatabaseConsume(u);
    const tokens = await postData("get_dpa_training_token_usage_count", body);
    setTokenUsage(tokens.result.dpa_training_token_usage_count);
    
    const res55 = await postData("get_client_tier_info", body);
    setTierInfo(res55.result);
    

  };
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
  const onDeleteFile = async(el)=>{
    const body = {
      id:el.id,
      file_path:el.file_path
    }
    const res = await postData("delete_pending_document", body);
    if (res.result === "success"){
      get_dpa_all_pending_document()
    }
  }
  const getuserInfo = async (u_id)=>{
    const body ={
      client_id: ids?.client_id,
      user_id:u_id
    }
    const res = await postData("get_user_info", body);
    return res?.result
    
  }

  const onApproveAllDocuments = async ()=>{
    let doc_ids = []
    documents.forEach((el)=>{
      doc_ids.push(el.id);
    })
    const body ={
      client_id: ids?.client_id,
      document_ids:doc_ids
    }
    const res = await postData("approve_all_document", body);
    if (res?.result === "Success"){
      toaster(true, "Successfully approved all documents");
      get_dpa_all_pending_document();
    }
    
  }
  const convertDateTODayMonthYear = (date) => {
    let formated = new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formated
  }
  

  useEffect(() => {
    addBlurClass();
    get_dpa_all_pending_document();
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
                sideBar === "grid" ? "show" : ""
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
                    <div className="row h-100 mx-0 dpasetting">
                      <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0">
                        <div className="row mx-0 sticky-top stickyHeader">
                        <Header
                            setSidebarOpen={setSidebarOpen}
                            sideBar={sideBar}
                            textHeader={"Manage DPA Database"}
                            textSubHeader={
                              " you can find all information you require here."
                            }
                          />
                        </div>
                        <div className="row py-3 dpaSettingInnerPage mx-0 bg-transparent">
                          <div className="col-12 pe-xxl-0">
                            <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                              <div className="col pageHeading px-0 fw-semibold">
                                Document Upload Request
                              </div>
                              <div className="col pageSubheading px-0">
                                welcome carmen, you can find all information you
                                require here.
                              </div>
                            </div>
                            <div className="row pe-xxl-4 pe-0 py-3 mx-0">
                              <div className="col-xxl-8 col-12 pb-3 pb-sm-0 realtionCard px-0">
                                <div className="mb-3">
                                  <button
                                    type="button"
                                    className="dpadeleteBtn backBtn btn rounded-pill text-white d-flex align-items-center gap-3 border-0 fw-medium"
                                    onClick={()=>{
                                      navigate(-1)
                                    }}
                                  >
                                    <span className="d-inline-flex">
                                      <img
                                      style={{height:"24px"}}
                                        src="assets/img/svg/arrow-left.svg"
                                        className="w-100"
                                        alt=""
                                      />
                                    </span>
                                    Back
                                  </button>
                                </div>
                                <div className="workplaceCard mb-xxl-0 mb-3">
                                  <div className="row mx-0 innerbody p-3 align-items-center">
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
                                    
                                    <div className="col-sm-auto mt-sm-0 mt-3">
                                      <button
                                        type="button"
                                        className="dpadeleteBtn btn rounded-pill text-white d-inline-flex align-items-center gap-3 border-0 fw-medium"
                                      >
                                        <span className="d-inline-flex">
                                          <img
                                            src="assets/img/svg/trash-2.svg"
                                            className="w-100"
                                            alt=""
                                          />
                                        </span>
                                        Delete DPA
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xxl-4 col-12 ps-xxl-4 px-0">
                                <div className="trainedDataBox">
                                  <div className="row">
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="trainedDataBoxHead">
                                        <img
                                          src="assets/img/svg/traineddata.svg"
                                          alt=""
                                        />{" "}
                                        Trained Data
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="row">
                                        <div className="col">
                                          <div className="progressBarTxt d-flex align-items-center">
                                            <div className="percent">{Math.round((tokenUsage / tierInfo.training_tokens) * 100)
                                                
                                              }
                                            %</div>
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
                                      <div className="progress-stacked progressBar">
                                        <div
                                          className="progress rounded-pill"
                                          role="progressbar"
                                          aria-label="Segment one"
                                          aria-valuenow={Math.round((tokenUsage / tierInfo.training_tokens) * 100)}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                          style={{ width: Math.round((tokenUsage / tierInfo.training_tokens) * 100) }}
                                        >
                                          <div className="progress-bar progressBar1 rounded-pill"></div>
                                        </div>
                                        {/* <div
                                          className="progress rounded-pill"
                                          role="progressbar"
                                          aria-label="Segment two"
                                          aria-valuenow="33"
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                          style={{ width: "33%" }}
                                        >
                                          <div className="progress-bar progressBar2 rounded-pill"></div>
                                        </div> */}
                                      </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="progressBottomTxt">
                                        <span>{CountConverter(tierInfo.training_tokens - tokenUsage)} </span> remaining
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 editSetting uploadFile px-0 pt-4">
                                <div className="row mx-0">
                                  <div className="col-12 px-0 TableCointainer mt-xxl-0 mt-4">
                                    <div className="row mx-0 align-items-center">
                                      <div className="col px-0">
                                        <div className="row mx-0 align-items-center gap-2">
                                          <div className="col-auto documetnUploadReq pe-0">
                                            Document Upload Request
                                          </div>
                                          <div className="col-auto ReqsubHeading">
                                            Documents will be deleted after 5
                                            days if no action is taken
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-auto px-0 mt-xl-0 mt-3">
                                        <div className="row mx-0 gap-2">
                                          <div className="col-auto searchgroup pe-0">
                                            <div className="input-group">
                                              <input
                                                type="search"
                                                className="form-control shadow-none fw-normal border-0 rounded-pill rounded-end-0 bg-white px-3 pe-0"
                                                placeholder="Search user"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                onChange={(e)=>{
                                                  handlerSearch(e.target.value);
                                                }}
                                              />
                                              <button
                                                type="button"
                                                className="input-group-text border-0 rounded-pill rounded-start-0 bg-white py-0 ps-0"
                                                id="basic-addon1"
                                              >
                                                <img
                                                  src="assets/img/svg/032-search.svg"
                                                  alt=""
                                                />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="col-auto">
                                            <button
                                              type="button"
                                              className="btn filtterBTn bg-white d-flex align-items-center justify-content-center"
                                            >
                                              Reset Filters
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className=" col-12 pt-3 pb-5 card me-2 my-3">
                                <table>
                                  <thead className="col-12  border-0">
                                    <tr>
                                      <th className="list-header col-3 ps-2">Document Title</th>
                                      <th className="list-header">Format</th>
                                      <th className="list-header ">Database Usage</th>
                                      <th className="list-header">Upload Date</th>
                                      <th className="list-header">User</th>
                                      <th className="list-header ">Actions</th>
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
                                              el.date_time
                                            )}
                                          </td>
                                          <td className="list-body">
                                            {el.username}
                                          </td>
                                          <td className="list-body d-flex justify-content-a align-items-center" >
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
                                            <i>
                                            <button type="button"
                                              className="dpadeleteBtn btn rounded-pill text-white d-inline-flex align-items-center gap-3 border-0 fw-medium"
                                              style={{background:"#e15656",height:"20px",fontSize:"10px"}}
                                              onClick={()=>{
                                                onDeleteFile(el);
                                              }}
                                            >Delete</button>
                                            </i>
                                            {/* <i className="bi bi-trash3 ps-2 pointer"
                                            
                                            > */}
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
                                  <div className="col-12 px-0 assignedUsersGroup mt-xxl-0 mt-4">
                                    <div className="row mx-0 align-items-center">
                                      <div className="col-xxl-7 mb-xxl-0 mb-4">
                                        <div className="documentCard p-3 rounded">
                                          <div className="row mx-0 text-center align-items-center gx-xxl-2 text-nowrap">
                                            <div className="col-sm col-12">
                                              <div className="balanceCount first fw-bold">
                                                {CountConverter(tierInfo?.training_tokens)}
                                              </div>
                                              <div className="balanceContent">
                                                Current Balance
                                              </div>
                                            </div>
                                            <div className="col-sm col-12 fw-bold dash">
                                              -
                                            </div>
                                            <div className="col-sm col-12">
                                              <div className="balanceCount second fw-bold">
                                                {CountConverter(databaseConsume)}
                                              </div>
                                              <div className="balanceContent">
                                                This upload
                                              </div>
                                            </div>
                                            <div className="col-sm col-12 fw-bold dash">
                                              =
                                            </div>
                                            <div className="col-sm col-12">
                                              <div className="balanceCount thard fw-bold">
                                                {CountConverter(tierInfo.training_tokens - databaseConsume)}
                                              </div>
                                              <div className="balanceContent">
                                                Post-Upload
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xxl-5 px-0 userAssign">
                                        <div className="row mx-0">
                                          <div className="col-12 btnGroup uploadBtnGroup px-0">
                                            <div className="row mx-0 gy-3 justify-content-center">
                                              <div className="col-auto">
                                                <button
                                                  type="button"
                                                  className="btn cancleBtn d-flex align-items-center justify-content-center text-white"
                                                  onClick={()=>{navigate(-1)}}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                              <div className="col-auto">
                                                <button
                                                  type="button"
                                                  className="btn saveChangeBtn approvBtn border-0 d-flex align-items-center justify-content-center text-white"
                                                  onClick={()=>{onApproveAllDocuments();}}
                                                >
                                                  <span className="d-flex">
                                                    <img
                                                      src="assets/img/svg/uploadfile.svg"
                                                      className="h-100"
                                                      alt=""
                                                    />
                                                  </span>
                                                  Approve & Upload
                                                </button>
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
      </div>
    </main>
  );
};

export default UploadRequest;
