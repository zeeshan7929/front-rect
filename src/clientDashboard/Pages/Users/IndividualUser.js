import React, { useEffect, useRef, useState } from "react";
import Header from "../../Common/Header/Header";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import Sidebar from "../../Common/Sidebar/Sidebar";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import ReactDOM from "react-dom";
import { postData } from "../../Common/fetchservices";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useLocation, NavLink } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toaster } from "../../Common/Others/Toaster";
import "react-rangeslider/lib/index.css";
import Slider from "react-rangeslider";
import Modal from "../../Common/Modal/index";
import { useOnClickOutside } from "../../Common/Others/useOnClickOutside";
import { CountConverter } from "../../Common/Others/CountConverter";

const IndividualUser = ({ sideBar, setSidebarOpen }) => {
  let ref = useRef(null);
  const ids = JSON.parse(localStorage.getItem("a_login"));
  const location = useLocation();
  
  let item = location?.state?.item;
  
  console.log(item)
  const [value, setValue] = useState(1);
  const [open, setopen] = useState(false);
  const [userDpa, setUserDpa] = useState([]);
  const [allClientDpa, setAllClientDpa] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelOpen1, setModelOpen1] = useState(false);
  const [el, setEl] = useState({});
  const [userLimit,setUserLimit] = useState(500000);
  const [initialValues, setInitialValus] = useState({
    name: item?.name,
    email: item?.email,
    role: item?.role,
    password: item?.password,
  });
  useEffect(() => {
    let limit = item?.usage_limit;
    let value;
    if (limit >= 10000 && limit <= 100000) {
      value = 1;
    } else if (limit > 100000 && limit <= 250000) {
      value = 2;
    } else if (limit > 250000 && limit <= 500000) {
      value = 3;
    } else if (limit > 500000 && limit <= 1000000) {
      value = 4;
    } else if (limit > 1000000 && limit < 2000000) {
      value = 5;
    } else if (limit >= 2000000 && limit < 2000100) {
      value = 6;
    } else {
      value = 7;
    }
    setValue(value);
  }, []);
  const [sheet, setSheet] = useState(null);
  const [curValue, setCurValue] = useState(50);

  const handleClose = () => setopen(false);
  useOnClickOutside(ref, handleClose);

  const dpaValidationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Required"),
    role: Yup.string().required("Required"),
    password: Yup.string()
      .min(2, "Too Short!")
      .max(60, "Description must be less than 60 charecter !")
      .required("Required"),
    email: Yup.string().required("Required"),
  });

  const handleSubmit = async (value, { resetForm }) => {
    const body = {
      name: value?.name,
      email: value?.email,
      role: value?.role,
      user_id: String(item.id),
      password: value?.password,
    };
    const res = await postData("update_user_info", body);
    if (res.result == "success") {
      resetForm();
      toaster(true, "Success");
    } else {
      toaster(false, "Somthing went wrong");
    }
  };

  const deleteuser = async () => {
    const body = {
      user_id: String(item.id),
      client_id: ids.client_id
    };
    const res = await postData("delete_user", body);
    if (res.result === "success") {
      setModelOpen(false);
      window.history.back();
    }
  };

  const Assigndpa = async () => {
    const body = {
      client_id: ids.client_id,
    };
    const res = await postData("get_client_all_dpa_details", body);
    setAllClientDpa(res.result);
  };

  const getAllDpaOfUser = async () => {
    const body = {
      client_id: ids.client_id,
      user_id: String(item.id),
    };
    const res = await postData("u_get_user_all_assign_dpa", body);
    // let data = res?.result?.map((item) => {
    //   const { dpa_id } = item;
    //   return allClientDpa?.filter((el) => el.id === dpa_id)[0];
    // });
    setUserDpa(res?.result);
  };

  const handleAssignDpa = (id) => {
    let result = userDpa.find((el) => el.id == id);
    if (result) {
      return;
    } else {
      const body = {
        dpa_id: String(id),
        user_id: String(item.id),
        client_id: ids.client_id,
      };
      const res = postData("assign_new_dpa_to_user", body);
      Assigndpa();
    }
  };

  const handleRevokeUser = async () => {
    const body = {
      dpa_id: String(el.dpa_id),
      user_id: String(item.id),
      client_id: ids.client_id,
    };
    const res = await postData("delete_user_assign_dpa", body);
    if (res.result == "success") {
      setModelOpen1(false);
      Assigndpa();
    }
  };

  useEffect(() => {
    Assigndpa();
    addBlurClass();
  }, []);

  useEffect(() => {
    getAllDpaOfUser();
  }, [allClientDpa]);

  useEffect(() => {
    const createStyleElement = () => {
      const style = document.createElement("style");
      document.body.appendChild(style);
      setSheet(style);
    };

    createStyleElement();

    return () => {
      if (sheet) {
        document.body.removeChild(sheet);
      }
    };
  }, []);

  const handleRangeChange = (event) => {
    const val = parseInt(event.target.value);
    setValue(val);
  };

  const updateMaxValue = (value) => {
    let max = 10000;
    // if (value > 11000 && value < 509000) {
    //   max = 600000;
    // } else if (value > 150000 && value < 310000) {
    //   max = 770000;
    // } else if (value > 400000 && value < 576000) {
    //   max = 1013900;
    // } else {
    //   max = 1013900;
    // }
    switch (value) {
      case 1:
        max = 10000;
        break;
      case 2:
        max = 100000;
        break;
      case 3:
        max = 250000;
        break;
      case 4:
        max = 500000;
        break;
      case 5:
        max = 1000000;
        break;
      case 6:
        max = 2000000;
        break;
      case 7:
        max = 2500000;
        break;
      default:
        max = 10000;
        break;
    }
    return max;
  };

  const handleUpdateUsaseLimite = async () => {
    const body = {
      user_id: String(item.id),
      limit: String(updateMaxValue(value)),
    };
    const res = await postData("/update_user_usage_limit", body);
    if (res.result == "success") {
      toaster(true, "Success");
    } else {
      toaster(false, "Something went wrong");
    }
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
                          <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                            <div className="row mx-0 sticky-top stickyHeader">
                              <Header
                                setSidebarOpen={setSidebarOpen}
                                textHeader={"User Management"}
                                textSubHeader={
                                  " you can add new users here"
                                }
                              />
                            </div>
                            <div className="row py-3">
                              <div className="col-12 mb-4 individualUser">
                                <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                  <div className="col pageHeading px-0">
                                    User Management
                                  </div>
                                  <div className="col pageSubheading px-0">
                                    welcome carmen, you can find all information
                                    you require here.
                                  </div>
                                </div>
                                <div className="card shadow-none border-0 userProfileOuter">
                                  <div className="row flex-column flex-sm-row mx-0 h-100">
                                    <div className="col-auto px-0">
                                      <div className="userImg">
                                        <img
                                          src="assets/img/bg/Avatar.png"
                                          className="w-100"
                                          alt
                                        />
                                      </div>
                                    </div>
                                    <div className="col px-0">
                                      <div className="row flex-column mx-0 h-100">
                                        <div className="col px-0">
                                          <div className="userName">
                                            {item.name}
                                          </div>
                                          <div className="userPosition">
                                            {item.role}
                                          </div>
                                        </div>
                                        <div className="col px-0 flex-fill">
                                          <div className="row mx-0 align-items-center mt-auto">
                                            <div className="col-sm col-12 px-0 userMail">
                                              {item.email}
                                            </div>
                                            <div className="col-sm-auto col-12 px-0">
                                              <div className="row mx-0 gap-md-3 gap-2 justify-content-center align-items-center h-100">
                                                <div className="col-auto px-0">
                                                  <NavLink
                                                    to="/user-usage-tracking"
                                                    state={{item:item}}
                                                    className="trackUsageBtn"
                                                  >
                                                    <img
                                                      src="assets/img/svg/trending-up.svg"
                                                      alt
                                                    />
                                                    Track Usage
                                                  </NavLink>
                                                </div>
                                                {
                                                  ids.user_id !== item.id ? (
                                                    <div className="col-auto px-0">
                                                  <div
                                                    className="deleteUserBtn"
                                                    onClick={() =>
                                                      setModelOpen(true)
                                                    }
                                                  >
                                                    <img
                                                      src="assets/img/svg/deleteshape.svg"
                                                      alt
                                                    />
                                                    Delete User
                                                  </div>
                                                </div>
                                                  ) : ""
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row g-4">
                                  <div className="col-sm-6 col-12">
                                    <div className="card shadow-none border-0 addNewUserSection updateUserInfo h-100">
                                      <Formik
                                        initialValues={initialValues}
                                        onSubmit={(value, resetForm) =>
                                          handleSubmit(value, resetForm)
                                        }
                                        validationSchema={dpaValidationSchema}
                                      >
                                        {({ errors, touched, values }) => {
                                          return (
                                            <Form className="row mx-0 align-items-center h-100 flex-column">
                                              <div className="col-12 px-0 secHeading">
                                                Update User Info
                                              </div>
                                              <div className="col-12 px-0 subHeading">
                                                Only edit the fields you want to
                                                &amp; click update
                                              </div>
                                              <div className="col-12 px-0">
                                                <div className="row inpSection mx-0">
                                                  <div className="col-12 px-0">
                                                    <Field
                                                      type="text"
                                                      value={values.name}
                                                      className="form-control createInp"
                                                      name="name"
                                                      id
                                                      placeholder="Name of DPA"
                                                    />
                                                    <p className="text-danger">
                                                      {touched.name &&
                                                      errors.name
                                                        ? errors.name
                                                        : ""}
                                                    </p>
                                                  </div>
                                                  <div className="col-12 px-0">
                                                    <Field
                                                      type="email"
                                                      name="email"
                                                      value={values.email}
                                                      className="form-control"
                                                      placeholder="John@companyx.com"
                                                    />
                                                    <p className="text-danger">
                                                      {touched.email &&
                                                      errors.email
                                                        ? errors.email
                                                        : ""}
                                                    </p>
                                                  </div>
                                                  <div className="col-12 px-0">
                                                    <div className="chooseUserRoleText">
                                                      Choose User Role
                                                    </div>
                                                    <div className="customSelect">
                                                      {/* <select className="form-select"> */}
                                                      <Field
                                                        as="select"
                                                        className="form-select shadow-none"
                                                        aria-label="Default select example"
                                                        name="role"
                                                      >
                                                        <option
                                                          value={values.role}
                                                        >
                                                          {values.role}
                                                        </option>
                                                        <option value={"admin"}>
                                                          admin
                                                        </option>
                                                        <option value={"user"}>
                                                          user
                                                        </option>
                                                      </Field>
                                                      <p className="text-danger">
                                                        {touched.role &&
                                                        errors.role
                                                          ? errors.role
                                                          : ""}
                                                      </p>
                                                      {/* </select> */}
                                                      <div className="selectImg">
                                                        <img
                                                          src="assets/img/svg/078-down-chevron.svg"
                                                          className="w-100"
                                                          alt
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="col-12 px-0">
                                                    <Field
                                                      type="password"
                                                      name="password"
                                                      value={values.password}
                                                      className="form-control"
                                                      placeholder="New Password"
                                                    />
                                                    <p className="text-danger">
                                                      {touched.password &&
                                                      errors.password
                                                        ? errors.password
                                                        : ""}
                                                    </p>
                                                  </div>
                                                  <div className="col-auto px-0 mx-auto">
                                                    <button
                                                      type="submit"
                                                      className="updateUserBtn my-btn"
                                                    >
                                                      Update User Info
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </Form>
                                          );
                                        }}
                                      </Formik>
                                    </div>
                                  </div>
                                  <div className="col-sm-6 col-12">
                                    <div className="card border-0 shadow-none assignedBox h-100 ">
                                      <div className="row mx-0">
                                        <div
                                          ref={ref}
                                          className="col-12 boxHeading px-0"
                                        >
                                          Assigned DPAs ({userDpa.length})
                                          <span className="dropdown addBtnOuter">
                                            <div
                                              className={
                                                open ? "addBt" : "addBt show"
                                              }
                                              data-bs-toggle="dropdown"
                                              aria-expanded={
                                                open ? true : false
                                              }
                                              onClick={() =>
                                                setopen((prev) => !prev)
                                              }
                                            >
                                              <img
                                                src="assets/img/svg/add-icon.svg"
                                                className="w-100"
                                                alt
                                              />
                                            </div>
                                            <ul
                                              className={`dropdown-menu mt-3 ${
                                                open ? "show dropdowns" : ""
                                              }`}
                                            >
                                              <div className="serchInpOuter">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                />
                                                <div className="searchBtn">
                                                  <img
                                                    src="assets/img/svg/search-icon2.svg"
                                                    className="w-100"
                                                    alt
                                                  />
                                                </div>
                                              </div>
                                              {allClientDpa.map((el) => {
                                                 
                                                return (
                                                  (el.dpa_name !== "" && el.dpa_name !== undefined && el.dpa_name !== null ) ? (
                                                    <li
                                                    key={Math.random()}
                                                    className="dropdown-item"
                                                  >
                                                    <span
                                                      className="colorCirle"
                                                      style={{
                                                        backgroundColor:
                                                          el.dpa_color,
                                                      }}
                                                    />
                                                    <span className="itemText">
                                                      {el.dpa_name}
                                                    </span>
                                                   
                                                    <div
                                                      className="asignBtn"
                                                      onClick={() =>
                                                        handleAssignDpa(el.id)
                                                      }
                                                    >
                                                      Assign
                                                    </div>
                                                  </li>
                                                  ) : ""
                                                  
                                                );
                                              })}
                                            </ul>
                                          </span>
                                        </div>
                                        <div className="col-12 px-0 boxSubHeading overflow-auto">
                                          These are the assigned DPAs to this
                                          user.{" "}
                                        </div>

                                        <div
                                          className="col-12 px-0 resultBoxOuter"
                                          style={{
                                            height: "500px",
                                            overflow: "auto",
                                            marginTop: "0px",
                                          }}
                                        >
                                          <div className="row mx-0">
                                            <div className="col-12 px-0 resultBox">
                                              {userDpa?.map((el) => {
                                                return (
                                                  <div
                                                    key={Math.random()}
                                                    className="row mx-0 align-items-center"
                                                  >
                                                    <div
                                                      className="col-auto px-0  colorCircle colorOne mt-2"
                                                      style={{
                                                        backgroundColor:
                                                          el?.dpa_color,
                                                      }}
                                                    />
                                                    <div className="col px-3 mt-4">
                                                      <div className="dpaHeadings">
                                                        {el?.dpa_name}
                                                      </div>
                                                      <div className="dpaSubHeadings">
                                                        {el?.description}
                                                      </div>
                                                    </div>
                                                    <div className="col-auto px-0 dropdown">
                                                      <div
                                                        className="settingBtn"
                                                        onClick={() => {
                                                          setModelOpen1(true);
                                                          setEl(el);
                                                        }}
                                                      >
                                                        <img
                                                          src="assets/img/svg/settings.svg"
                                                          className="w-100"
                                                          alt
                                                        />
                                                      </div>
                                                      <ul className="dropdown-menu">
                                                        <li>
                                                          <div className="dropdown-item">
                                                            Revoke Access
                                                          </div>
                                                        </li>
                                                      </ul>
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
                                  <div className="col-12">
                                    <div className="card border-0 shadow-none updateUserLimitCard">
                                      <div className="row mx-0 flex gap-sm-5 gap-3">
                                        <div className="col-sm col-12 px-0">
                                          <div className="row mx-0 flex-column">
                                            <div className="col px-0 cardHeading">
                                              Update User Usage Limit
                                            </div>
                                            <div className="col px-0">
                                              <div className="rangeImgOuter">
                                                {/* <img
                                                  src="assets/img/svg/Slider.svg"
                                                  className="w-100"
                                                  alt
                                                /> */}

                                                <div>
                                                  <input
                                                    id="myinput"
                                                    className="w-100"
                                                    type="range"
                                                    // min={10000}
                                                    // max={updateMaxValue(value)}

                                                    step={1}
                                                    min={1}
                                                    max={7}
                                                    value={value}
                                                    list="markers"
                                                    onChange={(e) =>
                                                      handleRangeChange(e)
                                                    }
                                                  />
                                                  <div
                                                    className="w-100 d-flex width-100"
                                                    style={{ width: "100%" }}
                                                  >
                                                    <ul
                                                      id="markers"
                                                      className="range-labels  d-flex justify-content-between"
                                                      style={{ width: "83.5%" }}
                                                    >
                                                      <li
                                                        id="tokens"
                                                        className="vertical-line1 ms-0"
                                                      >
                                                        10K
                                                      </li>
                                                      <li className="vertical-line2  ms-0">
                                                        100K
                                                      </li>
                                                      <li className="vertical-line3 me-1">
                                                        250K
                                                      </li>
                                                      <li className="vertical-line4 me-2">
                                                        500K
                                                      </li>
                                                      <li className="vertical-line5 ms-0">
                                                        1M
                                                      </li>
                                                      <li className="vertical-line6 ms-0">
                                                        2M
                                                      </li>
                                                    </ul>
                                                    <span
                                                      className="vertical mt-2"
                                                      style={{
                                                        color: "#43adf7",
                                                        fontSize: "11px",
                                                        marginTop: "-2px",
                                                        width: "16.5%",
                                                        textAlign: "end",
                                                      }}
                                                    >
                                                      No Limit ∞
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-sm-auto col-12 px-0">
                                          <div className="row mx-0 flex-sm-column h-100 justify-content-between">
                                            {value <= 6 ? (
                                              <div className="col-auto tokenOuter">
                                                <span>
                                                  {CountConverter(
                                                    updateMaxValue(value)
                                                  )}
                                                </span>{" "}
                                                <span className="tokenText">
                                                  Tokens
                                                </span>
                                              </div>
                                            ) : (
                                              <div className="col-auto tokenOuter">
                                                <span className="">
                                                  No Limit
                                                </span>
                                              </div>
                                            )}

                                            <div className="col-auto px-0 pointer">
                                              <div
                                                onClick={() =>
                                                  handleUpdateUsaseLimite()
                                                }
                                                className="updateBtn"
                                              >
                                                Update
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
                  {/* right sideBar */}
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
      <Modal
        type={modelOpen ? "Deleting User" : "Revoke Access"}
        modelOpen={modelOpen ? modelOpen : modelOpen1}
        setModelOpen={modelOpen ? setModelOpen : setModelOpen1}
        hanldeFunction={modelOpen ? deleteuser : handleRevokeUser}
      />
    </main>
  );
};

export default IndividualUser;
