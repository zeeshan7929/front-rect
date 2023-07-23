import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import DataTable from "react-data-table-component";
import { Line } from "rc-progress";
import { NavLink, useLocation } from "react-router-dom";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { randomBackground } from "../../Common/Others/RandonColor";
import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { getOptionsDashboardCirculer } from "../../Common/Others/ChartOptions";
import { postData } from "../../Common/fetchservices";
import UsageDpaChart from "../../Common/Charts/UsageDpaChart";
import { CountConverter } from "../../Common/Others/CountConverter";

const UserUsageTracking = ({ sideBar, setSidebarOpen }) => {
  let ids = JSON.parse(localStorage.getItem("a_login"));  
  const location = useLocation();
  let item = location?.state?.item;
  
  // let dt = location?.state?.dt;
  
  
  let renewDate = location?.state?.getRenewDate;
  
  const [filterdpa, setFilterDpa] = useState([]);
  const [search, setsearch] = useState("");
  const [dt,setDT] = useState([])

  const handleItems = async() =>{
    const bod = {
      client_id: item?.client_id,
      user_id: String(item?.id)
    }
    const res = await postData("u_get_user_all_assign_dpa", bod);
    console.log(res)
    setDT(res?.result);
  }

  const filterAllUsers = () => {
    const fill = dt?.filter((el) => {
      const { dpa_name } = el;
      if (dpa_name?.toLowerCase().includes(search?.toLowerCase())) {
        return el;
      }
    });
    setFilterDpa(fill);
  };
  function Round(num, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
}

  let data = [];
  let formate = dt?.reduce((total, current) => {
    const { dpa_name } = current;
    total[dpa_name] = total[dpa_name] || [];
    total[dpa_name].push(current);
    return total;
  }, {});

  for (let key in formate) {
    let y = 0;
    let name = "";
    let color = "";
    for (let elem of formate[key]) {
      y += Number(elem.dpa_usage);
      name = elem.dpa_name;
      color = elem.dpa_color;
    }
    formate[key] = { name, y, color };
  }

  Object.values(formate || "").map((el) => data.push(el));
  console.log(data)
  let a = data?.map((el) => el.y);
  let totalTokens = a.reduce((x, y) => Number(x) + Number(y), 0);
  useEffect(() => {
    handleItems();
    addBlurClass();
    filterAllUsers();
  }, [search]);
  // console.log("Item : ")
  const dt_len = dt.length;
  const columns = [
    {
      name: "DPA",
      selector: (row) => (
        <>
          <div className="col-auto d-flex alignItems-center justify-content-between">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px",
                width: "34px",
                height: "34px",
                border: "none",
                borderRadius: "50%",
                backgroundColor: row?.dpa_color ? row?.dpa_color : "#FFBB78",
                marginRight: "1rem",
              }}
            />
            <div
              className="hWorkplace"
              style={{
                fontSize: "16px",
                marginTop: "5px",
                width: "165px",
                height: "25px",
              }}
            >
              {row?.dpa_name ? row?.dpa_name : "name"}
            </div>
          </div>
        </>
      ),
      style: {
        marginLeft: "10px",
      },
    },
    {
      name: "USAGE",
      selector: (row) => (
        <div>
          <Line
            percent={(Round((Number(row?.dpa_usage) / Number(item?.usage_limit)) * 100,1)) }
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
          {`${(Round((Number(row?.dpa_usage) / Number(item?.usage_limit)) * 100,1))}%`}
        </div>
      ),
      center: true,
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <NavLink
            to="/usage-tracking-dpa"
            state={{ item: row }}
            style={{
              fontSize: "26px",
              textDecoration: "none",
              marginRight: "12px",
            }}
          >
            <i style={{ color: "#1E1E1E" }} class="bi bi-eye"></i>
          </NavLink>
          <i
            style={{ fontSize: "26px", textDecoration: "none" }}
            class="bi bi-gear"
          ></i>
        </div>
      ),
      right: true,
      style: {
        marginRight: "20px",
      },
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "65px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#f6f8f9 ",
        "&:last-child": {
          borderRadius: "0 1.5em 0 0",
        },
        "&:first-child": {
          borderRadius: "1.5em 0 0 0",
        },
        paddingLeft: "16px", // override the cell padding for head cells
        paddingRight: "42px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

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
                        <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0 overtracking">
                          <div className="row mx-0 sticky-top stickyHeader">
                            <Header
                              setSidebarOpen={setSidebarOpen}
                              sideBar={sideBar}
                              textHeader={`User Usage Tracking`}
                              textSubHeader={
                                "welcome carmen, you can find all information you require here."
                              }
                            />
                          </div>
                          <div className="row mx-0 g-3 py-3">
                            <div className="col-12 mb-3 mb-md-0">
                              <button
                                className="border-0 backbtn px-4"
                                onClick={() => window.history.back()}
                              >
                                <span className="d-inline-flex">
                                  <img
                                    className="w-100 h-100"
                                    src="assets/img/svg/leftarrow.svg"
                                    alt="leftarrow"
                                  />
                                </span>
                                Back{" "}
                              </button>
                            </div>
                            <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                              <div className="col pageHeading px-0">
                                User Usage Tracking
                              </div>
                              <div className="col pageSubheading px-0">
                                welcome carmen, you can find all information you
                                require here.
                              </div>
                            </div>
                            <div className="col-xxl-8">
                              <div className="card border-0 usercard rounded-4 p-3 mb-3">
                                <div className="row mx-0">
                                  <div className="col-auto">
                                    <div className="imageuser">
                                      <img
                                        className="w-100 h-100"
                                        src={
                                          item?.image
                                            ? item?.image
                                            : "assets/img/bg/Avatar.png"
                                        }
                                        alt="Avatar"
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div className="username">{item?.name}</div>
                                    <div className="admin">{item?.role}</div>
                                    <div className="mail">{item?.email}</div>
                                  </div>
                                  <NavLink
                                    to="/user-management"
                                    className="col-12 d-flex justify-content-end text-dec"
                                    state={{ item: item }}
                                  >
                                    <button className="btn border-0 backbtn2 ">
                                      <span className="d-inline-flex">
                                        <img
                                          className="w-100 h-100"
                                          src="assets/img/svg/settings.svg"
                                          alt="settings"
                                        />
                                      </span>
                                      User Management
                                    </button>
                                  </NavLink>
                                </div>
                              </div>
                              <div className="card border-0 rounded-4 p-3 dPAUsagecard mb-3">
                                <div className="row mx-0">
                                  <div className="col-12 text-sm-center text-strat">
                                    <div className="heading d-flex align-items-center justify-content-center justify-content-sm-center gap-1">
                                      <span className="d-inline-flex">
                                        <img
                                          className="w-100 h-100"
                                          src="assets/img/svg/message.svg"
                                          alt="message"
                                        />
                                      </span>
                                      DPA Usage
                                    </div>
                                  </div>
                                  <div className="col-12 d-flex align-items-center justify-content-between">
                                    <div className="persantage">
                                      {`${
                                        item?.token_usage > 0
                                          ? Round((item?.token_usage * 100) /
                                          item?.usage_limit,1)
                                          : "0"
                                      }%`}
                                    </div>
                                    <div className="persantage">
                                      {item?.token_usage > 1000
                                        ? `${Round(item?.token_usage / 1000,2)}k`
                                        : item?.token_usage}{" "}
                                      Tokens
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <Line
                                      percent={`${
                                        item?.token_usage > 0
                                          ? Round((item?.token_usage * 100) /
                                          item?.usage_limit,1)
                                          : "0"
                                      }%`}
                                      strokeWidth={1}
                                      trailWidth={1}
                                      strokeColor="#4a5c77"
                                    />
                                  </div>
                                  <div className="col-12 d-flex align-items-center justify-content-between">
                                    <div className="progresbarbottomtext">
                                      Usage renews <strong>{renewDate}</strong>{" "}
                                    </div>
                                    <div className="progresbarbottomtext">
                                      {item?.token_usage > 1000
                                        ? `${Round(item?.token_usage / 1000,2)}k`
                                        : item?.token_usage}{" "}
                                      out of{" "}
                                      {item?.usage_limit > 1000
                                        ? `${item?.usage_limit / 1000}k`
                                        : item?.usage_limit}
                                    </div>
                                  </div>
                                  <NavLink
                                    to="/user-management"
                                    className="col-12 mt-2 text-dec"
                                    state={{ item: item }}
                                  >
                                    <button className="btn border-0 lemet px-4 d-flex align-items-center py-1 mx-auto">
                                      <span className="d-inline-flex">
                                        <img
                                          className="w-100 h-100"
                                          src="assets/img/svg/edit.svg"
                                          alt="edit"
                                        />
                                      </span>
                                      {CountConverter(item?.usage_limit)} User Limit{" "}
                                    </button>
                                  </NavLink>
                                </div>
                              </div>
                              <div className="row mx-0 mb-2">
                                <div className="col-md col-12 d-flex align-items-center justify-content-between justify-content-md-start gap-2 mb-0">
                                  <div className="textassign">
                                    Assigned DPAs ({dt_len})
                                  </div>
                                  {/* <button className="border-0 assignbtn d-flex align-items-center gap-2">
                                    <span className="d-inline-flex">
                                      <img
                                        className="w-100 h-100"
                                        src="assets/img/svg/plussvg.svg"
                                        alt="plus"
                                      />
                                    </span>
                                    Assign DPA
                                  </button> */}
                                </div>
                                <div className="col-md-auto mt-3 mt-sm-0">
                                  <div className="position-relative">
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        setsearch(e.target.value)
                                      }
                                      className="form-control border-0 shadow-none rounded-4"
                                      placeholder="Search DPA"
                                    />
                                    <span className="d-inline-flex position-absolute top-0 end-0 me-3 mt-1 pt-1">
                                      <img
                                        className="w-100 h-100"
                                        src="assets/img/svg/search.svg"
                                        alt="search"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 mb-3">
                                <div
                                  className="imagetable"
                                  style={{
                                    fontSize: "15px",
                                    backgroundColor: "#f6f8f9",
                                    borderRadius: "1.5em",
                                  }}
                                >
                                  <DataTable
                                    columns={columns}
                                    data={search ? filterdpa : dt}
                                    customStyles={customStyles}
                                  />
                                </div>
                              </div>
                              <div className="col-xxl-12 px-0">
                                <UsageDpaChart clientId={ids?.client_id} userId={ids?.user_id} />
                              </div>
                            </div>
                            <div className="col-xxl-4">
                              <div className="card leftcard border-0 rounded-4">
                                <div className="heading text-center pt-2">
                                  Usage Distribution
                                </div>
                                <div className="leftimage">
                                  <HighchartsReact
                                    highcharts={Highcharts}
                                    options={getOptionsDashboardCirculer(
                                      "pie",
                                      false,
                                      data,
                                      "center",
                                      totalTokens
                                    )}
                                  />
                                  {data?.map((el) => {
                                    let token = +el.y;
                                    return (
                                      <div className="col px-0 d-flex  alignItems-center mt-5 mb-5 ms-5">
                                        <div
                                          className="circle"
                                          style={{
                                            width: "34px",
                                            height: "34px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: el.color,
                                          }}
                                        />
                                        <div className="w-75 d-flex alignItems-center justify-content-between">
                                          <div
                                            className="hWorkplace"
                                            style={{
                                              color: "#1E1E1E",
                                              fontSize: "26px",
                                            }}
                                          >
                                            {el.name}
                                          </div>
                                          <div
                                            className="hWorkplace"
                                            style={{
                                              fontSize: "26px",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {el.y > 1000 ? `${el.y}k` : el.y}{" "}
                                            
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserUsageTracking;
