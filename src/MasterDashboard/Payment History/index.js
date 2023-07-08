import React, { useEffect, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import DataTable from "react-data-table-component";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { MyDocument } from "./invoice";
import { Header } from "../Common/Header/Header";
import { addBlurClass } from "../../clientDashboard/Common/Others/AddBlurClass";
import { DateRange } from "../../clientDashboard/Common/Others/DateRange";
import { Export } from "./export";
const PaymentHistory = ({ sideBar, setSidebarOpen }) => {
  const [value, setValue] = useState([]);
  const [filters, setfilters] = useState([]);
  const [search, setsearch] = useState("");
  const [date, setDate] = useState("");

  const paymentdetalis = async () => {
    const res = await postData("m_get_all_invoices");
    setValue(res.result);
  };

  const handleFilter = () => {
    const filterdata = value.filter((el) => {
      if (el.company.toLowerCase().includes(search.toLowerCase())) {
        return el;
      }
    });
    setfilters(filterdata);
  };

  useEffect(() => {
    handleFilter();
  }, [search]);
  useEffect(() => {
    paymentdetalis();
    addBlurClass();
  }, []);

  const columns = [
    {
      name: "Date",
      selector: (row) => row.date_time,
    },
    {
      name: "Order",
      selector: (row) => row.order,
    },
    {
      name: "Company",
      selector: (row) => row.company,
    },
    {
      name: "Tier",
      selector: (row) => row.description,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Status",
      selector: (row) => (
        <div
          style={{
            backgroundColor:
              row.status == "paid"
                ? "#ddf6ef"
                : row.status == "Failed"
                ? "#f9d5d5"
                : row.status == "Refunded"
                ? "#fcf2e3"
                : "",
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingTop: "5px",
            borderRadius: "15px",
            width: "100px",
            height: "30px",
            textAlign: "center",
            color:
              row.status == "paid"
                ? "#00a389"
                : row.status == "Failed"
                ? "#ffbb54"
                : row.status == "Refunded"
                ? "#f04343"
                : "",
            fontSize: "14px",
          }}
        >
          {row.status}
        </div>
      ),
    },
    {
      name: "Invoice",
      selector: (row) => (
        <div>
          <div className="invoice">
            <PDFDownloadLink
              document={<MyDocument row={row} />}
              fileName="invoice.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  "Loading..."
                ) : (
                  <img
                    src="assets/img/svg/Download.svg"
                    alt
                    style={{ width: "15px" }}
                  />
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      ),
      center: true,
    },
  ];

  const customStyles = {
    names: {
      style: {
        minHeight: "72px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        paddingLeft: "8px",
      },
    },
    headCells: {
      style: {
        minHeight: "72px",
        fontSize: "16px",
        // fontWeight: "bold",
        color: "rgb(163, 163, 163)",
        // paddingLeft: "8px",
        // paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
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
                  <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen} />
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
                                title={"Payment History"}
                                setSidebarOpen={setSidebarOpen}
                              />
                            </div>
                            <div className="row mx-0 justify-content-center h-100 flex-fill overflow-hidden">
                              <div className="col-12 h-100">
                                <div className="row py-3 overflow-hidden-auto h-100 mx-0">
                                  <div className="col-12 px-0">
                                    <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                      <div className="col pageHeading px-0">
                                        Payment History
                                      </div>
                                    </div>
                                    <div className="row pt-sm-5 pt-3">
                                      <div className="col-12">
                                        <div className="paymentHistoryTopBar row justify-content-between align-items-center">
                                          <div className="paymentHistoryTopBarHead col-12 col-md">
                                            Payment History
                                          </div>
                                          <div className="paymentHistoryTopBarBox col-auto d-flex align-items-center">
                                            <div className="row">
                                              <div
                                                className="col-sm-auto col-12 position-relative"
                                                onChange={(e) =>
                                                  setsearch(e.target.value)
                                                }
                                              >
                                                <input
                                                  type="text"
                                                  className="form-control inpSearch"
                                                  name=""
                                                  id=""
                                                  placeholder="Search company"
                                                />
                                                <div className="inpSearchBtn">
                                                  <img
                                                    src="./../assets/img/svg/search.svg"
                                                    alt=""
                                                  />
                                                </div>
                                              </div>
                                              <div className="col-sm-auto col-12 position-relative">
                                                <select
                                                  className="form-select formSelect"
                                                  aria-label="Default select example"
                                                  onChange={(e) =>
                                                    DateRange({
                                                      event: e.target.value,
                                                      data: value,
                                                      change: setDate,
                                                      filterData: setfilters,
                                                    })
                                                  }
                                                >
                                                  <option disabled selected>
                                                    Date Range
                                                  </option>
                                                  <option value="7 Days">
                                                    7 Days
                                                  </option>
                                                  <option value="2 Weeks">
                                                    2 Weeks
                                                  </option>
                                                  <option value="1 Month">
                                                    1 Month
                                                  </option>
                                                  <option value="3 Months">
                                                    3 Months
                                                  </option>
                                                  <option value="YTD">
                                                    YTD
                                                  </option>
                                                </select>
                                              </div>
                                              <div className="col-sm-auto col-12 ">
                                                <button className="addTier ">
                                                  <img
                                                    src="./../assets/img/svg/download.svg"
                                                    alt=""
                                                  />
                                                  <Export data={value} />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row py-3">
                                      <div className="col-12">
                                        <div
                                          className="tierTable"
                                          style={{
                                            fontSize: "15px",
                                            backgroundColor: "#f6f8f9",
                                            borderRadius: "1.5em",
                                          }}
                                        >
                                          <DataTable
                                            columns={columns}
                                            data={
                                              search || date ? filters : value
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
};

export default PaymentHistory;
