import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar/Sidebar";
import DataTable from "react-data-table-component";
import { CiEdit } from "react-icons/ci";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { Header } from "../Common/Header/Header";
import { addBlurClass } from "../../clientDashboard/Common/Others/AddBlurClass";
const Tier = ({ sideBar, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const [filters, setfilters] = useState([]);
  const Tier_name = async () => {
    const res = await postData("m_get_all_tiers_info");
    setdata(res.result);
    setfilters(res.result);
  };

  const search = (e) => {
    const query = e.target.value;
    if (query) {
      const filterdata = filters.filter((el) =>
        el.name.toLowerCase().includes(query.toLowerCase())
      );

      setdata(filterdata);
    } else {
      if (!query) {
        setdata(filters);
      }
    }
  };
  useEffect(() => {
    Tier_name();
    addBlurClass();
  }, []);
  const columns = [
    { name: "Tier Name", selector: (row) => row.name },
    { name: "Usage Token", selector: (row) => row.database_usage },
    { name: "Training Token", selector: (row) => row.training_tokens },
    {
      name: "No.of DPA",
      selector: (row) => row.num_of_dpa,
    },
    {
      name: "No.of users",
      selector: (row) => row.num_of_users,
    },
    {
      name: "Pricing",
      selector: (row) => row.pricing_monthly,
    },
    {
      name: "Colour Code",
      selector: (row) => (
        <div
          style={{
            backgroundColor: row.colour,
            width: "30px",
            height: "30px",
            borderRadius: "50px",
            marginLeft: "20px",
          }}
        ></div>
      ),
    },
    {
      name: "Edit",
      selector: (row) => (
        <div>
          <NavLink to="/edit-tier" state={{ item: row }}>
            <CiEdit style={{ color: "gray" }} />
          </NavLink>
        </div>
      ),
    },
  ];


  const customStyles = {
    names: {
      style: {
        minHeight: "72px", // override the row height
      },
    },
    rows: {
      style: {
        minHeight: "72px", // override the row height
        paddingLeft: "8px",
      },
    },
    headCells: {
      style: {
        minHeight: "72px",
        fontSize: "16px",
        // fontWeight: "bold",
        color: "rgb(163, 163, 163)",
        // paddingLeft: "8px", // override the cell padding for head cells
        // paddingRight: "8px",
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
                  <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen}/>
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
                                title={"Tiers"}
                                setSidebarOpen={setSidebarOpen}
                              />
                            </div>
                            <div className="row mx-0 justify-content-center h-100 flex-fill overflow-hidden">
                              <div className="col-12 h-100">
                                <div className="row py-3 overflow-hidden-auto h-100 mx-0">
                                  <div className="col-12 px-0">
                                    <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                      <div className="col pageHeading px-0">
                                        Tiers
                                      </div>
                                    </div>
                                    <div className="row pt-lg-5 pt-md-1">
                                      <div className="col-12">
                                        <div className="clientTableTopBar row justify-content-between align-items-center">
                                          <div className="clientTableTopBarHeading col-12 col-md">
                                            Tier List
                                          </div>
                                          <div className="containerBox col-md-auto d-flex align-items-center">
                                            <div className="row mx-0">
                                              <div className="col-auto px-0">
                                                <button
                                                  onClick={() =>
                                                    navigate("/add-tier")
                                                  }
                                                  className="addTier"
                                                >
                                                  + Add New Tier
                                                </button>
                                              </div>
                                              <div
                                                className="col-sm-auto col-12 position-relative px-0 px-sm-2"
                                                onChange={(e) => search(e)}
                                              >
                                                <input
                                                  type="text"
                                                  className="form-control inpSearch"
                                                  name=""
                                                  id=""
                                                  placeholder="Search tier"
                                                />
                                                <div className="inpSearchBtn">
                                                  <img
                                                    src="./../assets/img/svg/search.svg"
                                                    alt=""
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row py-3">
                                      <div className="col-12">
                                        <div className="tierTable"
                                         style={{
                                          fontSize: "15px",
                                          backgroundColor: "#f6f8f9",
                                          borderRadius: "1.5em",
                                        }}
                                        >
                                          <DataTable
                                            data={data}
                                            columns={columns}
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
};

export default Tier;
