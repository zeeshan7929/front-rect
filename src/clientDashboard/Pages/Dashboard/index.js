import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { Line } from "rc-progress";
import Highchart from "../../Common/Charts/Highchart";
import { StepsCircleProgress } from "../../Common/Circular Progress/StepsCircleProgress";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { postData } from "../../Common/fetchservices";

import {
  getOptionsDashboardCirculer,
  getOptionsDashboardMain,
} from "../../Common/Others/ChartOptions";
import { useLocation, useNavigate } from "react-router-dom";
import { RenewsDate } from "../../Common/Others/RenewsDate";
import { CountConverter } from "../../Common/Others/CountConverter";

export default function Dashboard({ sideBar, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  let ids = JSON.parse(localStorage.getItem("a_login"));
  const [top3Dpa, setTop3Dpa] = useState([]);
  const [allClientDpa, setAllClientDpa] = useState([]);
  const [filterdDpa, setFilterdDpa] = useState([]);

  const [usersCount, setUsersCount] = useState("");
  const [totalUser, setTotalUser] = useState("");

  const [dpaCount, setDpaCount] = useState("");
  const [totalDpa, setTotalDpa] = useState("");

  const [tokenUsage, setTokenUsage] = useState("");
  const [remainingDays, setRemainingDays] = useState("");

  const [tierInfo, setTierInfo] = useState("");
  // const [renewsDate, setRenewsDate] = useState("");

  const [filterByDate, setFilterByDate] = useState("7 days");

  const getTop3dpa = async () => {
    const body = {
      client_id: ids?.client_id,
    };
    const res = await postData("get_top_3_dpa_usage", body);
    let res1 = await postData("get_client_all_dpa_details", body);
    let res2 = await postData(
      "get_client_remaining_days_to_refresh_tokens",
      body
    );

    let r = await postData("get_client_tier_info", body);
    setTierInfo(r?.result);
    setRemainingDays(
      res2.result.remaining_days ? res2.result.remaining_days : 0
    );
    setTop3Dpa(res?.result);
    setAllClientDpa(res1.result);
  };
  // /get_client_assign_dpa
  const getAllUserCount = async () => {
    const body = {
      client_id: ids?.client_id,
      // dpa_id: "3",
    };
    // User api
    const res = await postData("get_client_assign_user", body);
    setUsersCount(res.result.users_count ? res.result.users_count : 0);

    const res2 = await postData("get_client_created_users", body);
    setTotalUser(
      res2?.result?.created_users_count ? res2?.result?.created_users_count : 0
    );

    // DPA apis
    const res3 = await postData("get_client_assign_dpa", body);
    setDpaCount(
      res3.result.assign_dpa_count ? res3.result.assign_dpa_count : 0
    );

    const res4 = await postData("get_client_created_dpa", body);
    setTotalDpa(
      res4.result.created_dpa_count ? res4.result.created_dpa_count : 0
    );

    // remaining api
    const res5 = await postData("get_client_training_token_usage", body);
    setTokenUsage(
      res5.result.training_token_usage ? res5.result.training_token_usage : 0
    );

    const res6 = await postData(
      "get_client_remaining_days_to_refresh_tokens",
      body
    );
    setRemainingDays(
      res6.result.remaining_days ? res6.result.remaining_days : 0
    );

    // Tier api

    //   const res7 = await postData("get_client_sub_renew_date", body);
    //   setRenewsDate(res7.result.sub_renew_date);
  };

  const groupByCategory = top3Dpa.reduce((group, product) => {
    const { dpa_name } = product;
    group[dpa_name] = group[dpa_name] ?? [];
    group[dpa_name].push(product);
    return group;
  }, {});

  let data = Object.values(groupByCategory).map((item) => {
    let count = 0;
    
    item.map((el) => {
      count += Number(el.dpa_usage);
    });
    return { name: item[0].dpa_name, y: count, color: item[0].dpa_color };
  });
  useEffect(() => {
    getTop3dpa();
    addBlurClass();
    getAllUserCount();
  }, []);

 

  return (
    <div className="container-fluid h-100">
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
                  <Sidebar setSidebarOpen={setSidebarOpen} sideBar={sideBar} />
                </div>
              </div>
              <div className="col rightBgPart px-0 h-100">
                <div className="row mx-0 h-100">
                  <div className="col px-0 rightPart h-100">
                    <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                      <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                        <div className="row h-100 mx-0">
                          <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                            <div className="row mx-0 sticky-top stickyHeader">
                              <Header
                                setSidebarOpen={setSidebarOpen}
                                textHeader={"Dashboard"}
                                textSubHeader={
                                  " Welcome Carmen, you can find all information you require here."
                                }
                              />
                            </div>
                            <div className="row py-3">
                              <div className="col-12">
                                <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                  <div className="col pageHeading px-0">
                                    Dashboard
                                  </div>
                                  <div className="col pageSubheading px-0">
                                    Welcome Carmen, you can find all information
                                    you require here.
                                  </div>
                                </div>
                                <div className="row dashboardCardDetail g-3">
                                  <div className="col-md-3 col-sm-6">
                                    <div
                                      className="dashboardCard"
                                      // style="--color:#4A5C77"
                                      style={{ backgroundColor: "#4A5C77" }}
                                    >
                                      <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                          <div className="dashboardNumber">
                                            {totalUser}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/userIcon.svg"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12 pe-0">
                                          <div className="dashboardCardText">
                                            of {usersCount} Users
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6">
                                    <div
                                      className="dashboardCard"
                                      // style="--color:#9BB7C2"
                                      style={{ backgroundColor: "#9BB7C2" }}
                                    >
                                      <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                          <div className="dashboardNumber">
                                            {totalDpa}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/grid.svg"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12 pe-0">
                                          <div className="dashboardCardText">
                                            of {dpaCount} DPAs
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6">
                                    <div
                                      className="dashboardCard"
                                      style={{ backgroundColor: "#A5B3C9" }}
                                    >
                                      <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                          <div className="dashboardNumber">
                                            {CountConverter(tokenUsage)}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/trending-up.svg"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12 pe-0">
                                          <div className="dashboardCardText">
                                            remaining for {remainingDays} days
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6">
                                    <div
                                      className="dashboardCard"
                                      style={{ backgroundColor: "#898989" }}
                                    >
                                      <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                          <div className="dashboardNumber">
                                            {tierInfo?.name}
                                          </div>
                                          {/* <!-- <div className="dashboardIcon"><img src="assets/img/svg/user.svg" alt="" /></div> --> */}
                                        </div>
                                        <div className="col-12 pe-0">
                                          <div className="dashboardCardText">
                                            Tier renews{" "}
                                            <span className="">
                                              {RenewsDate(tierInfo?.renew_date)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card shadow-none border-0 p-3 dpaSection  my-4">
                                  <Highchart
                                    data={data}
                                    gradiant={{
                                      color1: "#4a5c77",
                                      color2: "#4a5c77",
                                    }}
                                  />
                                </div>
                                <div className="card shadow-none border-0 p-3 dpaSection topDapSection  mb-4">
                                  <div className="row mx-0 align-items-center">
                                    <div className="col-12 dpaUsesHeading fw-semibold mb-3">
                                      Top 3 DPA Usage
                                    </div>
                                    <div className="col-12 px-0">
                                      <div className="row mx-0 align-items-center">
                                        <div className="col-xl-6 px-0 leftSide">
                                          {top3Dpa?.map((el, i) => {
                                            return (
                                              <div
                                                key={Math.random()}
                                                className="workPlace commonWork row mx-0 align-items-center mb-3"
                                              >
                                                <div className="col-auto">
                                                  <div
                                                    style={{
                                                      backgroundColor:
                                                        i == 0
                                                          ? "#e7ebb8"
                                                          : i == 1
                                                          ? "#aec7e8"
                                                          : i == 2
                                                          ? "#cec0ec"
                                                          : "",
                                                    }}
                                                    className="workColor rounded-circle"
                                                  ></div>
                                                </div>
                                                <div className="col px-0">
                                                  <div className="row mx-0 align-items-center">
                                                    <div className="col">
                                                      <div className="workHeading fw-medium">
                                                        {el.dpa_name}
                                                      </div>
                                                      <div className="workToken fw-normal">
                                                        Total Token Used:{" "}
                                                        <span className="fw-semibold">
                                                          {CountConverter(
                                                            el.dpa_usage
                                                          )}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <div className="col-auto">
                                                      <button
                                                        type="button"
                                                        style={{
                                                          backgroundColor:
                                                            i == 0
                                                              ? "#e7ebb8"
                                                              : i == 1
                                                              ? "#aec7e8"
                                                              : i == 2
                                                              ? "#cec0ec"
                                                              : "",
                                                        }}
                                                        className="btn trackBtn rounded-pill text-white d-flex align-items-center gap-2"
                                                        onClick={() =>
                                                          navigate(
                                                            "/usage-tracking-dpa",
                                                            {
                                                              state: {
                                                                item: el,
                                                                renewDate:
                                                                  tierInfo?.renew_date,
                                                                tokenLimit:
                                                                  remainingDays,
                                                              },
                                                            }
                                                          )
                                                        }
                                                      >
                                                        Track{" "}
                                                        <span className="d-inline-flex">
                                                          <img
                                                            src="assets/img/svg/030-right-arrow.svg"
                                                            className="h-100"
                                                            alt=""
                                                          />
                                                        </span>
                                                      </button>
                                                    </div>
                                                    <div className="col-12 progressGroup mt-2">
                                                      <Line
                                                        percent={el.dpa_usage}
                                                        strokeWidth={1.5}
                                                        trailWidth={1.5}
                                                        strokeColor={
                                                          i == 0
                                                            ? "#e7ebb8"
                                                            : i == 1
                                                            ? "#aec7e8"
                                                            : i == 2
                                                            ? "#cec0ec"
                                                            : ""
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                        <div className="col-xl-6 mt-3 mt-xl-0">
                                          {/* <img
                                            src="assets/img/svg/workchart.svg"
                                            className="w-100"
                                            alt=""
                                          /> */}
                                          {/* <StepsCircleProgress /> */}
                                          <HighchartsReact
                                            highcharts={Highcharts}
                                            options={getOptionsDashboardCirculer(
                                              "pie",
                                              true,
                                              data
                                            )}
                                          />
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
                  <RightSidebar
                    sideBar={sideBar}
                    setSidebarOpen={setSidebarOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
