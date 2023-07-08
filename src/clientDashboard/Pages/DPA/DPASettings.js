import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import Header from "../../Common/Header/Header";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SelectColors } from "../../Common/Others/SelectColors";
import { ErrorText } from "../../Common/Others/ErrorText";
import { postData } from "../../Common/fetchservices";
import DataTable from "react-data-table-component";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import { randomBackground } from "../../Common/Others/RandonColor";
import { useOnClickOutside } from "../../Common/Others/useOnClickOutside";
import Modal from "../../Common/Modal";
import { CountConverter } from "../../Common/Others/CountConverter";

const DPASettings = ({ sideBar, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const myref = useRef(null);
  let item = location?.state?.item;
  let traningToken = location?.state?.trainedToken;
  const ids = JSON.parse(localStorage.getItem("a_login"));
  let dpaID = location?.state?.dpaID;
  const [allAssignUsers, setAllAssignUsers] = useState([]);
  const [allAssignUsersFilter, setAllAssignUsersFilter] = useState([]);
  const [assignUsers, setAssignUsers] = useState([]);
  const [open, setOPen] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [usersdata, setusersdata] = useState([]);
  const [initialValues, setInitialValus] = useState({
    name: item?.dpa_name ? item?.dpa_name : "",
    description: item?.dpa_description ? item?.dpa_description : "",
    color: item?.dpa_color ? item?.dpa_color : "",
    allowToUpload:
      item?.allow_files?.toLowerCase() == "true" ? "true" : "false",
  });
  const [modelOpen, setModelOpen] = useState(false);
  const handleAssignUsers = (el) => {
    let fill = usersdata?.filter((item) => item?.id == el.id);
    if (fill.length) {
      return;
    } else {
      setusersdata([...usersdata, el]);
    }
  };
  const autoClose = () => {
    setOPen("");
  };
  useOnClickOutside(myref, autoClose);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const handlefilterUser = () => {
    let fill = allAssignUsers?.filter((el) => {
      if (el?.name.toLowerCase().includes(search.toLowerCase())) {
        return el;
      }
    });
    setAllAssignUsersFilter(fill);
  };
  const handleRemoveUsers = (id, iid) => {
    let fill = usersdata?.filter((el) => {
      return el.user_id !== id || el.id !== iid;
    });
    setusersdata(fill);
  };
  const handleSubmit = async (val) => {
    let userDate = {};
    assignUsers?.map((el) => {
      userDate = { clientId: el.client_id };
    });
    const body = {
      dpa_id: String(item?.id ? item.id : dpaID),
      dpa_name: val?.name,
      dpa_description: val?.description,
      color: val?.color,
      allow_files: val?.allowToUpload,
      client_id: ids.client_id,
    };
    const res = await postData("update_dpa_setting", body);
    if (res.result == "success") {
      navigate("/dpa-overview");
    }
  };

  const handleDeleteDpa = async () => {
    const body = {
      dpa_id: String(item.id ? item.id : dpaID),
    };
    const res = await postData("delete_dpa", body);
    setModelOpen(false);
    if (res.result == "success") {
      navigate("/dpa-overview");
    }
  };

  const userAssignedApi = async () => {
    const body = {
      client_id: ids.client_id,
      dpa_id: String(item.id ? item.id : dpaID),
    };
    const res = await postData("get_all_users_of_dpa", body);
    setusersdata(res.result);
  };
  const getAllUserForAssign = async () => {
    const body = {
      client_id: ids.client_id,
    };
    let res = await postData("get_client_all_users", body);
    setAllAssignUsers(res.result);
    let fill = res?.result.filter((el) => {
      return el?.client_id == ids.client_id;
    });
    setAssignUsers(fill);
  };

  const dpaValidationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Required"),
    description: Yup.string()
      .min(2, "Too Short!")
      .max(60, "Description must be less than 60 character !")
      .required("Required"),
    color: Yup.string().required("Required"),
  });
  useEffect(() => {
    handlefilterUser();
    getAllUserForAssign();
    addBlurClass();
  }, [search]);

  useEffect(() => {
    userAssignedApi();
  }, []);
  let a = usersdata?.map((el) => el?.dpa_usage_by_user);
  let tokenUsage = a.reduce((total, cur) => Number(total) + Number(cur), 0);
  let b = usersdata?.map((el) => el.usage_limit);
  let totalLimit = b.reduce((total, cur) => Number(total) + Number(cur), 0);

  const columns = [
    {
      name: `Total Users : ${usersdata.length}`,
      selector: (row) => (
        <>
          <img
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
            src={row?.image ? row?.image : "assets/img/bg/Avatar.png"}
          />
          {row?.username} {row?.name}
        </>
      ),
    },
    {
      name: `TOTAL USAGE : ${CountConverter(tokenUsage)}(${
        tokenUsage > 0 ? `${(tokenUsage * 100) / totalLimit}%` : "0"
      })`,
      selector: (row) => (
        <div>
          <Line
            percent={
              row?.dpa_usage_by_user > 0 ? row?.dpa_usage_by_user / 100 : "0"
            }
            strokeWidth={5}
            trailWidth={5}
            strokeColor={randomBackground()}
            strokeLinecap="square"
            style={{
              width: "100px",
              alignItems: "flex-start",
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {`${
            row?.dpa_usage_by_user > 0 ? row?.dpa_usage_by_user / 100 : "0"
          }%`}
        </div>
      ),
      center: true,
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    {
      selector: (row) => (
        <NavLink
          // to="/user-usage-tracking"
          // state={{ item: row, dt: allUserDpaDetails }}
          style={{ fontSize: "26px", textDecoration: "none" }}
        >
          <i style={{ color: "#1E1E1E" }} class="bi bi-gear"></i>
        </NavLink>
      ),
      right: true,
      style: {
        marginRight: "20px",
      },
    },
  ];
  return (
    <main className="container-fluid h-100">
      <div className="row mainInner h-100">
        <div
          className="col-12 px-0 flex-fill h-100"
          data-page-name="dpasetting"
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
              <div className="col px-0 rightPart rightBgInnerPart h-100">
                <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                  <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                    <div className="row h-100 mx-0 dpasetting">
                      <div className="col-12 overflow-hidden-auto scrollPart h-100 px-0">
                        <div className="row mx-0 sticky-top stickyHeader">
                          <Header
                            setSidebarOpen={setSidebarOpen}
                            sideBar={sideBar}
                            textHeader={`DPA Settings`}
                            textSubHeader={
                              "Welcome Carmen, you can find all information you require here."
                            }
                          />
                        </div>
                        <div className="row py-3 dpaSettingInnerPage mx-0">
                          <div className="col-12 pe-xxl-0">
                            <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                              <div className="col pageHeading px-0 fw-semibold">
                                DPA Settings
                              </div>
                              <div className="col pageSubheading px-0">
                                Welcome Carmen, you can find all information you
                                require here.
                              </div>
                            </div>
                            <div className="row pe-xxl-4 pe-0 py-3 mx-0">
                              <div className="col-xxl-8 col-12 pb-3 pb-sm-0 realtionCard px-0">
                                <div className="mb-3">
                                  <button
                                    className="backBtn"
                                    onClick={() => window.history.back()}
                                  >
                                    <img
                                      src="assets/img/svg/leftarrow.svg"
                                      alt="image"
                                    />
                                    Back
                                  </button>
                                </div>
                                <div className="workplaceCard mb-xxl-0 mb-3">
                                  <div className="row mx-0 innerbody p-3 align-items-center">
                                    <div className="col-auto">
                                      <div
                                        className="circle"
                                        style={{
                                          width: "34px",
                                          height: "34px",
                                          borderRadius: "50%",
                                          border: "none",
                                          backgroundColor: item?.dpa_color,
                                        }}
                                      />
                                    </div>
                                    <div className="col workrelation fw-semibold px-0">
                                      {item?.dpa_name}
                                    </div>
                                    <div className="col-sm-auto mt-sm-0 mt-3">
                                      <button
                                        type="button"
                                        onClick={() => setModelOpen(true)}
                                        className="dpadeleteBtn btn rounded-pill text-white d-inline-flex align-items-center gap-3 border-0 fw-medium"
                                      >
                                        <span className="d-inline-flex">
                                          <img
                                            src="assets/img/svg/trash-2.svg"
                                            className="w-100"
                                            alt=""
                                          />
                                        </span>
                                        Delete DPA
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xxl-4 col-12 ps-xxl-4 px-0">
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
                                              {traningToken?.training_token_usage
                                                ? traningToken?.training_token_usage /
                                                  100
                                                : 0}
                                              %
                                            </div>
                                            <span>used</span>
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <div className="progressBarTxt1">
                                            1M
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <Line
                                        percent={
                                          traningToken?.training_token_usage
                                            ? traningToken?.training_token_usage /
                                              100
                                            : 0
                                        }
                                        strokeWidth={2}
                                        trailWidth={2}
                                        strokeColor={"#9bb7c2"}
                                      />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center">
                                      <div className="progressBottomTxt">
                                        <span>330K </span> remaining
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 editSetting px-0 mt-4">
                                <Formik
                                  initialValues={initialValues}
                                  onSubmit={(value, resetForm) => {
                                    handleSubmit(value, resetForm);
                                  }}
                                  validationSchema={dpaValidationSchema}
                                >
                                  {({ values, touched, errors }) => {
                                    return (
                                      <Form>
                                        <div className="row mx-0">
                                          <div className="col-12 editsettingHeading fw-medium">
                                            Edit DPA Settings & Users
                                          </div>
                                          <div className="col-12 clickingEvent">
                                            All changes made has to be saved by
                                            clicking on the “Save Changes”
                                            button below.
                                          </div>
                                          <div className="col-12 px-0 mt-2">
                                            <div className="row mx-0 editGroup">
                                              <div className="col-xxl-8 px-0">
                                                <div className="row mx-0">
                                                  <div className="col-12">
                                                    <label for="">
                                                      DPA Name
                                                    </label>
                                                  </div>
                                                  <div className="col-12 inputGroup mb-xxl-4 mb-3">
                                                    <div className="input-group">
                                                      <Field
                                                        type="text"
                                                        id="exampleFormControlInput1"
                                                        name="name"
                                                        value={values?.name}
                                                        className="form-control shadow-none border-end-0 rounded-end-0 pe-sm-0"
                                                        placeholder="Workplace Relations"
                                                        aria-label="Workplace Relations"
                                                        aria-describedby="basic-addon1"
                                                      />
                                                      <span
                                                        className="input-group-text border-start-0 rounded-start-0 d-sm-block d-none"
                                                        id="basic-addon1"
                                                      >
                                                        (7 character left)
                                                      </span>
                                                    </div>
                                                    {touched.name &&
                                                    errors.name ? (
                                                      <ErrorMessage
                                                        name="name"
                                                        component={ErrorText}
                                                      />
                                                    ) : null}
                                                  </div>
                                                </div>
                                                <div className="row mx-0">
                                                  <div className="col-12">
                                                    <label for="">
                                                      DPA Description
                                                    </label>
                                                  </div>
                                                  <div className="col-12 inputGroup mb-xxl-4 mb-3">
                                                    <div className="input-group">
                                                      <Field
                                                        type="text"
                                                        name="description"
                                                        value={
                                                          values?.description
                                                        }
                                                        id="exampleFormControlInput1"
                                                        className="form-control shadow-none border-end-0 rounded-end-0 pe-sm-0"
                                                        placeholder="WR assistance for team members, trained with policies."
                                                        aria-label="WR assistance for team members, trained with policies."
                                                        aria-describedby="basic-addon1"
                                                      />
                                                      <span
                                                        className="input-group-text border-start-0 rounded-start-0 d-sm-block d-none"
                                                        id="basic-addon1"
                                                      >
                                                        (7 character left)
                                                      </span>
                                                    </div>
                                                    {touched.description &&
                                                    errors.description ? (
                                                      <ErrorMessage
                                                        name="description"
                                                        component={ErrorText}
                                                      />
                                                    ) : null}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-xxl-4 px-0 rightSide mt-xxl-0 mt-4">
                                                <div className="row mx-0 align-items-center">
                                                  <div className="col-12 form-label">
                                                    Select colour tag
                                                  </div>
                                                  <div className="col">
                                                    <Field
                                                      as="select"
                                                      name="color"
                                                      value={values?.color}
                                                      className="form-select shadow-none"
                                                      aria-label="Default select example"
                                                    >
                                                      <option selected>
                                                        Select Color
                                                      </option>
                                                      {SelectColors.map(
                                                        (el) => {
                                                          return (
                                                            <option
                                                              value={el.hex}
                                                              selected={
                                                                el.hex ==
                                                                values.color
                                                              }
                                                            >
                                                              {el.name}
                                                            </option>
                                                          );
                                                        }
                                                      )}
                                                    </Field>
                                                    {touched.color &&
                                                    errors.color ? (
                                                      <ErrorMessage
                                                        name="color"
                                                        component={ErrorText}
                                                      />
                                                    ) : null}
                                                  </div>
                                                  <div class="col-auto">
                                                    <Field
                                                      disabled
                                                      type="color"
                                                      name="color"
                                                      value={values?.color}
                                                      className="form-control colorPointer overflow-hidden p-0 shadow-none rounded-circle"
                                                    />
                                                  </div>

                                                  <div className="col-12 mt-3">
                                                    <div className="uploadFile d-flex align-items-center justify-content-between px-4 py-3">
                                                      <div className="content ">
                                                        <div className="fw-bold uploadheading">
                                                          Allow user file
                                                          upload?
                                                        </div>
                                                        <div className="fw-normal uploadcontent">
                                                          Admin will still have
                                                          to review and approve
                                                          the uploaded document
                                                          before DPA is trained.
                                                        </div>
                                                      </div>
                                                      <div className="form-check form-switch switchBtn">
                                                        <Field
                                                          type="checkbox"
                                                          name="allowToUpload"
                                                          className="form-check-input border-0 shadow-none"
                                                          role="switch"
                                                          id="flexSwitchCheckChecked"
                                                          value={
                                                            values.allowToUpload
                                                          }
                                                          checked={
                                                            String(
                                                              values?.allowToUpload
                                                            ) == "true"
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12 px-0 assignedUsersGroup mt-xxl-0 mt-4">
                                            <div className="row mx-0">
                                              <div className="col-12 assognedHeading mb-3">
                                                Assigned users
                                              </div>
                                              <div className="col-xxl-6 px-0">
                                                <div className="row mx-0">
                                                  <div className="col-xxl-8 col-md col-12 mb-md-0 mb-2 assignedwork">
                                                    Users assigned{" "}
                                                    {item?.dpa_name}
                                                  </div>
                                                  <div className="col-xxl-4 col-auto searchgroup">
                                                    <div className="input-group">
                                                      <input
                                                        type="search"
                                                        className="form-control shadow-none fw-normal border-0 rounded-pill rounded-end-0 bg-white"
                                                        placeholder="Search user"
                                                        aria-label="Username"
                                                        aria-describedby="basic-addon1"
                                                      />
                                                      <button
                                                        type="button"
                                                        className="input-group-text border-0 rounded-pill rounded-start-0 bg-white py-0 ps-0"
                                                        id="basic-addon1"
                                                      >
                                                        <img
                                                          src="assets/img/svg/032-search.svg"
                                                          alt=""
                                                        />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <div className="col-12 mt-3">
                                                    <DataTable
                                                      title={
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            lineHeight: "50px",
                                                            paddingRight:
                                                              "10px",
                                                            paddingLeft: "10px",
                                                            fontSize: "15px",
                                                            backgroundColor:
                                                              "#f6f8f9",
                                                            borderRadius:
                                                              "1.5em 1.5em 0 0",
                                                            alignItems:
                                                              "center",
                                                            textAlign: "center",
                                                            justifyContent:
                                                              "space-between",
                                                          }}
                                                        >
                                                          <p>User</p>
                                                          <p>DPA Usage</p>
                                                          <p>Action</p>
                                                        </div>
                                                      }
                                                      columns={columns}
                                                      data={usersdata}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-xxl-6 px-0 userAssign">
                                                <div className="row mx-0">
                                                  <div className="col-12 assognedHeading subHeading py-3 pt-xxl-4">
                                                    Assign users
                                                  </div>
                                                  <div className="col-12 px-0 usereventSection">
                                                    <div className="row mx-0 gy-3">
                                                      <div className="col-auto">
                                                        {usersdata?.map(
                                                          (el) => {
                                                            return (
                                                              <div
                                                                key={el.id}
                                                                className="userName text-white d-inline-flex align-items-center gap-3"
                                                              >
                                                                {el.username}{" "}
                                                                {el.name}
                                                                <span
                                                                  className="hovers"
                                                                  onClick={() =>
                                                                    handleRemoveUsers(
                                                                      el?.user_id,
                                                                      el?.id
                                                                    )
                                                                  }
                                                                >
                                                                  <img
                                                                    src="assets/img/svg/close.svg"
                                                                    className="h-100 "
                                                                    alt=""
                                                                  />
                                                                </span>
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="col-12 mt-3">
                                                    <div
                                                      className={`dropdown ${
                                                        open == "isopen"
                                                          ? "show"
                                                          : ""
                                                      }`}
                                                    >
                                                      <button
                                                        type="button"
                                                        className="btn dropdown-toggle eventBtn p-0 rounded-circle overflow-hidden shadow-none border-0"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        onClick={() => {
                                                          if (
                                                            open == "isopen"
                                                          ) {
                                                            setOPen("");
                                                          } else {
                                                            setOPen("isopen");
                                                          }
                                                        }}
                                                      >
                                                        <img
                                                          src="assets/img/svg/plus-circle.svg"
                                                          className="h-100"
                                                          alt=""
                                                        />
                                                      </button>
                                                      <ul
                                                        ref={myref}
                                                        className={`dropdown-menu border-0 w-100 p-0 ${
                                                          open == "isopen"
                                                            ? "show"
                                                            : ""
                                                        }`}
                                                        style={{
                                                          position: "absolute",
                                                          inset:
                                                            "0px auto auto 0px",
                                                          margin:
                                                            "40px 0  0 0px",
                                                          height: "300px",
                                                          overflow: "auto",
                                                          transform: `translate(
                                                            "42px",
                                                            "18px"
                                                          )`,
                                                        }}
                                                      >
                                                        <div className="row mx-0 gap-3 py-3 innerbody">
                                                          <div className="col-12 searchgroup">
                                                            <div className="input-group">
                                                              <button
                                                                type="button"
                                                                className="input-group-text border-0 rounded-pill rounded-end-0 ps-4"
                                                                id=""
                                                              >
                                                                <img
                                                                  src="assets/img/svg/Search-icon-Dark.svg"
                                                                  alt=""
                                                                />
                                                              </button>
                                                              <input
                                                                type="search"
                                                                onChange={(e) =>
                                                                  handleSearch(
                                                                    e
                                                                  )
                                                                }
                                                                onKeyPress={(
                                                                  e
                                                                ) => {
                                                                  if (
                                                                    e.key ===
                                                                    "Enter"
                                                                  ) {
                                                                    handleSearch(
                                                                      e
                                                                    );
                                                                  }
                                                                }}
                                                                className="form-control shadow-none fw-normal border-0 rounded-pill rounded-start-0"
                                                                placeholder="Search user"
                                                                aria-label="Username"
                                                                aria-describedby="basic-addon1"
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="col-12 userGroup">
                                                            {search
                                                              ? allAssignUsersFilter.map(
                                                                  (el) => {
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          el.id
                                                                        }
                                                                        className="row mx-0 align-items-center"
                                                                      >
                                                                        <div className="col d-flex align-items-center gap-3 usersInfo">
                                                                          <div className="userImg rounded-circle overflow-hidden">
                                                                            <img
                                                                              src="assets/img/Avatar.png"
                                                                              alt=""
                                                                              className="w-100"
                                                                            />
                                                                          </div>{" "}
                                                                          {
                                                                            el.name
                                                                          }
                                                                        </div>
                                                                        <div className="col-auto">
                                                                          <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                              handleAssignUsers(
                                                                                el
                                                                              )
                                                                            }
                                                                            className="btn assignBtn rounded-pill text-black border-0 d-flex align-items-center text-white"
                                                                          >
                                                                            Assign
                                                                          </button>
                                                                        </div>
                                                                      </div>
                                                                    );
                                                                  }
                                                                )
                                                              : allAssignUsers.map(
                                                                  (el) => {
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          el.id
                                                                        }
                                                                        className="row mx-0 align-items-center"
                                                                      >
                                                                        <div className="col d-flex align-items-center gap-3 usersInfo">
                                                                          <div className="userImg rounded-circle overflow-hidden">
                                                                            <img
                                                                              src="assets/img/Avatar.png"
                                                                              alt=""
                                                                              className="w-100"
                                                                            />
                                                                          </div>{" "}
                                                                          {
                                                                            el.name
                                                                          }
                                                                        </div>
                                                                        <div className="col-auto">
                                                                          <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                              handleAssignUsers(
                                                                                el
                                                                              )
                                                                            }
                                                                            className="btn assignBtn rounded-pill text-black border-0 d-flex align-items-center text-white"
                                                                          >
                                                                            Assign
                                                                          </button>
                                                                        </div>
                                                                      </div>
                                                                    );
                                                                  }
                                                                )}
                                                          </div>
                                                        </div>
                                                      </ul>
                                                    </div>
                                                  </div>
                                                  {error ||
                                                  !assignUsers.length ? (
                                                    <p className="pt-2 text-danger">
                                                      {error}
                                                    </p>
                                                  ) : null}
                                                  <div className="col-12 btnGroup px-0 mt-5">
                                                    <div className="row mx-0 gy-3">
                                                      <NavLink
                                                        to={"/dpa-managemant"}
                                                        className="col-auto text-dec"
                                                      >
                                                        <button
                                                          type="button"
                                                          className="btn cancleBtn d-flex align-items-center justify-content-center text-white"
                                                        >
                                                          Cancel
                                                        </button>
                                                      </NavLink>
                                                      <div className="col-auto">
                                                        <button
                                                          type="submit"
                                                          className="btn saveChangeBtn border-0 d-flex align-items-center justify-content-center text-white"
                                                        >
                                                          <span className="d-flex">
                                                            <img
                                                              src="assets/img/svg/shield-cross.svg"
                                                              className="h-100"
                                                              alt=""
                                                            />
                                                          </span>{" "}
                                                          Save Changes
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Form>
                                    );
                                  }}
                                </Formik>
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
        type={"Deleting DPA"}
        modelOpen={modelOpen}
        setModelOpen={setModelOpen}
        hanldeFunction={handleDeleteDpa}
      />
    </main>
  );
};

export default DPASettings;
