import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import { useNavigate } from "react-router-dom";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { postData } from "../../Common/fetchservices";
import { Line } from "rc-progress";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { randomBackground } from "../../Common/Others/RandonColor";
const UserOverview = ({ sideBar, setSidebarOpen }) => {
  const [allUser, setAllUser] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [roleuser, setRoleuser] = useState([]);
  const [totaladmin, settotaladmin] = useState([]);
  const [usersLimit,setUsersLimit] = useState("");
  const [tierInfo,setTierInfo] = useState([])
  // const adminUserNumber = allUser?.filter((item) => item.role == "admin");
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("a_login"));
  const getAllData = async () => {
    const body = {
      client_id: token.client_id,
    };
    const res = await postData("get_client_all_users", body);
    let r = await postData("get_client_tier_info", body);
    setTierInfo(r?.result)
    setAllUser(res.result);
    setFilterData(res.result);
  };
  function Round(num, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
}
  const RoleUser = async () => {
    const body = {
      client_id: token.client_id,
    };
    const res = await postData("get_client_all_role_users", body);
    setRoleuser(res.result);
  };

  const Admin = async () => {
    const body = {
      client_id: token.client_id,
    };
    const res = await postData("get_client_all_role_admin", body);
    settotaladmin(res.result);

    const res2 = await postData("get_client_assign_user", body);
    setUsersLimit(res2.result.users_count);
    
  };
  useEffect(() => {
    addBlurClass();
    getAllData();
    RoleUser();
    Admin();
  }, []);

  const columns = [
    {
      name: `Total Users : ${allUser?.length}`,
      sortable: true,
      cell: (row) => (
        <div className="dpa-row d-flex align-items-center">
          <span
            className="circle"
            // style={{ backgroundColor: randomBackground() }}
          >
            <img
              style={{ width: "34px", height: "34px", borderRadius: "64px" }}
              alt="profile"
              src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-business-user-profile-vector-png-image_1541960.jpg"
            />
          </span>
          <div className="">{row.name}</div>
        </div>
      ),
    },
    {
      name: "Role",
      cell: (row) => (
        <div className="dpa-row d-flex align-items-center ">
          <button
            className="btn btn-secondary  btn-rounded w-50 rounded-pill  my-btn"
            style={{
              backgroundColor: row.role === "admin" ? "#4a5c77" : "#d1d1cf",
            }}
          >
            {row.role}
          </button>
        </div>
      ),
      sortable: true,
    },
    {
      name: "USAGE",
      selector: (row) => (
        <div>
          {Number(row?.token_usage) || Number(row?.usage_limit) > 0 ? (
            <Line
              percent={(Number(row?.token_usage) / Number(row?.usage_limit)) * 100}
              strokeWidth={5}
              trailWidth={5}
              strokeColor="#9BB7C2"
              strokeLinecap="square"
              style={{
                width: "100px",
                alignItems: "flex-start",
              }}
            />
          ) : (
            <svg
              width="20"
              height="10"
              viewBox="0 0 20 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.83 0.119999C16.15 0.119999 17.24 0.519999 18.1 1.32C18.98 2.1 19.42 3.18 19.42 4.56C19.42 5.92 18.97 7.01 18.07 7.83C17.19 8.63 16.09 9.03 14.77 9.03C13.77 9.03 12.89 8.78 12.13 8.28C11.37 7.76 10.61 7.04 9.85 6.12C9.31 6.98 8.63 7.68 7.81 8.22C6.99 8.76 6.07 9.03 5.05 9.03C3.71 9.03 2.61 8.64 1.75 7.86C0.91 7.06 0.49 5.97 0.49 4.59C0.49 3.23 0.93 2.15 1.81 1.35C2.69 0.529999 3.79 0.119999 5.11 0.119999C6.11 0.119999 6.99 0.389999 7.75 0.93C8.51 1.45 9.26 2.18 10 3.12C10.52 2.24 11.19 1.52 12.01 0.959999C12.85 0.399999 13.79 0.119999 14.83 0.119999ZM5.2 7.02C5.88 7.02 6.53 6.81 7.15 6.39C7.77 5.97 8.29 5.4 8.71 4.68C8.03 3.82 7.43 3.18 6.91 2.76C6.41 2.32 5.85 2.1 5.23 2.1C4.49 2.1 3.89 2.32 3.43 2.76C2.99 3.2 2.77 3.81 2.77 4.59C2.77 5.35 2.99 5.95 3.43 6.39C3.87 6.81 4.46 7.02 5.2 7.02ZM14.65 7.05C15.39 7.05 15.98 6.83 16.42 6.39C16.88 5.95 17.11 5.34 17.11 4.56C17.11 3.8 16.89 3.21 16.45 2.79C16.01 2.35 15.42 2.13 14.68 2.13C13.98 2.13 13.31 2.35 12.67 2.79C12.05 3.23 11.53 3.82 11.11 4.56C11.71 5.36 12.28 5.98 12.82 6.42C13.38 6.84 13.99 7.05 14.65 7.05Z"
                fill="#00C2E4"
              />
            </svg>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;
          {(Number(row?.token_usage) || Number(row?.usage_limit)) > 0
            ? `${Round((Number(row?.token_usage) * 100) / Number(row?.usage_limit),1)}%`
            : ""}
        </div>
      ),
      center: true,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <NavLink
            to="/user-management"
            state={{ item: row }}
            style={{ fontSize: "20px" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20H20.5M18 10L21 7L17 3L14 6M18 10L8 20H4V16L14 6M18 10L14 6"
                stroke="#959298"
                strokeWidth="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NavLink>
        );
      },
      right: true,
      style: {
        display:"flex",
        color:"red",
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
  const handelSearch = (value) => {
    if (value) {
      let a = allUser?.filter((el) =>
        el.name?.toLowerCase().includes(value?.toLowerCase())
      );
      setFilterData(a);
    } else {
      setFilterData(allUser);
    }
  };
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
                          <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart userOverViewMain">
                            <div className="row mx-0 sticky-top stickyHeader">
                              <Header
                                setSidebarOpen={setSidebarOpen}
                                textHeader={"User Management"}
                                textSubHeader={
                                  "welcome carmen, you can find all user information here."
                                }
                              />
                            </div>
                            <div className="row py-3">
                              <div className="col-12">
                                <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                  <div className="col pageHeading px-0">
                                    User Management
                                  </div>
                                  <div className="col pageSubheading px-0">
                                    welcome carmen, you can find all information
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
                                            {roleuser?.length + totaladmin.length}
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
                                            of {usersLimit} Users
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
                                            {totaladmin?.length}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/crown.svg"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                        <div className="col-12 pe-0">
                                          <div className="dashboardCardText">
                                            Admins
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-auto col-12 ms-auto">
                                    <div className="row flex-md-column mx-0 gy-3 gy-sm-0 justify-content-between h-100 align-items-center">
                                      <div className="col-sm-auto col-12 px-0">
                                        <div
                                          onClick={() => navigate("/add-user")}
                                          className="addNewUserBtn"
                                        >
                                          + Add New User
                                        </div>
                                      </div>
                                      <div className="col-sm-auto col-12 searchInp px-0">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search user"
                                          onChange={(e) =>
                                            handelSearch(e.target.value)
                                          }
                                        />
                                        <div className="searchBtn">
                                          <img
                                            src="assets/img/svg/032-search.svg"
                                            className="w-100"
                                            alt=""
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card shadow-none border-0 p-0 dpaSection  my-4">
                                  <div className="row mx-0 align-items-center">
                                    <div className="col-12 p-0">
                                      <DataTable
                                        columns={columns}
                                        data={filterData}
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
    </div>
  );
};

export default UserOverview;
