import React, { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { useLocation } from "react-router-dom";
import { useOnClickOutside } from "../../clientDashboard/Common/Others/useOnClickOutside";
import Header from "../Common/Header/Header";

function WorkPlaceRelation({ sideBar, setSidebarOpen }) {
  const location = useLocation();
  let item = location?.state?.item;
  let ids = JSON.parse(localStorage.getItem("a_login"));
  const [starredMsg, setStarredMsg] = useState([]);
  const [removeStar, setRemoveStar] = useState();
  const [isOpen, setIsOpen] = useState("");
  const [quary, setQuary] = useState("");
  const [details, setDetails] = useState([]);
  const [show, setshow] = useState(false);
  const [submitting,setSubmitting] = useState(false);
  const ref = useRef();
  
  const handleStarredMsg = async () => {
    const body = {
      client_id: ids.client_id,
      user_id: String(ids.user_id),
      dpa_id: item?.dpa_id,
    };
    const res = await postData("u_get_all_starred_message", body);
    setStarredMsg(res?.result);
  };
  const handleAutoClose = () => {
    setIsOpen("");
  };

  useOnClickOutside(ref, handleAutoClose);

  useEffect(() => {
    handleStarredMsg();
  }, []);

  const handleQuestion = useCallback(async () => {
    const body = {
      client_id: item?.client_id,
      user_id: item?.user_id,
      dpa_id: item?.dpa_id,
      query: quary,
    };
    setSubmitting(true);
    try {
    const res = await postData("u_request_query", body);
    details === undefined ? setDetails(res?.result) : setDetails(old=>[...old,res?.result])
    // details.length > 0 ? setDetails(old=>[...old,res?.result]) : setDetails(res?.result)
    console.log(details)
    setshow(true);
    }catch(er) {
      console.warn(er)
    }finally{
      setSubmitting(false)
    }

  }, [quary]);
  const handleAllDetails = useCallback(async () => {
    const body = {
      client_id: item?.client_id,
      user_id: item?.user_id,
      dpa_id: item?.dpa_id,
      query: details?.query,
      answer: details?.response,
      files: details?.attachments,
    };
    const res = await postData("u_add_starred_message", body);
    if (res?.result == "success") {
      setshow(true);
    }
  }, [Object.values(details || {})]);

  const handleDpaReset = ()=>{
    setshow(false)
    setDetails("");
  }


  const handleDeleteStarr = async (id) => {
    const body = {
      starred_id: id,
    };
    const res = await postData("u_delete_starred_message", body);
    if (res.result == "success") {
      handleStarredMsg();
    }
  };
  let t = (
    <>
      DPA: {item?.dpa_name}
    </>
  );

 
  const formatDate = (date) => {
    let formatedDate = `${date.slice(0, 4)} ${date.slice(8, date.length)}`;
    return formatedDate;
  };
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
                <div className="row mx-0 h-100 flex-column flex-nowrap overflow-hidden">
                  <Header title={t} setSidebarOpen={setSidebarOpen} rightElements={<button onClick={handleDpaReset} style={{background:"#DF9292",color:"white",borderRadius:"20px",boxShadow:"none",outline:"none",border:"none",padding:"4px 8px"}}><svg style={{marginRight:"10px"}} xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
  <path d="M2.57935 2.16071V6.48213M2.57935 6.48213H6.55653M2.57935 6.48213C4.12212 4.97785 5.55088 3.27474 7.71344 2.94417C8.99434 2.74837 10.2991 3.01016 11.4312 3.69008C12.5632 4.37001 13.4612 5.43124 13.9899 6.71388M14.5109 15.125V10.8036M14.5109 10.8036H10.5337M14.5109 10.8036C12.9681 12.3078 11.5394 14.011 9.37679 14.3415C8.0959 14.5373 6.79113 14.2755 5.65908 13.5956C4.52703 12.9157 3.62903 11.8545 3.10038 10.5718" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Reset DPA</button>} />
                  <div className="col-12 mainPart d-flex flex-column flex-fill overflow-hidden chatArea">
                    <div className="row mx-0 flex-column flex-nowrap overflow-hidden h-100">
                      <div className="col-12 flex-fill overflow-hidden-auto">
                        <div className="row mx-0 py-4 px-xl-4">
                          { Object?.keys(details).map((keyName, ii)=>(
                            <div>
                                <div className="col-12 userMessage mb-3">
                                <div className="userMessageInner p-2 d-flex justify-content-between">
                                  <div className="text">{details[ii].query}</div>
                                  <div className="msgTime d-flex align-items-end">
                                    {formatDate(new Date().toLocaleTimeString())}
                                  </div>
                                </div>
                                </div>
                                <div className="col-12 botMessage mb-3">
                                <div className="botMessageInner p-2">
                                  <div className="row mx-0">
                                    <div className="col-12 px-0">
                                      <div className="text">
                                        {details[ii].response}
                                      </div>
                                    </div>
                                  
                                    
                                 
                              <div className="col-12 px-0">
                                    {details[ii]?.attachments?.map((item,i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="row mx-0 mt-3"

                                        >
                                          <div className="col px-0 d-flex flex-wrap gap-3">
                                            <div
                                            style={{'cursor':"pointer"}}
                                            onClick={()=>{
                                              window.open("/workplace-relation-preview?id="+item.doc_id,"_blank");
                                            }}
                                              // href="javascript:;"
                                              className="downloadPdf"
                                            >
                                              <img
                                                src="./../assets/img/svg/folder.svg"
                                                className="me-1"
                                                alt="file icon"
                                                id={item?.doc_id}
                                              />
                                              {item?.file_path}
                                            </div>
                                          </div>
                                          <div className="col-auto d-flex align-items-end">
                                            {/* <div className="msgActionBtn border-0 bg-transparent text-decoration-none">
                                              <img
                                                src="./../assets/img/svg/starrrrr.svg"
                                                className=""
                                                alt="file icon"
                                                
                                              />
                                            </div> */}
                                            <div
                                              style={{cursor:"pointer"}}
                                              onClick={()=>{
                                                navigator.clipboard.writeText(details[ii].response)
                                              }}
                                              className="msgActionBtn border-0 bg-transparent text-decoration-none"
                                            >
                                              <img
                                                src="./../assets/img/svg/copyMsg.svg"
                                                className=""
                                                alt="file icon"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                            </div>
                            </div>
                                </div>
                              </div>
                            ))
                            
                          }
                        </div>
                      </div>
                      <div className="col-12 bottomBar chatBottomBar d-flex align-items-start">
                        <div className="chatInputWrapper w-100 position-relative mt-4">
                          <textarea
                          disabled={submitting}
                            onChange={(e) => {
                              if (e.nativeEvent.inputType === "insertLineBreak")
                                return;
                              else {
                                setQuary(e.target.value);
                              }
                            }}
                            value={quary}
                            className="form-control shadow-none w-100"
                            placeholder={submitting ? "Please wait..." :"Enter your query here..."}
                            onKeyPress={(e) => {
                              if (e.key == "Enter" && quary) {
                                handleQuestion();
                                // handleAllDetails();
                                setQuary("");
                              }
                            }}
                          ></textarea>
                          <button
                          disabled={submitting}
                            onClick={() => {
                              if (quary) {
                                handleQuestion();
                                setQuary("");
                                // handleAllDetails();
                              }
                            }}
                            className="border-0 bg-transparent position-absolute end-0 top-50 translate-middle textareaBtn"
                          >
                            <img
                              src="./../assets/img/svg/chatSend.svg"
                              alt="chat send"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* starred response offcanvas */}
                    <div
                      ref={ref}
                      className={`offcanvas offcanvas-end starredResponseOffcanvas ${
                        isOpen == "open" ? " show" : ""
                      }`}
                      style={{ display: isOpen == "open" ? "block" : "" }}
                    >
                      <div className="offcanvas-header">
                        <div className="row w-100 mx-0">
                          <div
                            className="col offcanvas-title"
                            id="starredResponseLabel"
                          >
                            Starred Responses
                          </div>
                          <div className="col-sm-auto mt-2 mt-sm-0">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="Search..."
                              />
                              <button className="input-group-text">
                                <img
                                  src="./../assets/img/svg/chatSearch.svg"
                                  alt="search icon"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="offcanvas-body">
                        {starredMsg?.map((el) => {
                          return (
                            <div key={Math.random()} className="row mx-0">
                              <div className="col-12 msgDate mb-2">
                                <div className="row mx-0">
                                  <div className="col-auto px-0 date">
                                    17 APR, Mon - 2023
                                  </div>
                                  <div className="col pe-0 d-flex align-items-center">
                                    <span className="line"></span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 userMessage mb-3">
                                <div className="userMessageInner p-2 d-flex justify-content-between">
                                  <div className="text">{el?.query}</div>
                                  <div className="msgTime d-flex align-items-end">
                                    {new Date(el.date_time).toLocaleTimeString(
                                      "default",
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 botMessage mb-3">
                                <div className="botMessageInner p-2">
                                  <div className="row mx-0">
                                    <div className="col-12 px-0">
                                      <div className="text">
                                        {/* The annual leave an electrician is
                                        entitled to is 28 days of leave. This
                                        does not include leaves such as: */}
                                        {el?.answers}
                                      </div>
                                    </div>
                                    {/* <div className="col-12 px-0">
                                      <ol className="text m-0 ps-3">
                                        <li>Parental Leave</li>
                                        <li>Compassionate Leave</li>
                                        <li>Sick Leave</li>
                                      </ol>
                                    </div> */}
                                    <div className="col-12 px-0">
                                      {el?.files?.map((item) => {
                                        return (
                                          <div
                                            key={Math.random()}
                                            className="row mx-0 mt-3"
                                          >
                                            <div className="col px-0 d-flex flex-wrap gap-3">
                                              <div
                                                // href="javascript:;"
                                                className="downloadPdf"
                                              >
                                                <img
                                                  src="./../assets/img/svg/folder.svg"
                                                  className="me-1"
                                                  alt="file icon"
                                                />
                                                {item?.filename}
                                              </div>
                                            </div>
                                            <div className="col-auto d-flex align-items-end">
                                              <div
                                                // href="javascript:;"
                                                onClick={() => {
                                                  console.log("start clicked")
                                                  setIsOpen("model");
                                                  setRemoveStar(el?.id);
                                                }}
                                                style={{background:"red"}}
                                                // className="msgActionBtn border-0  text-decoration-none"
                                                // data-bs-toggle="modal"
                                                // data-bs-target="#exampleModal"
                                              >
                                                <img
                                                  src="./../assets/img/svg/starrrrr.svg"
                                                  className=""
                                                  alt="file icon"
                                                />
                                              </div>
                                              <a
                                                href="javascript:;"
                                                className="msgActionBtn border-0 bg-transparent text-decoration-none"
                                              >
                                                <img
                                                  src="./../assets/img/svg/copyMsg.svg"
                                                  className=""
                                                  alt="file icon"
                                                />
                                              </a>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <div
        className={`modal fade modalBox ${isOpen == "model" ? "show" : ""}`}
        style={{ display: isOpen == "model" ? "block" : "" }}
        // id="exampleModal"
        // tabindex="-1"
        // aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        <div className="modal-dialog modalBoxDialog modal-dialog-centered">
          <div className="modal-content modalBoxContent">
            <div className="modal-header modalBoxHeader">
              <div className="modal-title modalBoxTitle" id="exampleModalLabel">
                {" "}
                <img src="../assets/img/svg/star.svg" alt="" /> Remove Starred
                Response
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body modalBoxBody">
              Are you sure you want to remove starred response?
            </div>
            <div className="modal-footer modalBoxfooter">
              <button
                type="button"
                className="cancleBtn"
                data-bs-dismiss="modal"
              >
                {" "}
                <img src="../assets/img/svg/close.svg" alt="" /> Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteStarr(removeStar)}
                className="removeBtn"
              >
                {" "}
                <img src="../assets/img/svg/apply.svg" alt="" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkPlaceRelation;
