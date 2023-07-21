import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import { Line } from "rc-progress";
import Header from "../../Common/Header/Header";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { postData } from "../../Common/fetchservices";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { randomBackground } from "../../Common/Others/RandonColor";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { getOptionsDashboardCirculer } from "../../Common/Others/ChartOptions";
import { RenewsDate } from "../../Common/Others/RenewsDate";
import UsageDpaChart from "../../Common/Charts/UsageDpaChart";
import { CountConverter } from "../../Common/Others/CountConverter";

const UsageTrackingOverview = ({ sideBar, setSidebarOpen }) => {
  let clientId = JSON.parse(localStorage.getItem("a_login"));
  const [allUserDpa, setAllUserDpa] = useState([]);
  const [filterallUserDpa, setfilterAllUserDpa] = useState([]);
  const [allUserDpaDetails, setAllUserDpaDetails] = useState([]);
  const [filterAllUserDpaDetails, setfilterAllUserDpaDetails] = useState([]);
  const [searchDPaName, setsearchDpaName] = useState("");
  const [searchalluserName, setsearchalluserName] = useState("");
  const [userCount, setUserCount] = useState("");
  const [dpaCount, setDpaCount] = useState("");
  const [totaluserCount, settotalUserCount] = useState("");
  const [totaldpaCount, settotalDpaCount] = useState("");
  const [renewDate, setRenewDate] = useState({});
  const [trainedToken, setTrainedToken] = useState("");
  const [tokenLimit, setTokenLimit] = useState("");
  const [doc, setDoc] = useState([]);

  // handle TotalLimit
  const handleTotalLimit = async () => {
    const body = {
      client_id: clientId?.client_id,
      user_id: String(clientId?.user_id),
    };
    const res = await postData("get_user_assign_token_limit", body);
    setTokenLimit(res?.result?.user_assign_token_limit);
  };

  // handle trainedToken && documnet
  const handleDocument = async () => {
    const body = {
      client_id: clientId?.client_id,
    };
    const res = await postData("get_client_training_token_usage", body);
    setTrainedToken(res.result.training_token_usage);
    const res1 = await postData("get_client_uploaded_documents", body);
    setDoc(res1.result);
    const res3 = await postData("get_client_sub_renew_date", body);
    setRenewDate(res3.result?.sub_renew_date);
    const res4 = await postData("get_client_all_dpa_details", body);
    setAllUserDpaDetails(res4.result);
    const totalassignUser = await postData("get_client_assign_user", body);
    settotalUserCount(totalassignUser?.result?.users_count);
    const totalassignDpa = await postData("get_client_assign_dpa", body);
    settotalDpaCount(totalassignDpa?.result?.assign_dpa_count);
    const assignUser = await postData("get_client_created_users", body);
    setUserCount(assignUser?.result?.created_users_count);
    const assignDpa = await postData("get_client_created_dpa", body);
    setDpaCount(assignDpa?.result?.created_dpa_count);
    const allUsers = await postData("get_client_all_users", body);
    setAllUserDpa(allUsers?.result);
  };

  let data = [];
  let formate = allUserDpaDetails?.reduce((total, current) => {
    const { dpa_name } = current;
    total[dpa_name] = total[dpa_name] || [];
    total[dpa_name].push(current);
    return total;
  }, {});

  for (let key in formate) {
    let y = 0;
    let name = "";
    for (let elem of formate[key]) {
      y += Number(elem.token_usage);
      name = elem.dpa_name;
    }
    formate[key] = { name, y };
  }
  Object.values(formate).map((el) => data.push(el));

  const handleFilterUserDpaName = () => {
    const filterDpaName = allUserDpaDetails?.filter((el) => {
      const { dpa_name } = el;
      if (dpa_name.toLowerCase().includes(searchDPaName.toLowerCase())) {
        return el;
      }
    });
    setfilterAllUserDpaDetails(filterDpaName);
  };
  const handleFilterAllUserDpaName = () => {
    const filterAllDpaName = allUserDpa?.filter((el) => {
      const { name } = el;
      if (name?.toLowerCase().includes(searchalluserName?.toLowerCase())) {
        return el;
      }
    });
    setfilterAllUserDpa(filterAllDpaName);
  };
  useEffect(() => {
    handleTotalLimit();
    handleDocument();
  }, []);
  useEffect(() => {
    handleFilterUserDpaName();
    handleFilterAllUserDpaName();
  }, [searchDPaName, searchalluserName]);

  const filterDpaName = (item) => {
    setsearchDpaName(item);
    let a = allUserDpaDetails.filter((el) => {
      if (el?.dpa_name == item) {
        return el;
      }
    });
    setfilterAllUserDpaDetails(a);
  };
  let a = allUserDpa?.map((el) => el.usage_limit);
  let totalTokenLimit = a.reduce(
    (total, cur) => Number(total) + Number(cur),
    0
  );
  let b = allUserDpa?.map((el) => el.token_usage);
  let tokenUsage = b.reduce((total, cur) => Number(total) + Number(cur), 0);
  let c = allUserDpaDetails?.map((el) => el.dpa_usage);
  let AllDpa = c.reduce((total, cur) => Number(total) + Number(cur), 0);

  const columns = [
    {
      name: `Total Users : ${allUserDpa.length}`,
      selector: (row) => (
        <>
          <img
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
            src={row?.image ? row?.image : "assets/img/bg/Avatar.png"}
          />
          {row?.name.toLowerCase()}
        </>
      ),
      //  ${row.username}`,
    },
    {
      name: `TOTAL USAGE : ${CountConverter(tokenUsage)}(${
        tokenUsage > 0 ? `${(tokenUsage * 100) / totalTokenLimit}%` : "0"
      })`,
      selector: (row) => (
        <div>
          <Line
            percent={(row?.token_usage > 0 * 100) / row?.usage_limit > 0}
            strokeWidth={5}
            trailWidth={5}
            strokeColor={randomBackground()}
            strokeLinecap="square"
            style={{
              width: "100px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {`${row?.token_usage}%`}
        </div>
      ),
      center: true,
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    {
      selector: (row) => (
        
        <NavLink
          to="/user-usage-tracking"
          state={{
            item: row,
            dt: allUserDpaDetails,
            getRenewDate: RenewsDate(renewDate),
            tokenLimit: tokenLimit,
          }}
          style={{ fontSize: "26px", textDecoration: "none" }}
        >
          {/* <i style={{ color: "#1E1E1E" }} class="bi bi-eye"></i> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
              stroke="#7A7A7A"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="#7A7A7A"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </NavLink>
      ),
      right: true,
      style: {
        marginRight: "20px",
      },
    },
  ];

  useEffect(() => {
    addBlurClass();
  }, []);
  return (
    <>
      <div className="container-fluid h-100">
        <div className="row mainInner h-100">
          <div
            className="col-12 px-0 flex-fill h-100"
            data-page-name="categoriesPage"
          >
            <div className="container-fluid h-100">
              <div
                className={`row main h-100 menuIcon pointer ${
                  sideBar == "grid" ? "show" : ""
                }`}
              >
                <div className="col-auto px-0 leftPart h-100">
                  <div className="row sideBar h-100">
                    <Sidebar
                      sideBar={sideBar}
                      setSidebarOpen={setSidebarOpen}
                    />
                  </div>
                </div>
                <div className="col px-0 rightPart rightBgInnerPart h-100">
                  <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                    <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                      <div className="row h-100 mx-0">
                        <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0 trackingusing">
                          <div className="row mx-0 sticky-top stickyHeader">
                            <Header
                              setSidebarOpen={setSidebarOpen}
                              sideBar={sideBar}
                              textHeader={`Usage Tracking`}
                              textSubHeader={
                                "welcome carmen,you can view your DPA usage here."
                              }
                            />
                          </div>
                          <div className="row py-3">
                            <div className="col-12">
                              <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                <div className="col pageHeading px-0">
                                  Usage Tracking
                                </div>
                                <div className="col pageSubheading px-0">
                                  welcome carmen, you can find all information
                                  you require here.
                                </div>
                              </div>
                              <div className="row mx-0 my-3">
                                <div className="col-xxl-12  px-0">
                                
                                <div className="row mx-0 g-4 rightSection pe-2">
                                <div className="chart-info" style={{display:'flex', gap:'2%', maxHeight:'500px'}}>
                                <UsageDpaChart
                                      clientId={clientId?.client_id}
                                    />
                                    <div className="col-xxl-6 ps-xxl-0" style={{paddingTop:'1.5%' , paddingBottom:'1.5%'}}>
                                      <div className="row mx-0 h-100 mb-3 gy-3">
                                        <div className="col-md-4 px-md-2 px-0 h-md-100">
                                          <div className="row mx-0 dashboardCardDetail h-md-100 gap-md-3">
                                            <div className="col-sm-6 col-md-12 px-sm-0 mb-2 mb-sm-0">
                                              <div
                                                className="card border-0 dashboardCard d-flex align-items-center justify-content-center h-100"
                                                style={{
                                                  backgroundColor: "#4A5C77",
                                                }}
                                              >
                                                <div className="row">
                                                  <div className="col-12 d-flex justify-content-between">
                                                    <div className="dashboardNumber">
                                                      {userCount}
                                                    </div>
                                                    <div className="dashboardIcon">
                                                      <img
                                                        src="assets/img/svg/userIcon.svg"
                                                        alt
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-12 pe-0">
                                                    <div className="dashboardCardText">
                                                      of {totaluserCount} Users
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-12 px-md-0">
                                              <div
                                                className="card border-0 dashboardCard d-flex align-items-center justify-content-center h-100"
                                                style={{
                                                  backgroundColor: "#9BB7C2",
                                                }}
                                              >
                                                <div className="row">
                                                  <div className="col-12 d-flex justify-content-between">
                                                    <div className="dashboardNumber">
                                                      {dpaCount}
                                                    </div>
                                                    <div className="dashboardIcon">
                                                      <img
                                                        src="assets/img/svg/grid.svg"
                                                        alt
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="col-12 pe-0">
                                                    <div className="dashboardCardText">
                                                      of {totaldpaCount} DPAs
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-8 px-md-2 px-0 h-100">
                                          <div className="card border-0 rounded-4 h-100">
                                            <div className="card-body">
                                              <div className="row mx-0 h-100">
                                                <div className="col-auto">
                                                  <div className="imageHeading">
                                                    <span className="d-inline-flex imageicon me-2">
                                                      <img
                                                        className="w-100 h-100"
                                                        src="assets/img/svg/boxShape.svg"
                                                        alt="boxShape"
                                                      />
                                                    </span>
                                                    Trained Data
                                                  </div>
                                                </div>
                                                <NavLink
                                                  to="/dpa-overview"
                                                  className="col text-dec"
                                                >
                                                  <button className="btn border-0 managebtn ms-auto">
                                                    Manage{" "}
                                                    <span className="d-inline-flex">
                                                      <img
                                                        className="w-100 h-100"
                                                        src="assets/img/svg/right-arrow.svg"
                                                        alt
                                                      />
                                                    </span>
                                                  </button>
                                                </NavLink>
                                                <div className="col-12">
                                                  <div className="row px-0 align-items-center">
                                                    <div className="col-sm-auto col-12">
                                                      <div className="persentaheading">
                                                        {tokenLimit > 0
                                                          ? (
                                                              (trainedToken *
                                                                100) /
                                                              tokenLimit
                                                            ).toFixed(1)
                                                          : "0"}
                                                        %
                                                      </div>
                                                    </div>
                                                    <div className="col-sm col-12">
                                                      <Line
                                                        percent={
                                                          tokenLimit > 0
                                                            ? (trainedToken *
                                                                100) /
                                                              tokenLimit
                                                            : "0"
                                                        }
                                                        strokeWidth={2}
                                                        trailWidth={2}
                                                        strokeColor={"#9bb7c2"}
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-12 mt-0">
                                                  <div className="row px-0 align-items-center">
                                                    <div className="col-sm-auto col-12">
                                                      <div className="tokens">
                                                        Training Tokens Used
                                                      </div>
                                                    </div>
                                                    <div className="col-sm col-12">
                                                      <div className="kmmetter text-sm-end">
                                                        {CountConverter(
                                                          trainedToken
                                                        )}{" "}
                                                        <span>
                                                          out of{" "}
                                                          {CountConverter(
                                                            tokenLimit
                                                          )}
                                                        </span>{" "}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-12 bottomSection px-0">
                                                  <div className="row mx-0 justify-content-between">
                                                    <div className="col-sm-auto col-12">
                                                      <div className="heading text-sm-center">
                                                        Documents Trained
                                                      </div>
                                                      <div className="number text-start text-sm-center">
                                                        {doc?.length > 0
                                                          ? doc?.length
                                                          : "0"}
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-auto col-12 px-sm-0">
                                                      <div className="heading text-sm-center">
                                                        Total Tier Limit
                                                      </div>
                                                      <div className="number text-start text-sm-center">
                                                        {CountConverter(
                                                          tokenLimit
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-auto col-12">
                                                      <div className="heading text-sm-center">
                                                        Remaining
                                                      </div>
                                                      <div className="number text-start text-sm-center">
                                                        {CountConverter(
                                                          tokenLimit
                                                        )}
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
                                    
                                    <div className="col-xxl-6">
                                      <div className="card border-0 rounded-4 bottomcard p-3 me-2">
                                        <div className="row mx-0">
                                          <div className="col-12">
                                            <div className="text-xxl-center text-start dpetext me-2 mb-3">
                                              Usage by DPA
                                            </div>
                                          </div>
                                          <div className="col-sm-4">
                                            <HighchartsReact
                                              highcharts={Highcharts}
                                              options={getOptionsDashboardCirculer(
                                                "pie",
                                                false,
                                                data,
                                                "center"
                                              )}
                                            />
                                          </div>
                                          <div className="col-sm-8">
                                            <div className="row mx-0">
                                              <div className="col-12 px-0">
                                                <div className="heading">
                                                  All DPAs
                                                </div>
                                              </div>
                                              <div className="col-12 px-0 subheading">
                                                Data represented here renews{" "}
                                                <strong> every month</strong>
                                              </div>
                                              <div className="col-12 px-0">
                                                <div className="row px-0 d-flex align-items-center">
                                                  <div className="col-auto">
                                                    <div className="persentaheading colortext">
                                                      {AllDpa > 0
                                                        ? (AllDpa * 100) /
                                                          tokenLimit
                                                        : "0"}
                                                      %
                                                    </div>
                                                  </div>
                                                  <div className="col">
                                                    <Line
                                                      percent={
                                                        AllDpa > 0
                                                          ? (AllDpa * 100) /
                                                            tokenLimit
                                                          : "0"
                                                      }
                                                      strokeWidth={2}
                                                      trailWidth={2}
                                                      strokeColor={"#9bb7c2"}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="row px-0 align-items-center">
                                                <div className="col-sm-auto col-12">
                                                  <div className="tokens colortext">
                                                    Usage renews{" "}
                                                    <strong>
                                                      {RenewsDate(renewDate)}
                                                    </strong>
                                                  </div>
                                                </div>
                                                <div className="col-sm col-12">
                                                  <div className="kmmetter text-sm-end">
                                                    {CountConverter(AllDpa)}{" "}
                                                    <span>
                                                      out of{" "}
                                                      {CountConverter(
                                                        tokenLimit
                                                      )}
                                                    </span>{" "}
                                                  </div>
                                                </div>
                                                <div className="col-12 kmmetter colortext">
                                                  <strong>
                                                    {CountConverter(
                                                      AllDpa - tokenLimit
                                                    )}
                                                  </strong>{" "}
                                                  remaining
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row mx-0 align-items-center justify-content-between topForm g-4 mt-2">
                                          <div className="col-md-auto inputcol px-0">
                                            <div className="position-relative">
                                              <input
                                                type="text"
                                                onChange={(e) =>
                                                  setsearchDpaName(
                                                    e.target.value
                                                  )
                                                }
                                                className="form-control border-0"
                                                id="exampleFormControlInput1"
                                                placeholder="Search DPA"
                                              />
                                              <span className="d-inline-flex position-absolute top-0 end-0 me-3 mt-2 pt-1">
                                                <img
                                                  className="w-100 h-100"
                                                  src="assets/img/svg/search.svg"
                                                  alt="search"
                                                />
                                              </span>
                                            </div>
                                          </div>
                                          <div className="col-md-auto Selectcol px-0">
                                            <div className="usageSlect">
                                              <select
                                                onChange={(e) =>
                                                  filterDpaName(e.target.value)
                                                }
                                                className="form-select shadow-none"
                                                aria-label="Default select example"
                                              >
                                                <option
                                                  className="slected"
                                                  selected
                                                  value={""}
                                                  onClick={() =>
                                                    setfilterAllUserDpaDetails(
                                                      ""
                                                    )
                                                  }
                                                >
                                                  Highest Usage
                                                </option>
                                                {data?.map((el) => {
                                                  return (
                                                    <option
                                                      value={el?.name.toLowerCase()}
                                                    >
                                                      {el?.name}
                                                    </option>
                                                  );
                                                })}
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row mx-0">
                                        <div
                                          className="col-12 px-0"
                                          style={{
                                            backgroundColor: "#f6f8fa",
                                            borderRadius: "20px",
                                            maxWidth: "100%",
                                            height: "557px",
                                            overflow: "auto",
                                          }}
                                        >
                                          <div className="card shadow-none border-0 p-3 dpaSection topDapSection mb-4 bg-transparent">
                                            <div className="row mx-0 align-items-center">
                                              <div className="col-12 px-0">
                                                <div className="row mx-0 align-items-center">
                                                  {searchDPaName
                                                    ? filterAllUserDpaDetails.map(
                                                        (el) => {
                                                          return (
                                                            <div
                                                              className="col-xl-12 px-0 leftSide"
                                                              key={el?.id}
                                                            >
                                                              <div className="workPlace commonWork row mx-0 align-items-center mb-3">
                                                                <div className="col-auto">
                                                                  <div
                                                                    className={`workColor rounded-circle`}
                                                                    style={{
                                                                      backgroundColor: `${el.dpa_color}`,
                                                                    }}
                                                                  />
                                                                </div>
                                                                <div className="col px-0">
                                                                  <div className="row mx-0 align-items-center">
                                                                    <div className="col">
                                                                      <div className="workHeading fw-medium">
                                                                        {
                                                                          el.dpa_name
                                                                        }
                                                                      </div>
                                                                      <div className="workToken fw-normal">
                                                                        Total
                                                                        Token
                                                                        Used:{" "}
                                                                        <span className="fw-semibold">
                                                                          {CountConverter(
                                                                            el?.dpa_usage
                                                                            
                                                                          )}
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                    <NavLink
                                                                      to="/usage-tracking-dpa"
                                                                      className="col-auto text-dec"
                                                                      state={{
                                                                        item: el,
                                                                        getRenewDate:
                                                                          RenewsDate(
                                                                            renewDate
                                                                          ),
                                                                        tokenLimit:
                                                                          tokenLimit,
                                                                        trainedToken:
                                                                          trainedToken,
                                                                        dt: allUserDpa,
                                                                      }}
                                                                    >
                                                                      <button
                                                                        type="button"
                                                                        style={{
                                                                          backgroundColor:
                                                                            el.dpa_color,
                                                                        }}
                                                                        className="btn rounded-pill text-white d-flex align-items-center gap-2"
                                                                      >
                                                                        Track
                                                                        this DPA{" "}
                                                                        <span className="d-inline-flex">
                                                                          <img
                                                                            src="assets/img/svg/030-right-arrow.svg"
                                                                            className="h-100"
                                                                            alt
                                                                          />
                                                                        </span>
                                                                      </button>
                                                                    </NavLink>
                                                                    <div className="col-12 progressGroup mt-2">
                                                                      <Line
                                                                        percent={
                                                                          (el.token_usage >
                                                                            0 *
                                                                              100) /
                                                                            AllDpa >
                                                                          0
                                                                        }
                                                                        strokeWidth={
                                                                          1
                                                                        }
                                                                        trailWidth={
                                                                          1
                                                                        }
                                                                        strokeColor={
                                                                          el.dpa_color
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )
                                                    : allUserDpaDetails.map(
                                                        (el) => {
                                                          return (
                                                            <div
                                                              className="col-xl-12 px-0 leftSide"
                                                              key={el.id}
                                                            >
                                                              <div className="workPlace commonWork row mx-0 align-items-center mb-3">
                                                                <div className="col-auto">
                                                                  <div
                                                                    className={`workColor rounded-circle`}
                                                                    style={{
                                                                      backgroundColor: `${el.dpa_color}`,
                                                                    }}
                                                                  />
                                                                </div>
                                                                <div className="col px-0">
                                                                  <div className="row mx-0 align-items-center">
                                                                    <div className="col">
                                                                      <div className="workHeading fw-medium">
                                                                        {
                                                                          el.dpa_name
                                                                        }
                                                                      </div>
                                                                      <div className="workToken fw-normal">
                                                                        Total
                                                                        Token
                                                                        Used:{" "}
                                                                        <span className="fw-semibold">
                                                                          {CountConverter(
                                                                            el.token_usage
                                                                          )}
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                    <NavLink
                                                                      to="/usage-tracking-dpa"
                                                                      className="col-auto text-dec "
                                                                      state={{
                                                                        item: el,
                                                                        getRenewDate:
                                                                          RenewsDate(
                                                                            renewDate
                                                                          ),
                                                                        tokenLimit:
                                                                          tokenLimit,
                                                                        trainedToken:
                                                                          trainedToken,
                                                                        dt: allUserDpa,
                                                                      }}
                                                                    >
                                                                      <button
                                                                        type="button"
                                                                        style={{
                                                                          backgroundColor:
                                                                            el.dpa_color,
                                                                        }}
                                                                        className="btn rounded-pill text-white d-flex align-items-center gap-2"
                                                                      >
                                                                        Track
                                                                        this DPA{" "}
                                                                        <span className="d-inline-flex">
                                                                          <img
                                                                            src="assets/img/svg/030-right-arrow.svg"
                                                                            className="h-100"
                                                                            alt
                                                                          />
                                                                        </span>
                                                                      </button>
                                                                    </NavLink>
                                                                    <div className="col-12 progressGroup mt-2">
                                                                      <Line
                                                                        percent={
                                                                          (el.token_usage >
                                                                            0 *
                                                                              100) /
                                                                            AllDpa >
                                                                          0
                                                                        }
                                                                        strokeWidth={
                                                                          1
                                                                        }
                                                                        trailWidth={
                                                                          1
                                                                        }
                                                                        strokeColor={
                                                                          el.dpa_color
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xxl-6">
                                      <div className="card shadow-none border-0 p-3 dpaSection topDapSection  mb-4 usedByUser h100">
                                        <div className="row mx-0 align-items-center">
                                          <div className="col-12 dpaUsesHeading fw-semibold mb-4 text-sm-center text-start">
                                            Usage by Users
                                          </div>
                                          <div className="col-12 px-0">
                                            <div className="row mx-0 align-items-center justify-content-between topForm g-4 ">
                                              <div className="col-md-auto inputcol px-0">
                                                <div className="position-relative">
                                                  <input
                                                    type="text"
                                                    onChange={(e) =>
                                                      setsearchalluserName(
                                                        e.target.value
                                                      )
                                                    }
                                                    className="form-control border-0"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Search User"
                                                  />
                                                  <span className="d-inline-flex position-absolute top-0 end-0 me-3 mt-2 pt-2">
                                                    <img
                                                      className="w-100 h-100"
                                                      src="assets/img/svg/search.svg"
                                                      alt="search"
                                                    />
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="col-md-auto Selectcol px-0">
                                                <div className="usageSlect">
                                                  <select
                                                    className="form-select shadow-none"
                                                    aria-label="Default select example"
                                                  >
                                                    <option
                                                      className="slected"
                                                      selected
                                                    >
                                                      All DPA
                                                    </option>
                                                    <option value={1}>
                                                      One
                                                    </option>
                                                    <option value={2}>
                                                      Two
                                                    </option>
                                                    <option value={3}>
                                                      Three
                                                    </option>
                                                  </select>
                                                </div>
                                              </div>
                                              <div className="col-12 px-0">
                                                <div className="imagetable w-100">
                                                  <DataTable
                                                    title={
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          lineHeight: "50px",
                                                          paddingRight: "10px",
                                                          paddingLeft: "10px",
                                                          fontSize: "15px",
                                                          backgroundColor:
                                                            "#f6f8f9",
                                                          borderRadius:
                                                            "1.5em 1.5em 0 0",
                                                          alignItems: "center",
                                                          textAlign: "center",
                                                          justifyContent:
                                                            "space-between",
                                                        }}
                                                      >
                                                        <p>User</p>
                                                        <p>DPA Usage</p>
                                                        <p>Action</p>
                                                      </div>
                                                    }
                                                    columns={columns}
                                                    data={
                                                      searchalluserName
                                                        ? filterallUserDpa
                                                        : allUserDpa
                                                    }
                                                    // customStyles={customStyles}
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
    </>
  );
};

export default UsageTrackingOverview;
