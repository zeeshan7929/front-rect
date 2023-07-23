import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { NavLink, useLocation } from "react-router-dom";
import { Line } from "rc-progress";
import DataTable from "react-data-table-component";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import { postData } from "../../Common/fetchservices";
import { randomBackground } from "../../Common/Others/RandonColor";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import UsageDpaChart from "../../Common/Charts/UsageDpaChart";
import { CountConverter } from "../../Common/Others/CountConverter";
import { RenewsDate } from "../../Common/Others/RenewsDate";

const UsageTrackingDPA = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  let item = location?.state?.item;
  // let renewDate = location?.state?.getRenewDate;
  // let tokenLimit = location?.state?.tokenLimit;
  
  const [users, setUsers] = useState([]);
  const [filterUsers, setfilterUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [dpacount, setdpacount] = useState("");
  const [tierInfo,setTierInfo] = useState([]);
  const [dpaInfo, setDpaInfo] = useState({});
  const [refreshTokens,setRefreshToken] = useState("");
  const [allUserDpaDetails,setAllUserDpaDetails] = useState([]);
  const [renewDate, setRenewDate] = useState({});
  const [tokenLimit, setTokenLimit] = useState("");
  let ids = JSON.parse(localStorage.getItem("a_login"));
  let details_ = JSON.parse(localStorage.getItem("details"));
  const handleDpa = async () => {
    const body = {
      client_id: ids?.client_id,
    };
    const bod = {
      client_id: ids?.client_id,
      dpa_id: String(item?.dpa_id ? item.dpa_id : item?.id)
    }
    const res = await postData("get_all_users_of_dpa", bod);
    console.log(res)
    setUsers(res?.result);

    const res2 = await postData("get_client_tier_info", body);
    setTierInfo(res2?.result);
  };
  function Round(num, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
}
  const handleAllUsers = async () => {
    const body__ = {
      client_id: ids?.client_id,
      user_id: String(ids?.user_id),
    };
    const res = await postData("get_user_assign_token_limit", body__);
    setTokenLimit(res?.result?.user_assign_token_limit);
    const body = {
      client_id: ids?.client_id,
      dpa_id: String(item?.dpa_id ? item.dpa_id : item?.id),
    };
    const res1 = await postData("get_dpa_info", body);
    setDpaInfo(res1?.result);
    const count = await postData("get_dpa_token_usage_count", body);
    const res3 = await postData("get_client_sub_renew_date", body);
    setRenewDate(res3.result?.sub_renew_date);
    setdpacount(count?.result?.dpa_usage_token_count);
    const body___ = { 
      client_id: ids?.client_id,
      user_id: ids?.user_id.toString()
    }
    const res4 = await postData("u_get_user_all_assign_dpa", body___);
    setAllUserDpaDetails(res4.result);
    const r_tokens = await postData('get_client_remaining_days_to_refresh_tokens',body);
    setRefreshToken(r_tokens?.result)


  };

  const filterAllUsers = () => {
    const fill = users?.filter((el) => {
      const { name } = el;
      if (name?.toLowerCase().includes(search?.toLowerCase())) {
        return el;
      }
    });
    setfilterUsers(fill);
  };

  useEffect(() => {
    handleDpa();
    addBlurClass();
    handleAllUsers();
  }, [item]);
  useEffect(() => {
    filterAllUsers();
  }, [search]);
  let b = users?.map((el) => el.dpa_usage_by_user);
  let dpaUsage = b?.reduce((total, cur) => Number(total) + Number(cur), 0);
  
  const columns = [
    {
      name: `TOTAL USER : ${users?.length}`,
      selector: (row) => (
        <>
          <img
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
            src={row?.profile_image ? row?.profile_image : "assets/img/bg/Avatar.png"}
          />
          {row?.name.toLowerCase()}
        </>
      ),
      letf: true,
    },
    {
      
      name: `TOTAL USAGE : ${dpaUsage}`,
      selector: (row) => (
        
        <div>
          <Line
            percent={(Number(row?.dpa_usage_by_user ) / Number(row?.usage_limit)) * 100  }
            strokeWidth={5}
            trailWidth={5}
            strokeColor={randomBackground()}
            strokeLinecap="square"
            style={{
              width: "100px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;&nbsp;
          {CountConverter(row?.dpa_usage_by_user)} Tokens
        </div>
      ),
      center: true,
      style: {
        marginLeft: "20px",
      },
    },
    {
      name: `ACROSS ALL DPA`,
      selector: (row) => <div>{CountConverter(row.dpa_usage_by_user)}</div>,
      center: true,
    },
    {
      selector: (row) => (
       
        <div>
          <NavLink
            to="/user-usage-tracking"
            state={{ item: row,
              dt: allUserDpaDetails,
            getRenewDate:RenewsDate(renewDate),
            tokenLimit:10000
            }}
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
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
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
                <div className="col rightBgPart px-0 h-100">
                  <div className="row mx-0 h-100">
                    <div className="col px-0 rightPart h-100">
                      <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                        <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                          <div className="row h-100 mx-0">
                            <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart overtracking dpausagetracking">
                              <div className="row mx-0 sticky-top stickyHeader">
                                <Header
                                  setSidebarOpen={setSidebarOpen}
                                  textHeader={` DPA Usage Tracking`}
                                  textSubHeader={
                                    "welcome "+ details_.name + ", you can find all information you require here."
                                  }
                                />
                              </div>
                              <div className="row py-3">
                                <div className="col-12">
                                  <button
                                    className=" border-0 backbtn px-4 mb-2"
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
                                  <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                    <div className="col pageHeading px-0">
                                      DPA Usage Tracking
                                    </div>
                                    <div className="col pageSubheading px-0">
                                      welcome carmen, you can find all
                                      information you require here.
                                    </div>
                                  </div>
                                  <div className="card managmentcard border-0 rounded-4 mb-3 px-3 py-4 py-md-5">
                                    <div className="row mx-0 align-items-center">
                                      <div className="col-auto">
                                        <div
                                          className="cricle"
                                          style={{
                                            width: "34px",
                                            height: "34px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: dpaInfo?.dpa_color,
                                          }}
                                        />
                                      </div>
                                      <div className="col ps-0">
                                        <div className="hWorkplace">
                                          {dpaInfo?.dpa_name}
                                        </div>
                                        <div className="subHeading">
                                          {dpaInfo?.dpa_description}
                                        </div>
                                      </div>
                                      <NavLink
                                        to="/dpa-managemant"
                                        state={{
                                          data: dpaInfo,
                                          dpaId: String(
                                            item?.id ? item?.id : item.dpa_id
                                          ),
                                        }}
                                        className="col-sm-auto mt-2 mt-sm-0 text-dec"
                                      >
                                        <button className="border-0 backbtn px-4">
                                          <span className="d-inline-flex">
                                            <img
                                              className="w-100 h-100"
                                              src="assets/img/svg/shapedpa.svg"
                                              alt="leftarrow"
                                            />
                                          </span>
                                          DPA Management
                                        </button>
                                      </NavLink>
                                    </div>
                                  </div>
                                  <div className="card border-0 rounded-4 py-3 px-4 dPAUsagecard mb-3">
                                    <div className="row mx-0">
                                      <div className="col-12 text-sm-center text-strat">
                                        <div className="heading d-flex align-items-center justify-content-center justify-content-sm-center">
                                          DPA Usage{" "}
                                          <small>({dpaInfo?.dpa_name})</small>
                                        </div>
                                      </div>
                                      <div className="col-12 d-flex align-items-center justify-content-between">
                                        <div className="persantage">
                                          {`${
                                            dpacount > 0
                                              ? Round(((dpacount / tierInfo.database_usage) * 100 ),1)
                                              : "0"
                                          }%`}
                                        </div>
                                        <div className="persantage">
                                          {CountConverter(dpacount)} Tokens
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <Line
                                          percent={
                                            dpacount > 0
                                              ? Round((dpacount / tierInfo.database_usage) * 100,1)
                                              : "0"
                                          }
                                          strokeWidth={1}
                                          trailWidth={1}
                                          strokeColor={dpaInfo?.dpa_color}
                                        />
                                      </div>
                                      <div className="col-12 d-flex align-items-center justify-content-between pt-2">
                                        <div className="progresbarbottomtext">
                                          Usage renews{" "}
                                          <strong>{RenewsDate(refreshTokens.remaining_days)}</strong>{" "}
                                        </div>
                                        <div className="progresbarbottomtext">
                                          {CountConverter(dpacount)} out of{" "}
                                          {CountConverter(tierInfo.database_usage)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-xxl-12">
                                      <UsageDpaChart
                                        clientId={ids?.client_id}
                                        userId={ids?.user_id}

                                        dpaId={item?.id}
                                      />
                                    </div>
                                  </div>
                                  <div className="card border-0 rounded-4 col-12 my-3 p-3">
                                    <div className="row mx-0">
                                      <div className="col-12 pt-2">
                                        <div className="textAssigned">
                                          Users Assigned{" "}
                                        </div>
                                      </div>
                                      <div className="col-12 d-flex justify-content-start justify-content-sm-end">
                                        <div className="position-relative formres">
                                          <input
                                            type="text"
                                            onChange={(e) =>
                                              setsearch(e.target.value)
                                            }
                                            className="form-control border-0 shadow-none rounded-4 w-100 w-sm-25"
                                            id="exampleFormControlInput1"
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
                                    <div className="imagetable w-100 p-2">
                                      <DataTable
                                        title={
                                          <div
                                            style={{
                                              display: "flex",
                                              lineHeight: "50px",
                                              paddingRight: "16px",
                                              paddingLeft: "16px",
                                              fontSize: "15px",
                                              backgroundColor: "#f6f8f9",
                                              borderRadius: "1.5em 1.5em 0 0",
                                              alignItems: "center",
                                              textAlign: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <p>USER</p>
                                            <p>DPA USAGE</p>
                                            <p style={{ paddingRight: "30px" }}>
                                              LIMIT
                                            </p>
                                            <p>Action</p>
                                          </div>
                                        }
                                        columns={columns}
                                        data={search ? filterUsers : users}
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
    </>
  );
};

export default UsageTrackingDPA;
