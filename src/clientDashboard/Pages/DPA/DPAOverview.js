import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Line } from "rc-progress";
import { postData } from "../../Common/fetchservices";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import TrainedChart from "./TrainedChart";
import { CountConverter } from "../../Common/Others/CountConverter";
const DPAOverview = ({ sideBar, setSidebarOpen }) => {
  let clientId = JSON.parse(localStorage.getItem("a_login"));
  const [userDpaDetails, setUserDpaDetails] = useState([]);
  const [filterUserDpa, setFilterUserDpa] = useState([]);
  const [searchdpa, setsearchdfa] = useState("");
  const [documents, setDocuments] = useState([]);
  const [traningToken, setTrainingToken] = useState({});
  const [dpaCount, setDpaCount] = useState(0);
  const [totalDpa, setTotalDpa] = useState(0);
  const [totalTokenLimit, setTotalTokenLimit] = useState(0);

  const getDocumentdata = async () => {
    const body = {
      client_id: clientId?.client_id,
    };
    const res = await postData("get_client_uploaded_documents", body);
    setDocuments(res?.result);
    const res1 = await postData("get_client_training_token_usage", body);
    setTrainingToken(
      res1.result.training_token_usage ? res1.result.training_token_usage : 0
    );

    const res3 = await postData("get_client_assign_dpa", body);
    setTotalDpa(
      res3.result.assign_dpa_count ? res3.result.assign_dpa_count : 0
    );

    const res4 = await postData("get_client_created_dpa", body);
    setDpaCount(
      res4.result.created_dpa_count ? res4.result.created_dpa_count : 0
    );

    const res5 = await postData("get_client_all_dpa_details", body);
    setUserDpaDetails(res5.result);
  };

  const getTokenLimit = async () => {
    const body = {
      client_id: clientId.client_id,
      user_id: String(clientId.user_id),
    };
    const res = await postData("get_user_assign_token_limit", body);
    setTotalTokenLimit(
      res.result.user_assign_token_limit
        ? Number(res.result.user_assign_token_limit)
        : 0
    );
  };

  const handlefilterDpaName = () => {
    let fill = userDpaDetails.filter((el) => {
      const { dpa_name } = el;
      if (dpa_name.toLowerCase().includes(searchdpa.toLowerCase())) {
        return el;
      }
    });
    setFilterUserDpa(fill);
  };

  const trainedData = {
    tokenUsage: Number(traningToken),
    tokenLimit: totalTokenLimit,
  };

  const columns = [
    {
      name: "DPA",
      style: { width: 200 },
      cell: (row) => {
        return (
          <div className="d-flex">
            <span
              style={{
                backgroundColor:
                  row?.dpa_color !== "#00fd0fd" ? row?.dpa_color : "#9BB7C2",
                color:
                  row?.dpa_color !== "#00fd0fd" ? row?.dpa_color : "#9BB7C2",
                padding: "6px 12px",
                borderRadius: "50%",
                marginRight: "10px",
                maxHeight: "24px",
                maxWidth: "24px",
                border: `0.5px solid ${
                  row?.dpa_color !== "#00fd0fd" ? row?.dpa_color : "#9BB7C2"
                }`,
              }}
            ></span>
            <p> {row?.dpa_name}</p>
          </div>
        );
      },

      letf: true,
    },
    {
      name: "DATABASE USED",
      selector: (row) => (
        <div>
          <Line
            percent={row?.embeding_usage > 0 ? row?.embeding_usage : "0"}
            strokeWidth={5}
            trailWidth={5}
            strokeColor={row?.dpa_color}
            strokeLinecap="square"
            style={{
              width: "99.26px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {CountConverter(row?.embeding_usage)}
        </div>
      ),
      // right: true,
      center: true,
    },
    {
      name: "USERS",
      selector: (row) => row?.users,
      center: true,
    },
    {
      name: "ACTION",
      cell: (row) => (
        <NavLink
          to="/dpa-managemant"
          state={{ data: row, doc: documents, trainedData }}
          style={{ fontSize: "16px", textDecoration: "none" }}
        >
          <i
            style={{ color: "#001A72" }}
            className="bi bi-box-arrow-up-right"
          ></i>
        </NavLink>
      ),
      center: true,
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
  useEffect(() => {
    // handleCount();
    addBlurClass();
    getTokenLimit();
    getDocumentdata();
  }, []);

  useEffect(() => {
    handlefilterDpaName();
  }, [searchdpa]);
  return (
    <main className="container-fluid h-100">
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
                  <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
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
                                // sideBar={sideBar}
                                textHeader={`DPA Database Overview`}
                                textSubHeader={
                                  "Welcome Carmen, you can find all information you require here."
                                }
                              />
                            </div>
                            <div className="row py-3">
                              <div className="col-12">
                                <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                  <div className="col pageHeading px-0">
                                    DPA Database Overview
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
                                      style={{ backgroundColor: "#4A5C77" }}
                                    >
                                      <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                          <div className="dashboardNumber">
                                            {dpaCount}
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
                                            of {totalDpa} DPAs
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-3 col-sm-6">
                                    <div
                                      className="dashboardCard"
                                      style={{ backgroundColor: "#9BB7C2" }}
                                    >
                                      <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                          <div className="dashboardNumber">
                                            {documents?.length}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/traineddata.svg"
                                              alt=""
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
                                  <div className="col-md-6 col-12">
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
                                                <div className="percent">
                                                  {(
                                                    (Number(traningToken) /
                                                      Number(totalTokenLimit)) *
                                                    100
                                                  ).toFixed()}
                                                  %
                                                </div>
                                                <span>used</span>
                                              </div>
                                            </div>
                                            <div className="col-auto">
                                              <div className="progressBarTxt1">
                                                {CountConverter(
                                                  totalTokenLimit
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <Line
                                            percent={(
                                              (Number(traningToken) /
                                                Number(totalTokenLimit)) *
                                              100
                                            ).toFixed()}
                                            strokeWidth={2}
                                            trailWidth={2}
                                            strokeColor={"#9bb7c2"}
                                          />
                                        </div>
                                        <div className="col-12 d-flex justify-content-center">
                                          <div className="progressBottomTxt">
                                            <span>
                                              {CountConverter(
                                                totalTokenLimit - traningToken
                                              )}
                                            </span>{" "}
                                            remaining
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="card shadow-none border-0 p-3 dpaSection  my-4">
                                  <div className="row mx-0 align-items-center">
                                    <div className="col d-flex align-items-center gap-2">
                                      <div className="dpaUsesHeading fw-semibold">
                                        Trained Data
                                      </div>
                                      <div className="formSelectGroup">
                                        <select
                                          className="form-select shadow-none"
                                          aria-label="Default select example"
                                        >
                                          <option selected>7 Days</option>
                                          <option value="1">7 Days</option>
                                          <option value="2">2 Weeks</option>
                                          <option value="3">1 Month</option>
                                          <option value="4">3 Months</option>
                                          <option value="5">YTD</option>
                                          <option value="6">Custom</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-auto">
                                      <button
                                        type="button"
                                        className="exportBtn rounded-pill d-inline-flex align-items-center gap-1 btn fw-medium"
                                      >
                                        <span className="d-inline-flex">
                                          <img
                                            src="assets/img/svg/download.svg"
                                            className="h-100"
                                            alt=""
                                          />
                                        </span>
                                        Export
                                      </button>
                                    </div>
                                    <div className="col-12  mt-3">
                                      <img
                                        src="assets/img/svg/tokenChart.svg"
                                        className="w-100"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </div> */}
                                <TrainedChart titel={"Trained Data"} />
                                <div className="row mb-3">
                                  <div className="col-12 w-100">
                                    <div className="alldpaTable d-flex align-items-center justify-content-between">
                                      <div className="row justify-content-between align-items-center w-100">
                                        <div className="col d-flex">
                                          <div className="alldpaTableHead">
                                            All DPAs
                                          </div>
                                          <NavLink
                                            to="/create-new-dpa"
                                            className="btnnn text-dec"
                                          >
                                            + Create New DPA
                                          </NavLink>
                                        </div>
                                        <div className="col-sm-auto mt-3 mt-sm-0 position-relative d-flex align-items-center">
                                          <input
                                            type="text"
                                            onChange={(e) =>
                                              setsearchdfa(e.target.value)
                                            }
                                            className="INP form-control"
                                            name=""
                                            id=""
                                            placeholder="Search for DPA"
                                          />
                                          <div className="parent">
                                            <img
                                              src="assets/img/svg/search.svg"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-12">
                                    <div
                                      className="tableImg"
                                      style={{
                                        fontSize: "15px",
                                        backgroundColor: "#f6f8f9",
                                        borderRadius: "1.5em",
                                      }}
                                    >
                                      <DataTable
                                        columns={columns}
                                        data={
                                          searchdpa
                                            ? filterUserDpa
                                            : userDpaDetails
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
    </main>
  );
};

export default DPAOverview;
