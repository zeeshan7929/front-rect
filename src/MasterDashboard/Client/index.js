import React, { useEffect, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import DataTable from "react-data-table-component";
import { Line } from "rc-progress";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { randomBackground } from "../../clientDashboard/Common/Others/RandonColor";
import { RenewsDate } from "../../clientDashboard/Common/Others/RenewsDate";
import { Header } from "../Common/Header/Header";
import { Export } from "../Payment History/export";
function Client({ sideBar, setSidebarOpen }) {
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState([]);
  const [clientInfoFilter, setClientInfoFilter] = useState([]);
  const [clientCount, setClientCount] = useState();
  const [tierInfo, setTierInfo] = useState({});
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");

  const handleClientInfo = async () => {
    const clientI = await postData("m_get_all_clients_info");
    setClientInfo(clientI?.result);
    const clientC = await postData("m_clients_count");
    setClientCount(clientC?.result);
    let fill = clientI?.result?.filter((el) => {
      if (el.tier_name == "Premium") {
        return el;
      }
    });
    let fillLite = clientI?.result?.filter((el) => {
      if (el.tier_name == "Lite Plan") {
        return el;
      }
    });
    let fillSta = clientI?.result?.filter((el) => {
      if (el.tier_name == "Standard") {
        return el;
      }
    });

    setTierInfo({ lite: fillLite, premium: fill, standard: fillSta });
  };

  const handleClientInfoFilter = () => {
    let fill = clientInfo?.filter((el) => {
      const { name } = el;
      if (name.toLowerCase().includes(search.toLowerCase())) {
        return el;
      }
    });
    setClientInfoFilter(fill);
  };

  const handleTierFilter = (val) => {
    setTier(val);
    let fill = clientInfo.filter((el) => {
      return el.plan_type == val;
    });
    setClientInfoFilter(fill);
  };
  useEffect(() => {
    handleClientInfoFilter();
  }, [search]);

  useEffect(() => {
    handleClientInfo();
  }, []);

  const columns = [
    {
      name: "Company",
      selector: (row) => <div style={{ width: "150px" }}>{row?.name}</div>,
      left: "true",
      style: {
        marginLeft: "16px",
      },
    },
    {
      name: "Tier",
      selector: (row) => (
        <div
          style={{
            backgroundColor:
              (row?.tier_name == "Standard" && row?.plan_type == "yearly") ||
              row?.plan_type == "monthly"
                ? "#faf5ec"
                : (row?.tier_name == "Lite Plan" &&
                    row?.plan_type == "yearly") ||
                  row?.plan_type == "monthly"
                ? "#daecec"
                : (row?.tier_name == "Premium" && row?.plan_type == "yearly") ||
                  row?.plan_type == "monthly"
                ? "#f6e8ea"
                : "#a5b3c9",
            width: "90px",
            height: "40px",
            borderRadius: "50px",
            textAlign: "center",
            padding: "3px",
            fontSize: "10px",
          }}
        >
          {row?.tier_name}
          <br />
          {row?.plan_type}
        </div>
      ),
      center: "true",
    },
    {
      name: "Database Usage",
      cell: (row) => (
        <div style={{ width: "125px" }}>
          <Line
            percent={
              Number(row?.database_usage * 100) /
              Number(row?.database_assign_limit)
            }
            strokeWidth={5}
            trailWidth={5}
            strokeLinecap="square"
            strokeColor={randomBackground()}
            style={{
              width: "86.26px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;
          {Math.floor(
            Number(row?.database_usage * 100) /
              Number(row?.database_assign_limit)
          )}
          %
        </div>
      ),
      left: "true",
    },
    {
      name: "DPA Usage (monthly)",
      cell: (row) => (
        <div style={{ width: "125px" }}>
          <Line
            percent={
              Number(row?.dpa_usage * 100) / Number(row?.dpa_assign_limit)
            }
            strokeWidth={5}
            trailWidth={5}
            strokeLinecap="square"
            strokeColor={randomBackground()}
            style={{
              width: "86.26px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;
          {Math.floor(
            Number(row?.dpa_usage * 100) / Number(row?.dpa_assign_limit)
          )}
          %
        </div>
      ),
      right: "true",
    },
    {
      name: "Renewal",
      selector: (row) => RenewsDate(row.renewal),
      center: "true",
    },
    {
      name: "Edit",
      selector: (row) => (
        <div className="">
          <CiEdit
            style={{ fontSize: "18px", cursor: "pointer" }}
            onClick={() => {
              navigate("/edit", { state: { item: row?.client_id } });
            }}
          />
        </div>
      ),
      center: "true",
      style: {
        marginRight: "10px",
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
      <div className="row mainInner h-100">
        <div
          className="col-12 px-0 flex-fill h-100"
          data-page-name="categoriesPage"
        >
          <div className="container-fluid h-100">
            <div
              className={`row main h-100 menuIcon masterDashboard ${
                sideBar == "mgrid" ? "show" : ""
              }`}
            >
              <div className="col-auto px-0 leftPart h-100">
                <div className="row sideBar h-100">
                  <Sidebar setSidebarOpen={setSidebarOpen} />
                </div>
              </div>
              <div className="col rightBgPart px-0 h-100">
                <div className="row mx-0 h-100 justify-content-center">
                  <div className="col px-0 rightPart singleRightPart h-100">
                    <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                      <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                        <div className="row h-100 mx-0">
                          <div className="col-12 h-100 px-0 scrollPart d-flex flex-column">
                            <div className="row mx-0 sticky-top stickyHeader">
                              <Header
                                title={"Clients"}
                                setSidebarOpen={setSidebarOpen}
                              />
                            </div>
                            <div className="row mx-0 justify-content-center h-100 flex-fill overflow-hidden">
                              <div className="col-12 h-100">
                                <div className="row py-3 overflow-hidden-auto h-100 mx-0">
                                  <div className="col-12 px-0">
                                    <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                      <div className="col pageHeading px-0">
                                        Clients
                                      </div>
                                    </div>
                                    <div className="row dashboardCardDetail g-3">
                                      <div className="col-xxl-9 col-12">
                                        <div className="row g-3 g-sm-3">
                                          <div className="col-md-3 col-sm-6">
                                            <div
                                              className="dashboardCard"
                                              style={{
                                                backgroundColor: "#4A5C77",
                                              }}
                                            >
                                              <div className="row">
                                                <div className="col-12 d-flex justify-content-between">
                                                  <div className="dashboardNumber">
                                                    {clientCount}
                                                  </div>
                                                </div>
                                                <div className="col-12 pe-0">
                                                  <div className="dashboardCardText">
                                                    Company Clients
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-3 col-sm-6">
                                            <div
                                              className="dashboardCard"
                                              style={{
                                                backgroundColor: "#9BB7C2",
                                              }}
                                            >
                                              <div className="row">
                                                <div className="col-12 d-flex justify-content-between">
                                                  <div className="dashboardNumber">
                                                    {tierInfo?.lite?.length}
                                                  </div>
                                                </div>
                                                <div className="col-12 pe-0">
                                                  <div className="dashboardCardText">
                                                    Lite Tier
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-3 col-sm-6">
                                            <div
                                              className="dashboardCard"
                                              style={{
                                                backgroundColor: "#A5B3C9",
                                              }}
                                            >
                                              <div className="row">
                                                <div className="col-12 d-flex justify-content-between">
                                                  <div className="dashboardNumber">
                                                    {tierInfo?.premium?.length}
                                                  </div>
                                                </div>
                                                <div className="col-12 pe-0">
                                                  <div className="dashboardCardText">
                                                    Pro
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-3 col-sm-6">
                                            <div
                                              className="dashboardCard"
                                              style={{
                                                backgroundColor: "#A5B3C9",
                                              }}
                                            >
                                              <div className="row">
                                                <div className="col-12 d-flex justify-content-between">
                                                  <div className="dashboardNumber">
                                                    {tierInfo?.standard?.length}
                                                  </div>
                                                </div>
                                                <div className="col-12 pe-0">
                                                  <div className="dashboardCardText">
                                                    Enterprise Tier
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xxl-3 col-12 d-flex align-items-end justify-content-end">
                                        <div className="row mx-0 w-100 w-sm-50">
                                          <div className="col col-xxl-12 position-relative pe-0 ">
                                            <input
                                              type="text"
                                              onChange={(e) =>
                                                setSearch(e.target.value)
                                              }
                                              className="form-control inp w-75"
                                              placeholder="Search company"
                                            />
                                          </div>
                                          <div className="col col-xxl-12 position-relative pe-0">
                                            <select
                                              className="form-select formSelect inp w-75"
                                              onChange={(e) =>
                                                handleTierFilter(e.target.value)
                                              }
                                              style={{
                                                backgroundColor: "#eaf0f8",
                                                color: "#464255",
                                                border: "2px solid #fff",
                                              }}
                                            >
                                              <option selected disabled>
                                                tiers
                                              </option>
                                              <option value="monthly">
                                                Monthly
                                              </option>
                                              <option value="yearly">
                                                Yearly
                                              </option>
                                            </select>
                                          </div>
                                          <div className="col-auto px-0 col-xxl-12 d-flex align-items-end justify-content-end h-100 me-2">
                                            <button className="ExportBtn  mb-xxl-2 mt-xx-0">
                                              <img
                                                src="./../assets/img/svg/download1.svg"
                                                alt=""
                                              />
                                              <Export data={clientInfo} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row py-3">
                                      <div className="col-12">
                                        <div
                                          className="clientTable"
                                          style={{
                                            fontSize: "15px",
                                            backgroundColor: "#f6f8f9",
                                            borderRadius: "1.5em",
                                          }}
                                        >
                                          <DataTable
                                            columns={columns}
                                            data={
                                              search || tier
                                                ? clientInfoFilter
                                                : clientInfo
                                            }
                                            customStyles={customStyles}
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
    </main>
  );
}

export default Client;
