import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { postData } from "../../Common/fetchservices";
import { RenewsDate } from "../../Common/Others/RenewsDate";
import { toaster } from "../../Common/Others/Toaster";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DownloadDoc } from "./invoice";
import Modal from "../../Common/Modal";
import { DateRange } from "../../Common/Others/DateRange";
import { Export } from "../../../MasterDashboard/Payment History/export";
const BillingPlans = ({ sideBar, setSidebarOpen }) => {
  let clientId = JSON.parse(localStorage.getItem("a_login"));
  const [billingdetails, setBillingDetails] = useState({});
  const [subdetails, setsubDetails] = useState({});
  const [history, setHistory] = useState([]);
  const [filter, setfilter] = useState([]);
  const [search, setseacrh] = useState("");
  const [open, setopen] = useState(false);
  const [date, setDate] = useState("");

  const handleBillingDetails = async () => {
    const body = {
      client_id: clientId?.client_id,
    };
    const res = await postData("get_client_billing_details", body);
    setBillingDetails(res?.result);
    const res1 = await postData("get_client_tier_info", body);
    setsubDetails(res1?.result);
    const res2 = await postData("get_client_invoices", body);
    setHistory(res2?.result);
  };
  const handleCancelSub = async () => {
    const body = {
      client_id: clientId?.client_id,
    };
    const res = await postData("cancel_client_subscription", body);
    setopen(false);
    if (res?.result == "Success") {
      handleBillingDetails();
    } else {
      toaster(false, "Empty");
    }
  };

  const handleSearchHistory = () => {
    let fill = history?.filter((el) => {
      let amount = String(el?.amount);
      if (amount?.toLowerCase().includes(search?.toLowerCase())) {
        return el;
      }
    });
    setfilter(fill);
  };

  useEffect(() => {
    handleSearchHistory();
  }, [search]);
  useEffect(() => {
    addBlurClass();
    handleBillingDetails();
  }, []);
  const columns = [
    {
      name: "Date",
      selector: (row) => <div className="date">{row?.date_time}</div>,
    },
    {
      name: "Order",
      selector: (row) => <div className="order">{row?.order}</div>,
    },
    {
      name: "Description",
      selector: (row) => (
        <div className="description text-nowrap">{row?.description}</div>
      ),
      center: true,
    },
    {
      name: "Amount",
      selector: (row) => <div className="amount">{row?.amount}</div>,
      style: {
        marginLeft: "10px",
        textAlign: "right",
      },
      center: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          {row?.status == "paid" ? (
            <img src="assets/img/svg/Paid.svg" alt="" />
          ) : row?.status == "failed" ? (
            <img src="assets/img/svg/Failed.svg" alt=""></img>
          ) : (
            <img src="assets/img/svg/refund.svg" alt=""></img>
          )}
        </div>
      ),
      center: true,
    },
    {
      name: "Invoice",
      selector: (row) => (
        <>
          {row?.status == "paid" ? (
            <div className="invoice">
              <PDFDownloadLink
                document={<DownloadDoc row={row} />}
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
          ) : row?.status == "failed" ? (
            <div
              style={{
                fontSize: "26px",
                marginBottom: "10px",
              }}
            >
              ...
            </div>
          ) : (
            <div className="invoice">
              <PDFDownloadLink
                document={<DownloadDoc row={row} />}
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
          )}
        </>
      ),
      center: true,
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
        color: "rgb(163, 163, 163)",
        textAlign: "center",
        display: "flex !important",
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
                className={`row main h-100 menuIcon ${
                  sideBar == "grid" ? "show" : ""
                }`}
              >
                <div className="col-auto px-0 leftPart h-100">
                  <div className="row sideBar h-100">
                    <Sidebar
                      setSidebarOpen={setSidebarOpen}
                      sideBar={sideBar}
                    />
                  </div>
                </div>
                <div className="col px-0 rightPart rightBgInnerPart h-100">
                  <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                    <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                      <div className="row h-100 mx-0">
                        <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0">
                          <div className="row mx-0 sticky-top stickyHeader">
                            <Header
                              setSidebarOpen={setSidebarOpen}
                              sideBar={sideBar}
                              textHeader={`Billing & Plans`}
                              textSubHeader={
                                " Welcome Carmen, you can find all your billing history here."
                              }
                            />
                          </div>
                          <div className="row py-3">
                            <div className="col-12">
                              <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                <div className="col pageHeading px-0">
                                  Billing &amp; Plans
                                </div>
                                <div className="col pageSubheading px-0">
                                  Welcome Carmen, you can find all your billing
                                  history here.
                                </div>
                              </div>
                              <div className="row pe-xxl-5 pe-0 py-3">
                                <div className="col-sm-6 col-12 pb-3 pb-sm-0">
                                  <div className="billingCard">
                                    <div className="row align-items-center">
                                      <div className="col">
                                        <div className="billingCardHeading">
                                          Subscription Plan
                                        </div>
                                      </div>
                                      <NavLink
                                        to="/subscription-plan"
                                        state={{
                                          item: subdetails,
                                          id: clientId?.client_id,
                                        }}
                                        className="col-auto"
                                      >
                                        <div className="edit">
                                          <img
                                            src="assets/img/svg/edit.svg"
                                            alt
                                          />
                                        </div>
                                      </NavLink>
                                    </div>
                                    <div className="row">
                                      <div className="col">
                                        <div className="row">
                                          <div className="col-12 lightPlan">
                                            {subdetails?.name}
                                          </div>
                                          <div className="col-12 billingBottomTxt">
                                            Pricing: {subdetails?.price}
                                          </div>
                                          <div className="col-12 billingBottomTxt">
                                            Subscription:{" "}
                                            {subdetails?.plan_type}
                                          </div>
                                          <div className="col-12 billingBottomTxt">
                                            Renews on:{" "}
                                            {RenewsDate(
                                              subdetails?.renew_date
                                            )?.slice(0, 4)}{" "}
                                            of every month{" "}
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        onClick={() => setopen(true)}
                                        className="col-auto d-flex align-items-center justify-content-center pointer"
                                      >
                                        <div className="close">
                                          <img
                                            src="assets/img/svg/close.svg"
                                            alt
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-6 col-12">
                                  <div className="billingCard">
                                    <div className="row align-items-center">
                                      <div className="col">
                                        <div className="billingCardHeading">
                                          Billing Details
                                        </div>
                                      </div>
                                      <NavLink
                                        to="/billing-details"
                                        state={{
                                          item: billingdetails,
                                          id: clientId?.client_id,
                                        }}
                                        className="col-auto"
                                      >
                                        <div className="edit">
                                          <img
                                            src="assets/img/svg/edit.svg"
                                            alt
                                          />
                                        </div>
                                      </NavLink>
                                    </div>
                                    <div className="row">
                                      <div className="col">
                                        <div className="row">
                                          <a
                                            href="javascript:;"
                                            className="col-12"
                                          >
                                            <div className="visa">
                                              <img
                                                src="assets/img/svg/Visa.svg"
                                                alt
                                              />
                                            </div>
                                          </a>
                                          <div className="col-12 billingBottomTxt">
                                            {billingdetails?.card_name} ending
                                            in{" "}
                                            {billingdetails?.card_number?.slice(
                                              12,
                                              16
                                            )}
                                          </div>
                                          <div className="col-12 billingBottomTxt">
                                            Recurring Payment Date:{" "}
                                            {RenewsDate(
                                              billingdetails?.sub_renew_date
                                            )?.slice(0, 4)}{" "}
                                            of every month{" "}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-auto d-flex align-items-center justify-content-center">
                                        {/* <div class="close">
                                             <img src="assets/img/svg/close.svg" alt="">
                                           </div> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row py-2 mx-0 pe-xxl-5 pe-0">
                                <div className="col-12">
                                  <div className="row tableHeading ">
                                    <div className="col-auto">
                                      <div className="paymentHistory">
                                        Payment History
                                      </div>
                                    </div>
                                    <div className="col-md d-flex justify-content-md-end">
                                      <div className="row w-100 mx-0 justify-content-md-end">
                                        <div className="col-md-auto col-sm-6 ps-0">
                                          <div className="position-relative">
                                            <input
                                              type="text"
                                              onChange={(e) =>
                                                setseacrh(e.target.value)
                                              }
                                              className="searchInp form-control"
                                              placeholder="Search payment"
                                            />
                                            <img
                                              className="searchIcon"
                                              src="assets/img/svg/search.svg"
                                              alt
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-auto ps-0 col-6 col-sm-3">
                                          <div className="position-relative">
                                            <select
                                              className="form-select formSelect form-select-lg mb-3 "
                                              aria-label=".form-select-lg example"
                                              onChange={(e) =>
                                                DateRange({
                                                  event: e.target.value,
                                                  data: history,
                                                  change: setDate,
                                                  filterData: setfilter,
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
                                              <option value="YTD">YTD</option>
                                            </select>
                                            <img
                                              className="formselectIcon"
                                              src="assets/img/svg/down.svg"
                                              alt
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-auto ps-0 col-6 col-sm-3">
                                          <button className="uploadBtn">
                                            <img
                                              src="assets/img/svg/upload.svg"
                                              alt
                                            />
                                            <Export data={history || []} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row mx-0 pe-xxl-5 pe-0">
                                <div className="col-12">
                                  <div
                                    className="table-responsive"
                                    style={{ borderRadius: "20px" }}
                                  >
                                    <DataTable
                                      columns={columns}
                                      data={search || date ? filter : history}
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
      <Modal
        type={"Delete Subscription Plain"}
        modelOpen={open}
        setModelOpen={setopen}
        hanldeFunction={handleCancelSub}
      />
    </>
  );
};

export default BillingPlans;
