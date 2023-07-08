import React, { useEffect, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import DataTable from "react-data-table-component";
import { randomBackground } from "../../clientDashboard/Common/Others/RandonColor";
import { Line } from "rc-progress";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { HighchartsReact } from "highcharts-react-official";
import { getOptionsDashboardCirculer } from "../../clientDashboard/Common/Others/ChartOptions";
import Highcharts from "highcharts";
import Header from "../Common/Header/Header";
import { RenewsDate } from "../../clientDashboard/Common/Others/RenewsDate";
import { CountConverter } from "../../clientDashboard/Common/Others/CountConverter";

function TrackMyUsage({ sideBar, setSidebarOpen }) {
  const ids = JSON.parse(localStorage.getItem("a_login"));
  const [userDpa, setUserDpa] = useState([]);
  const [filterUserDpa, setFilterUserDpa] = useState([]);
  const [dpastats, setDpaStats] = useState();
  const [search, setsearch] = useState("");

  let data = [];
  const groupedDpa = userDpa?.reduce((total, cur) => {
    const { name } = cur;
    total[name] = total[name] || [];
    total[name].push(cur);
    return total;
  }, {});
  for (let key in groupedDpa) {
    let y = 0;
    let name = "";
    for (let value of groupedDpa[key]) {
      y += Number(value.dpa_usage);
      name = value.name;

      groupedDpa[key] = { name, y };
    }
  }
  Object.values(groupedDpa || {}).map((el) => data.push(el));

  const handleUserDpa = async () => {
    const body = {
      client_id: ids?.client_id,
      user_id: String(ids?.user_id),
    };
    const res = await postData("u_get_user_all_assign_dpa", body);
    setUserDpa(res?.result);
  };

  const handleUserStats = async () => {
    const body = {
      user_id: String(ids?.user_id),
      client_id: ids?.client_id,
    };
    const dpaStats = await postData("u_get_dpa_usage_stats", body);
    setDpaStats(dpaStats.result);
  };

  const handleFilterUserDpa = () => {
    let fill = userDpa?.filter((el) => {
      const { name } = el;
      if (name.toLowerCase().includes(search.toLowerCase())) {
        return el;
      }
    });
    setFilterUserDpa(fill);
  };

  useEffect(() => {
    handleUserStats();
    handleUserDpa();
    handleFilterUserDpa();
  }, [search]);
  let a = userDpa?.map((el) => el.dpa_usage);
  const totalUsage = a?.reduce((x, y) => Number(x) + Number(y), 0);

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
              {row?.name ? row?.name : "name"}
            </div>
          </div>
        </>
      ),
      left: "true",
      style: {
        marginLeft: "16px",
      },
    },

    {
      name: "USAGE",
      cell: (row) => (
        <div>
          <Line
            percent={Number(row?.dpa_usage * 100) / totalUsage > 0}
            strokeWidth={5}
            trailWidth={5}
            strokeLinecap="square"
            strokeColor={randomBackground()}
            style={{
              width: "86.26px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;&nbsp;
          {CountConverter(row?.dpa_usage)} Tokens
        </div>
      ),
      center: "true",
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
        paddingLeft: "32px", // override the cell padding for head cells
        paddingRight: "16px",
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
                  <Header
                    title={"Track My Usage"}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <div className="col-12 mainPart flex-fill overflow-hidden-auto carmenDashboard">
                    <div className="row mx-0">
                      <div className="col-12">
                        <div className="trackPageTopBar">
                          <div className="row">
                            <div className="col-12">
                              <div className="trackPageTopBarHeadTxt d-flex align-items-center">
                                <img
                                  className="me-1"
                                  src="./../assets/img/svg/message.svg"
                                  alt=""
                                />
                                DPA Usage
                              </div>
                            </div>
                            <div className="col-12 d-flex justify-content-between">
                              <div className="trackPageTopBarPercent">
                                {Number(dpastats?.user_dpa_used) > 0
                                  ? Number(dpastats?.user_dpa_used * 100) /
                                      Number(dpastats?.user_dpa_assign_limit) >
                                    0
                                  : "0"}
                                {""}%
                              </div>
                              <div className="trackPageTopBarPercent">
                                {CountConverter(dpastats?.user_dpa_used)}
                                Tokens
                              </div>
                            </div>
                            <div className="col-12 mt-2">
                              <div className="trackPageTopProgressBar">
                                <Line
                                  percent={
                                    dpastats?.user_dpa_used > 0
                                      ? (dpastats?.user_dpa_used * 100) /
                                        dpastats?.user_dpa_assign_limit
                                      : "0"
                                  }
                                  strokeWidth={1}
                                  trailWidth={1}
                                  strokeColor={"#4a5c77"}
                                />
                              </div>
                            </div>
                            <div className="col-12 d-flex justify-content-between mt-2 mb-1">
                              <div className="trackPageTopBarBottomTxt">
                                DPA Usage renews{" "}
                                <strong>
                                  {RenewsDate(
                                    dpastats?.dpa_usage_renewal_days_remaining >
                                      0
                                  )}
                                </strong>
                              </div>
                              <div className="trackPageTopBarBottomTxt1">
                                <span>
                                  {CountConverter(dpastats?.user_dpa_used)}
                                </span>{" "}
                                out of{" "}
                                {CountConverter(
                                  dpastats?.user_dpa_assign_limit
                                )}
                              </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end">
                              <span className="limitSpan">User Limit Set</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mx-0 marginClass">
                      <div className="col-lg-8 col-12">
                        <div className="row">
                          <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="trackTableHead">
                              Assigned DPAs (
                              {search
                                ? filterUserDpa?.length
                                : userDpa?.length
                                ? userDpa?.length
                                : "0"}
                              )
                            </div>
                            <div className="trackTableHeadSearch position-relative">
                              <input
                                type="text"
                                className="form control shadow-none trackInp"
                                onChange={(e) => setsearch(e.target.value)}
                                placeholder="Search DPA"
                              />
                              <div className="inpSearch">
                                <img
                                  src="./../assets/img/svg/search.svg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 py-4">
                            <div
                              className="trackTable"
                              style={{
                                fontSize: "15px",
                                backgroundColor: "#f6f8f9",
                                borderRadius: "1.5em",
                              }}
                            >
                              <DataTable
                                columns={columns}
                                data={search ? filterUserDpa : userDpa}
                                customStyles={customStyles}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-12 pb-4">
                        <div className="trackgraph">
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
                                  totalUsage
                                )}
                              />
                              {data?.map((el) => {
                                let token = +el.y;
                                return (
                                  <div
                                    key={Math.random()}
                                    className="col px-0 d-flex  alignItems-center justify-content-between m-3 "
                                  >
                                    <div className="w-50 d-flex alignItems-center justify-content-start">
                                      <div
                                        className="circle"
                                        style={{
                                          width: "14.33px",
                                          height: "14.33px",
                                          borderRadius: "50%",
                                          border: "none",
                                          backgroundColor: el.color,
                                          marginTop: "3px",
                                          marginRight: "0.5rem",
                                        }}
                                      />
                                      <div
                                        className="hWorkplace"
                                        style={{
                                          color: "#1E1E1E",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {el.name}
                                      </div>
                                    </div>
                                    <div
                                      className="hWorkplace"
                                      style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {CountConverter(el.y)} Tokens(
                                      {token > 0
                                        ? `${(token * 100) / totalUsage}`
                                        : "0"}
                                      )
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
    </main>
  );
}

export default TrackMyUsage;
