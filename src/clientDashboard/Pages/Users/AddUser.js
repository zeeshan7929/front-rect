import React, { useEffect, useRef, useState } from "react";
import Header from "../../Common/Header/Header";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import Sidebar from "../../Common/Sidebar/Sidebar";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import ReactDOM from "react-dom";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import { postData } from "../../Common/fetchservices";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import * as yup from "yup";
import { useOnClickOutside } from "../../Common/Others/useOnClickOutside";
import { toaster } from "../../Common/Others/Toaster";
import { CountConverter } from "../../Common/Others/CountConverter";
import { useNavigate } from "react-router-dom";

const AddUser = ({ sideBar, setSidebarOpen }) => {
  const ref = useRef();
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState("");
  const [data, setData] = useState(0);
  const [value, setValue] = useState(1);
  const [tokenLimit, setTokenLimit] = useState([]);
  const [usageToken, setUsageToken] = useState([]);
  const [allDpa, setAllDpa] = useState([]);
  const [show, setShow] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);
  const [noOfLetters, setNumberOfLetters] = useState(25);
  const [tierInfo,setTierInfo] = useState([]);
  const [createdUsers,setCreatedUsers] = useState([]);
  const [initialValue, setInitialValue] = useState({
    name: "",
    email: "",
    userRole: "",
  });
  const token = JSON.parse(localStorage.getItem("a_login"));

  const validationschema = yup.object().shape({
    userRole: Yup.string().required("Please Enter User Role"),
    name: Yup.string()
      .required("Please Enter Name")
      .matches(/^[a-zA-Z ]*$/, "Name can only contain letters and spaces")
      .max(25, "Name must be 25 characters or less"),
    email: Yup.string().email().required("Email is required"),
  });

  const getRestrictions = async()=>{
    const body = {
      client_id: token?.client_id,
    };
    const res1 = await postData("get_client_tier_info", body);
    const cusrs = await postData("get_client_created_users",body);
    setTierInfo(res1?.result);
    setCreatedUsers(cusrs?.result.created_users_count);


    console.log(createdUsers)
    console.log(tierInfo)
  }

  const userUsageLimit = async () => {
    const body = {
      client_id: token.client_id,
      user_id: String(token.user_id),
    };
    const res = await postData("get_user_assign_token_limit", body);
    const res2 = await postData("get_user_token_usage", body);
    const res3 = await postData("get_user_role", body);
    setUserRole(res3?.result);
    setUsageToken(res2?.result);
    setTokenLimit(res?.result);
  };

  const getAllDpa = async () => {
    const body = {
      client_id: token.client_id,
    };
    const res = await postData("get_client_all_dpa_details", body);
    setAllDpa(res.result);
  };

  useEffect(() => {
    addBlurClass();
    userUsageLimit();
    getAllDpa();
    getRestrictions();
  }, []);

  const handleAssignUser = (el) => {
    let fill = assignedUser.filter((item) => item.id === el.id);
    if (fill.length) {
      setAssignedUser(fill);
    } else {
      setAssignedUser([...assignedUser, el]);
    }
  };
  const handleRemoveUser = (value) => {
    let fill = assignedUser.filter((el) => el !== value);
    setAssignedUser(fill);
  };
  const submitHandler = async (value, { resetForm }) => {
    const body = {
      client_id: token.client_id,
      user_name: value?.name,
      user_email: value?.email,
      user_password: "123456",
      role: value?.userRole,
      usage_limit: updateMaxValue(value),
      assign_dpa: assignedUser.map((el) => el.id),
    };
    
    if (Number(createdUsers) === Number(tierInfo.number_of_users)){
      toaster(false, "Users Limit exceed");
      navigate(-1);
    }
    else {
      const res = await postData("add_new_user", body);
      if (res.result === "success" || res.result === "Success") {
      resetForm();
      setAssignedUser([]);
      setData(0);
      toaster(true, "Success");
      window.history.back();
    } else {
      toaster(false, res.result);
    }
  }
  };

  const handleAutoClose = () => setShow("");
  useOnClickOutside(ref, handleAutoClose);

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
                          <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                            <div className="row mx-0 sticky-top stickyHeader">
                              <Header
                                textHeader={"Add User"}
                                setSidebarOpen={setSidebarOpen}
                                textSubHeader={
                                  " you can add new users here"
                                }
                              />
                            </div>
                            <div className="row py-3">
                              <div className="col-12">
                                <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                  <div className="col pageHeading px-0">
                                    Add User
                                  </div>
                                  <div className="col pageSubheading px-0">
                                    welcome carmen, you can add new users here
                                  </div>
                                </div>
                                <div className="row mx-0">
                                  <div className="col-xxl-12 mb-4">
                                    <div className="card shadow-none border-0 addNewUserSection h-100">
                                      {
                                        <Formik
                                          initialValues={initialValue}
                                          onSubmit={(value, resetForm) =>
                                            submitHandler(value, resetForm)
                                          }
                                          validationSchema={validationschema}
                                        >
                                          {({ values, touched, errors }) => {
                                            return (
                                              <Form className="row mx-0 align-items-center h-100 flex-column">
                                                <div className="col-12 px-0 secHeading">
                                                  Adding New User
                                                </div>
                                                <div className="col-12 px-0 subHeading">
                                                  Add in the relevant fields and
                                                  the user will receive an
                                                  e-mail with login details.
                                                </div>
                                                <div className="col-12 px-0">
                                                  <div className="row inpSection mx-0">
                                                    <div className="col-12 px-0">
                                                      <div className="nameInp">
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Name"
                                                          name="name"
                                                          maxLength={25}
                                                        />
                                                        <div
                                                          onChange={() =>
                                                            setNumberOfLetters(
                                                              noOfLetters -
                                                                values.name
                                                                  .length
                                                            )
                                                          }
                                                          className="characterLimit"
                                                        >
                                                          {`(${
                                                            noOfLetters -
                                                            values.name.length
                                                          } Character Limit)`}
                                                        </div>
                                                        <p className="text-danger">
                                                          {touched.name &&
                                                          errors.name
                                                            ? errors.name
                                                            : ""}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <div className="col-12 px-0">
                                                      <Field
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="E-mail"
                                                        name="email"
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
                                                        <Field
                                                          as="select"
                                                          className="form-select"
                                                          name="userRole"
                                                        >
                                                          <option value="">
                                                            Select User Role
                                                          </option>

                                                          <option value="admin">
                                                            admin
                                                          </option>
                                                          <option value="user">
                                                            user
                                                          </option>
                                                        </Field>
                                                        <p className="text-danger">
                                                          {touched.userRole &&
                                                          errors.userRole
                                                            ? errors.userRole
                                                            : ""}
                                                        </p>
                                                        <div className="selectImg">
                                                          <img
                                                            src="assets/img/svg/078-down-chevron.svg"
                                                            className="w-100"
                                                            alt=""
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-12 px-0 userUssageLimitSection">
                                                      <div className="row mx-0 align-items-center">
                                                        <div className="col px-0 userHeading">
                                                          User Usage Limit
                                                        </div>
                                                        {value <= 6 ? (
                                                          <div className="col-auto tokenOuter">
                                                            <span>
                                                              {CountConverter(
                                                                updateMaxValue(
                                                                  value
                                                                )
                                                              )}
                                                            </span>
                                                            <span className="tokenText">
                                                              Tokens
                                                            </span>
                                                          </div>
                                                        ) : (
                                                          <div className="col-auto tokenOuter">
                                                            No Limit
                                                          </div>
                                                        )}
                                                        <div className="col-12 px-0 sliderImg">
                                                          {/* <img
                                                            src="assets/img/svg/Slider.svg"
                                                            className="w-100"
                                                            alt=""
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
                                                                handleRangeChange(
                                                                  e
                                                                )
                                                              }
                                                            />
                                                            <div
                                                              className="w-100 d-flex width-100"
                                                              style={{
                                                                width: "100%",
                                                              }}
                                                            >
                                                              <ul
                                                                id="markers"
                                                                className="range-labels  d-flex justify-content-between"
                                                                style={{
                                                                  width:
                                                                    "83.5%",
                                                                }}
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
                                                                  color:
                                                                    "#43adf7",
                                                                  fontSize:
                                                                    "11px",
                                                                  marginTop:
                                                                    "-2px",
                                                                  width:
                                                                    "16.5%",
                                                                  textAlign:
                                                                    "end",
                                                                }}
                                                              >
                                                                No Limit ∞
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-12 px-0 assignDpaSection">
                                                      <div className="row mx-0 align-items-center gap-3">
                                                        <div className="col-auto assignDpaHeading px-0">
                                                          Assign DPA to User
                                                        </div>
                                                        <div className="col-auto px-0">
                                                          <div className="row mx-0 gap-2 align-items-center">
                                                            {assignedUser?.map(
                                                              (item) => {
                                                                return (
                                                                  <div
                                                                    className="col-auto assignBox "
                                                                    style={{
                                                                      backgroundColor:
                                                                        item?.dpa_color
                                                                          ? item?.dpa_color
                                                                          : "#ffbb78",
                                                                    }}
                                                                  >
                                                                    {
                                                                      item?.dpa_name
                                                                    }
                                                                    <span
                                                                      className="deleteIcon"
                                                                      onClick={() =>
                                                                        handleRemoveUser(
                                                                          item
                                                                        )
                                                                      }
                                                                    >
                                                                      <img
                                                                        src="assets/img/svg/cross-icon.svg"
                                                                        className="w-100"
                                                                        alt=""
                                                                      />
                                                                    </span>
                                                                  </div>
                                                                );
                                                              }
                                                            )}

                                                            <div className="col-auto px-0 addBtnOuter ">
                                                              <div
                                                                className="dropdown show"
                                                                ref={ref}
                                                              >
                                                                <a
                                                                  href="javascript:;"
                                                                  className="addBtn"
                                                                  data-bs-toggle="dropdown"
                                                                  aria-expanded="false"
                                                                >
                                                                  <img
                                                                    onClick={() =>
                                                                      setShow(
                                                                        (
                                                                          prev
                                                                        ) =>
                                                                          !prev
                                                                      )
                                                                    }
                                                                    src="assets/img/svg/add-icon.svg"
                                                                    className="w-100"
                                                                    alt=""
                                                                  />
                                                                </a>
                                                                <ul
                                                                  className={`dropdown-menu ${
                                                                    show == true
                                                                      ? "show"
                                                                      : ""
                                                                  }`}
                                                                >
                                                                  {/* <div className="serchInpOuter">
                                                                    <input
                                                                      type="text"
                                                                      className="form-control"
                                                                    />
                                                                    <div className="searchBtn">
                                                                      <img
                                                                        src="assets/img/svg/search-icon2.svg"
                                                                        className="w-100"
                                                                        alt=""
                                                                      />
                                                                    </div>
                                                                  </div> */}
                                                                  {allDpa?.map(
                                                                    (item) => {
                                                                      return (
                                                                        <li className="dropdown-item">
                                                                          <span className="colorCirle"></span>
                                                                          <span className="itemText">
                                                                            {
                                                                              item?.dpa_name
                                                                            }
                                                                          </span>
                                                                          <a
                                                                            className="asignBtn"
                                                                            href="javascript:;"
                                                                            onClick={() =>
                                                                              handleAssignUser(
                                                                                item
                                                                              )
                                                                            }
                                                                          >
                                                                            Assign
                                                                          </a>
                                                                        </li>
                                                                      );
                                                                    }
                                                                  )}
                                                                </ul>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-auto mx-auto mt-auto pt-4 pt-lg-5 mt-lg-5">
                                                  <a
                                                    onClick={()=>{
                                                      navigate(-1);
                                                    }}
                                                    className="cancleBtn my-btn"
                                                  >
                                                    Cancel
                                                  </a>
                                                  <button
                                                    type="submit"
                                                    className="addUserBtn my-btn"
                                                  >
                                                    Add User
                                                  </button>
                                                </div>
                                              </Form>
                                            );
                                          }}
                                        </Formik>
                                      }
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
    </div>
  );
};

export default AddUser;
