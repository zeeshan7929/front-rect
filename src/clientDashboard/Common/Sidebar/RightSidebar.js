import React, { useEffect, useRef, useState } from "react";
import CircularProgress from "../Circular Progress/CircularProgress";
import { Line } from "rc-progress";
import { useOnClickOutside } from "../../Common/Others/useOnClickOutside";
import { postData } from "../fetchservices";
import { RenewsDate } from "../Others/RenewsDate";
import { CountConverter } from "../Others/CountConverter";

export const RightSidebar = ({ sideBar, setSidebarOpen, tiers, id }) => {
  const myref = useRef(null);
  const [open, setOpen] = useState({ dpa: "", trained: "" });
  const [percent, setPercent] = useState("");
  const [uploaddocument, setUploadDocument] = useState();
  const [renewDate, setRenewDate] = useState({});
  const [totalTokenUsed, setTotalTokenUsed] = useState(0);
  const [allUserDpaDetails, setAllUserDpaDetails] = useState([]);
  const [assignDpa,setAssignDpa] = useState("")
  const [dpa_percent,set_dpa_percent] = useState("")
  const [tierInfo,setTierInfo] = useState([])
  const ids = JSON.parse(localStorage.getItem("a_login"));
  const handleRenewDate = async () => {
    let body = {
      client_id: ids.client_id,
    };
    let res = await postData("get_client_tier_info", body);
    setRenewDate(res?.result?.renew_date);
    setTierInfo(res?.result)
    
    const res1 = await postData("/get_client_training_token_usage", body);
    
    setPercent(res1.result.training_token_usage);
    const res4 = await postData('/get_client_dpa_token_usage',body);
    set_dpa_percent(res4)
    const assign_dpa = await postData('/get_client_assign_dpa_token',body);
    setAssignDpa(assign_dpa?.result.assign_dpa_token_count)
    const res2 = await postData("/get_client_uploaded_documents", body);
    setUploadDocument(res2.result.length);
    const res3 = await postData("get_client_all_dpa_details", body);
    setAllUserDpaDetails(res3.result);
  };
  function Round(num, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
}
  let c = allUserDpaDetails?.map((el) => el.dpa_usage);
  let AllDpa = c?.reduce((total, cur) => Number(total) + Number(cur), 0);
  
  const autoClose = () => {
    if (sideBar == "side") {
      setSidebarOpen("");
    }
  };
  useOnClickOutside(myref, autoClose);
  
  const getTotalTokenLimit = async () => {
    const body = {
      client_id: ids.client_id,
      user_id: String(ids.user_id),
    };
    const res = await postData("get_client_dpa_token_usage", body);
    setTotalTokenUsed(Number(res.result.dpa_token_usage));
  };
 
  useEffect(() => {
    handleRenewDate();
    getTotalTokenLimit();
    setOpen({ ...open, dpa: "dpa" });
  }, []);

  return (
    <div
      className={`col-auto lastPart h-100 overflow-hidden px-0 ${
        sideBar == "side" ? "show" : ""
      }`}
      // id="SearchOffcanvas"
    >
      <div ref={myref} className="row overflow-scroll-auto  w-100 mx-0">
        <div className="col-12 rightSide chartSide sticky-top rightSidebarHeader">
          <div className="row mx-0 align-items-center pt-xxl-4 pb-xxl-5 w-100">
            <div className="col-xxl-12 col searchgroup">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control shadow-none fw-normal border-0"
                  placeholder="Search here..."
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <button
                  type="button"
                  className="input-group-text border-0"
                  id="basic-addon1"
                >
                  <img src="assets/img/svg/032-search.svg" alt="" />
                </button>
              </div>
            </div>
            <div
              className="col-auto d-xxl-none pointer"
              onClick={() => setSidebarOpen("")}
            >
              <img
                src="assets/img/svg/menuClose.svg"
                className="searchCloseIcon"
                id="searchClose"
                alt="menu close"
              />
            </div>
          </div>
        </div>
        <div className="col-12 chartSide" style={{maxHeight:"80vh",overflowY:"scroll"}}>
          <div className="accordion row mx-0 g-4" id="accordionExample">
            <div className="col-12">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button bg-white shadow-none ${
                      !open.dpa ? "collapsed" : ""
                    }`}
                    type="button"
                    // data-bs-toggle="collapse"
                    // data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                    onClick={() => {
                      if (open.dpa == "dpa") {
                        setOpen({ ...open, dpa: "" });
                      } else {
                        setOpen({ ...open, dpa: "dpa" });
                      }
                    }}
                  >
                    <div className="accordionHeader w-100">
                      <div className="dpausage d-flex align-items-center gap-2 fw-semibold justify-content-center">
                        <span className="d-inline-flex">
                          <img
                            src="assets/img/svg/message-square-dots.svg"
                            className="iconImg1"
                            alt=""
                          />
                        </span>{" "}
                        DPA Usage
                      </div>
                      {open.dpa == "" ? (
                        <>
                          <div className="row mx-0 align-items-center my-1">
                            <div className="col-auto chartValue fw-semibold">
                              {assignDpa > 0
                                ? Round((((totalTokenUsed + Number.EPSILON) * 100) / assignDpa ),1)
                                : "0"}
                              %
                            </div>
                            <div className="col">
                              <Line
                                percent={
                                  AllDpa > 0
                                    ? Round((((totalTokenUsed + Number.EPSILON) * 100) / assignDpa),1)
                                    : "0"
                                }
                                strokeWidth={2}
                                trailWidth={2}
                                strokeColor="#4a5c77"
                              />
                            </div>
                          </div>
                          <div className="row mx-0 align-items-center">
                            <div className="col renewsContent fw-normal">
                              Usage renews{" "}
                              <span className="fw-bold">
                                {RenewsDate(renewDate)}
                              </span>
                            </div>
                            <div className="col-auto reviewCounting"style={{color:"#4a5c77"}}>
                              {CountConverter(totalTokenUsed)}{" "}
                              <span>
                                out of {CountConverter(assignDpa)}
                              </span>{" "}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className={`accordion-collapse collapse ${
                    open.dpa == "dpa" ? "show" : ""
                  }`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body px-1">
                    <div className="chart mx-auto mb-3">
                      <CircularProgress
                        percentage={
                          assignDpa > 0 ? Round((((totalTokenUsed + Number.EPSILON) * 100) / assignDpa),1) : "0"
                        }
                        usage_renew={RenewsDate(renewDate)}
                        for_={"0"}
                      />
                    </div>
                    <div className="row mx-0 gx-1">
                      <div className="col text-center d-flex flex-column">
                        <div className="token fw-normal flex-fill">
                          Total Tokens
                        </div>
                        <div className="tokenCounting text-center fw-semibold">
                          {CountConverter(assignDpa)}
                        </div>
                      </div>
                      <div className="col text-center d-flex flex-column">
                        <div className="token fw-normal flex-fill">
                          Total Tokens used
                        </div>
                        <div className="tokenCounting text-center fw-semibold">
                          {CountConverter(totalTokenUsed)}
                        </div>
                      </div>
                      <div className="col text-center d-flex flex-column">
                        <div className="token fw-normal flex-fill">
                          Tokens remaining
                        </div>
                        <div className="tokenCounting text-center fw-semibold">
                          {CountConverter(assignDpa - totalTokenUsed)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button bg-white shadow-none ${
                      !open.trained ? "collapsed" : ""
                    }`}
                    type="button"
                    aria-expanded="false"
                    onClick={() => {
                      if (open.trained == "trained") {
                        setOpen({ ...open, trained: "" });
                      } else {
                        setOpen({ ...open, trained: "trained" });
                      }
                    }}
                  >
                    <div className="accordionHeader w-100">
                      <div className="dpausage d-flex align-items-center gap-2 fw-semibold justify-content-center">
                        <span className="d-inline-flex">
                          <img
                            src="assets/img/svg/trained.svg"
                            className="iconImg"
                            alt=""
                          />
                        </span>
                        Trained Data
                      </div>
                      {open.trained == "" ? (
                        <>
                          <div className="row mx-0 align-items-center my-1">
                            <div className="col-auto chartValue fw-semibold" style={{color:"#9BB7C2"}}>
                              {tierInfo.training_tokens > 0
                                ? (( percent / tierInfo.training_tokens ) * 100).toFixed()
                                : "0"}
                              %
                            </div>
                            <div className="col">
                              <Line
                                percent={
                                  tierInfo.training_tokens > 0
                                    ? (
                                        ( percent /  tierInfo.training_tokens ) *
                                        100
                                      ).toFixed()
                                    : "0"
                                }
                                strokeWidth={2}
                                trailWidth={2}
                                strokeColor="#9BB7C2"
                              />
                            </div>
                          </div>
                          <div className="row mx-0 align-items-center">
                            <div className="col renewsContent fw-normal">
                              <span style={{color:"#9BB7C2"}}>Training Tokens</span> used
                              <span className="fw-bold">
                                
                              </span>
                            </div>
                            <div className="col-auto reviewCounting" style={{color:"#9BB7C2"}}>
                              {CountConverter(percent)}{" "}
                              <span>
                                out of {CountConverter(tierInfo.training_tokens)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className={`accordion-collapse collapse ${
                    open.trained == "trained" ? "show" : ""
                  }`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body px-1">
                    <div className="chart mx-auto mb-3">
                      <CircularProgress
                        percentage={
                          tierInfo.training_tokens > 0
                            ? ((percent / tierInfo.training_tokens) * 100).toFixed()
                            : "0"
                        }
                        usage_renew={RenewsDate(renewDate)}
                        for_={"1"}
                      />
                    </div>
                    <div className="row mx-0 gx-1">
                      <div className="col text-center d-flex flex-column">
                        <div className="token fw-normal flex-fill" style={{color:"#9BB7C2"}}>
                          Document
                        </div>
                        <div className="tokenCounting text-center fw-semibold" style={{color:"#9BB7C2"}}>
                          {uploaddocument ? uploaddocument : 0}
                        </div>
                      </div>
                      <div className="col text-center d-flex flex-column">
                        <div className="token fw-normal flex-fill" style={{color:"#9BB7C2"}}>
                          Total Tokens used
                        </div>
                        <div className="tokenCounting text-center fw-semibold" style={{color:"#9BB7C2"}}>
                          {CountConverter(percent)}
                        </div>
                      </div>
                      <div className="col text-center d-flex flex-column" style={{color:"#9BB7C2"}}>
                        <div className="token fw-normal flex-fill" style={{color:"#9BB7C2"}}>
                          Tokens remaining
                        </div>
                        <div className="tokenCounting text-center fw-semibold" style={{color:"#9BB7C2"}}>
                          {CountConverter(tierInfo.training_tokens - percent)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tiers?.length > 0 ? (
            <div class="row mx-0">
              <div class="col-12">
                <div class="tiersBox">
                  <div class="row">
                    <div class="col-12">
                      <div class="tiersHeading">Tiers</div>
                    </div>
                    {tiers?.map((el) => {
                      return (
                        <div class="col-12" key={el?.id}>
                          <div
                            class={`tiersSection ${
                              id == el?.id ? "active" : ""
                            }`}
                            style={{
                              backgroundColor:
                                el?.name == "Lite Plan"
                                  ? "#D8EBEC"
                                  : el?.name == "Premium"
                                  ? "#F6E8EA"
                                  : "#FAF5EC",
                            }}
                          >
                            <div class="row mx-0">
                              <div class="col-12">
                                <div class="row ">
                                  <div class="col">
                                    <div class="tiersSectionHeading">
                                      {id == el?.id
                                        ? "Current Plan"
                                        : "Upgrade to"}
                                    </div>
                                    <div class="tiersSectionSubHeading">
                                      {el?.name}
                                    </div>
                                  </div>
                                  <div class="col-auto">
                                    {id == el?.id ? (
                                      <img
                                        src="./../assets/img/svg/4star.svg"
                                        alt=""
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div class="col-12">
                                <ul class="ulList">
                                  <li class="list">
                                    {CountConverter(el?.training_tokens)}{" "}
                                    Training Database
                                  </li>
                                  <li class="list">
                                    {" "}
                                    {CountConverter(el?.database_usage)}{" "}
                                    Database Usage
                                  </li>
                                  <li class="list">
                                    {CountConverter(el?.num_of_users)} Users
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div class="col-12 d-flex justify-content-end">
                      <button class="upBtn">Upgrade</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* <div className="latestActivity mt-4">
            <div className="row mx-0 ps-4">
              <div className="col-12 activityHeading fw-medium mb-3 px-0">
                Latest Activity
              </div>
              <div className="col-12 activityTime position-relative ms-4 mb-2">
                <div className="timing fw-medium">January 2nd, 04:35 AM</div>
                <div className="timecaption fw-normal">
                  Illum omnis quo illum nisi. Nesciunt est accusamus. Blanditiis
                  nisi quae eum nisi similique. Modi consequuntur totam
                </div>
              </div>
              <div className="col-12 activityTime position-relative ms-4 mb-2">
                <div className="timing fw-medium">January 2nd, 04:35 AM</div>
                <div className="timecaption fw-normal">
                  Illum omnis quo illum nisi. Nesciunt est accusamus. Blanditiis
                  nisi quae eum nisi similique. Modi consequuntur totam
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
