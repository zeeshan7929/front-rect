import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import { Line } from "rc-progress";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { postData } from "../../Common/fetchservices";
import * as Yup from "yup";
import { ErrorText } from "../../Common/Others/ErrorText";
import "react-toastify/dist/ReactToastify.css";
import { toaster } from "../../Common/Others/Toaster";
import { SelectColors } from "../../Common/Others/SelectColors";
import { useOnClickOutside } from "../../Common/Others/useOnClickOutside";
import { CountConverter } from "../../Common/Others/CountConverter";
import { Navigate } from "react-router-dom";

const CreateNewDpa = ({ sideBar, setSidebarOpen }) => {
  let clientId = JSON.parse(localStorage.getItem("a_login"));
  const myref = useRef(null);
  const [initialValues, setInitialValus] = useState({
    name: "",
    description: "",
    colour: "",
    allowToUpload: "",
  });
  const [assignedUser, setAssignedUser] = useState([]);
  const [allAssignUsers, setAllAssignUsers] = useState([]);
  const [allAssignUsersFilter, setAllAssignUsersFilter] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tierInfo,setTierInfo] = useState([])
  const [dpaCount, setDpaCount] = useState(0);
  const [totalDpa, setTotalDpa] = useState(0);
  const [uploadDoc, setUploadDoc] = useState(0);
  const [tokenUsage, setTokenUsage] = useState(0);
  const [totalTokenLimit, setTotalTokenLimit] = useState(0);

  const handlefilterUser = () => {
    let fill = allAssignUsers?.filter((el) =>
      el?.name.toLowerCase().includes(search.toLowerCase())
    );
    if (fill.length || search) {
      setAllAssignUsersFilter(fill);
    } else {
      setAllAssignUsersFilter(allAssignUsers);
    }
  };

  const handleAssignUser = (el) => {
    if (!assignedUser.find((item) => item.id == el.id)) {
      setAssignedUser([...assignedUser, el]);
    }
  };
  const handleRemoveUser = (value) => {
    let fill = assignedUser.filter((el) => el !== value);
    setAssignedUser(fill);
  };

  const getAllUserForAssign = async () => {
    const body = {
      client_id: clientId?.client_id,
    };
    let re = await postData("get_client_all_users", body);
    setAllAssignUsers(re.result);
    setAllAssignUsersFilter(re.result);
    const res55 = await postData("get_client_tier_info", body);
    setTierInfo(res55.result);
    const res = await postData("get_client_assign_dpa", body);
    setTotalDpa(
      res?.result.assign_dpa_count ? res?.result.assign_dpa_count : 0
    );
    const res1 = await postData("get_client_created_dpa", body);
    setDpaCount(
      res1?.result.created_dpa_count ? res1?.result.created_dpa_count : 0
    );
    const res3 = await postData("get_client_uploaded_documents", body);
    setUploadDoc(res3.result.length ? res3.result.length : 0);
    const res4 = await postData("get_client_training_token_usage", body);
    setTokenUsage(
      res4.result?.training_token_usage ? res4?.result?.training_token_usage : 0
    );
  };

  const handleSubmit = async (value, { resetForm }) => {
    const body = {
      client_id: clientId?.client_id,
      dpa_name: value.name,
      dpa_description: value.description,
      dpa_color: value.colour,
      allow_files: value.allowToUpload[0] === "yes" ? "true" : "false",
      users: assignedUser.map((el) => el.id),
    };
    if (assignedUser.length === 0) {
      setError("Atleast 1 user is required !");
    } else {
      let res = await postData("add_new_dpa", body);
      if (res.result === "success") {
        toaster(true, "Success");
        window.history.back();
        // resetForm();
        // setAssignedUser([]);
        
      } else {
        toaster(false, "Something went wrong");
      }
    }
  };

  const autoClose = () => {
    setIsOpen("");
  };
  useOnClickOutside(myref, autoClose);

  const dpaValidationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Required"),
    description: Yup.string()
      .min(2, "Too Short!")
      .max(60, "Description must be less than 60 charecter !")
      .required("Required"),
    colour: Yup.string().required("Required"),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const getAssignDpa = async () => {
    const body = {
      client_id: clientId.client_id,
      user_id: String(clientId.user_id),
    };
    const res = await postData("get_user_assign_token_limit", body);
    setTotalTokenLimit(
      Number(
        res.result.user_assign_token_limit
          ? res.result.user_assign_token_limit
          : 0
      )
    );
  };
  useEffect(() => {
    handlefilterUser();
  }, [search]);

  useEffect(() => {
    getAssignDpa();
    getAllUserForAssign();
    addBlurClass();
  }, []);

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
                                textHeader={"Create New DPA"}
                                textSubHeader={
                                  " you can find all information you require here."
                                }
                              />
                            </div>
                            <div className="row py-3">
                              <div className="col-12">
                                <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                  <div className="col pageHeading px-0">
                                    Create New DPA
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
                                            {dpaCount}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/grid.svg"
                                              alt
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
                                            {uploadDoc}
                                          </div>
                                          <div className="dashboardIcon">
                                            <img
                                              src="assets/img/svg/traineddata.svg"
                                              alt
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
                                              alt
                                            />{" "}
                                            Trained Data
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="row">
                                            <div className="col">
                                              <div className="progressBarTxt d-flex align-items-center">
                                                <div className="percent">
                                                  {((Number(tokenUsage) /
                                                    Number(tierInfo.training_tokens)) *
                                                    100).toFixed()}%
                                                </div>
                                                <span>used</span>
                                              </div>
                                            </div>
                                            <div className="col-auto">
                                              <div className="progressBarTxt1">
                                                {CountConverter(
                                                  Number(tierInfo.training_tokens)
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          {/* <div
                                            className="progress progressBar"
                                            role="progressbar"
                                            aria-label="Basic example"
                                            aria-valuenow={25}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                          >
                                            <div
                                              className="progress-bar progressBar1"
                                              style={{ width: "67%" }}
                                            />
                                          </div> */}
                                          <Line
                                            percent={(
                                              (tokenUsage / Number(tierInfo.training_tokens)) *
                                              100
                                            ).toFixed()}
                                            strokeWidth={1.5}
                                            trailWidth={1.5}
                                            strokeColor="#9bb7c2"
                                          />
                                        </div>
                                        <div className="col-12 d-flex justify-content-center">
                                          <div className="progressBottomTxt">
                                            <span>
                                              {CountConverter(
                                                Number(tierInfo.training_tokens) - tokenUsage
                                              )}
                                            </span>{" "}
                                            remaining
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Formik
                              initialValues={initialValues}
                              onSubmit={(value, resetForm) =>
                                handleSubmit(value, resetForm)
                              }
                              validationSchema={dpaValidationSchema}
                            >
                              {({ errors, touched, values }) => {
                                return (
                                  <Form>
                                    <div className="row createHeroSection">
                                      <div className="col-12">
                                        <div className="creteHead">
                                          Create new DPA
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="creteSubHead">
                                          You have {totalDpa - dpaCount} out of {totalDpa} DPAs left.
                                        </div>
                                      </div>
                                      <div className="col-12 position-relative mb-2">
                                        <Field
                                          type="text"
                                          className="form-control createInp"
                                          name="name"
                                          id
                                          maxLength={25}
                                          placeholder="Name of DPA"
                                        />
                                        <span className="createSpan d-sm-block d-none">
                                          (25 character limit)
                                        </span>
                                      </div>
                                      {touched.name && errors.name ? (
                                        <ErrorMessage
                                          name="name"
                                          component={ErrorText}
                                        />
                                      ) : null}
                                      <div className="col-12 position-relative">
                                        <Field
                                          type="text"
                                          className="form-control createInp pt-2 pb-2"
                                          name="description"
                                          id
                                          maxLength={60}
                                          placeholder="Description of DPA"
                                        />
                                        <span className="createSpan d-sm-block d-none">
                                          (60 character limit)
                                        </span>
                                      </div>
                                      {touched.description &&
                                      errors.description ? (
                                        <ErrorMessage
                                          name="description"
                                          component={ErrorText}
                                        />
                                      ) : null}
                                      <div className="col-12 py-sm-5 py-3">
                                        <div className="row">
                                          <div className="col-xxl-6 col-12">
                                            <div className="row">
                                              <div className="col-12 mb-1">
                                                <div className="createSelectTxt">
                                                  Select colour tag
                                                </div>
                                              </div>
                                              <div className="col-12 d-flex align-items-center">
                                                <div className="col me-2">
                                                  <Field
                                                    as="select"
                                                    name="colour"
                                                    className="form-select createSelectBox"
                                                    aria-label="Default select example"
                                                  >
                                                    <option selected>
                                                      Select colour
                                                    </option>

                                                    {SelectColors.map((el) => {
                                                      return (
                                                        <option
                                                          key={Math.random()}
                                                          value={el.hex}
                                                        >
                                                          {el.name}
                                                        </option>
                                                      );
                                                    })}
                                                  </Field>
                                                  {touched.colour &&
                                                  errors.colour ? (
                                                    <ErrorMessage
                                                      name="colour"
                                                      component={ErrorText}
                                                    />
                                                  ) : null}
                                                </div>

                                                <div className="col-auto">
                                                  <span
                                                    className="selectColour"
                                                    style={{
                                                      backgroundColor:
                                                        values.colour,
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-xxl-6 col-12 pt-3 pt-xxl-0">
                                            <div className="uploadSection">
                                              <div className="row align-items-center">
                                                <div className="col">
                                                  <div className="uploadSectionHead">
                                                    Allow user file upload?
                                                  </div>
                                                  <div className="para">
                                                    Admin will still have to
                                                    review and approve the
                                                    uploaded document before DPA
                                                    is trained.
                                                  </div>
                                                </div>
                                                <div className="col-auto">
                                                  <Field
                                                    type="checkbox"
                                                    name="allowToUpload"
                                                    value="yes"
                                                    defaultChecked={
                                                      values.allowToUpload ==
                                                      "true"
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="asignUsers">
                                          Assign users
                                        </div>
                                      </div>
                                      <div
                                        ref={myref}
                                        className="col-12 align-items-center d-flex"
                                      >
                                        {assignedUser.map((el) => {
                                          return (
                                            <div
                                              key={Math.random()}
                                              className="asignUsersBtn align-items-center d-flex "
                                            >
                                              {el.name}

                                              <i
                                                className="bi bi-x fs-4 ms-2 hovers"
                                                onClick={() =>
                                                  handleRemoveUser(el)
                                                }
                                              ></i>
                                            </div>
                                          );
                                        })}

                                        <div
                                          className={`dropdown plusDropdown ${
                                            isOpen == "show" ? "show" : ""
                                          }`}
                                        >
                                          <button
                                            type="button"
                                            className={`btn dropdown-toggle eventBtn p-0 rounded-circle overflow-hidden shadow-none border-0 ${
                                              isOpen ? "show" : ""
                                            }`}
                                            aria-expanded={
                                              isOpen ? "true" : "false"
                                            }
                                            onClick={() => {
                                              setIsOpen((prev) => !prev);
                                            }}
                                          >
                                            <img
                                              src="assets/img/svg/plus-circle.svg"
                                              className="h-100"
                                              alt
                                            />
                                          </button>
                                          <ul
                                            className={`dropdown-menu border-0 w-100 p-0 ${
                                              isOpen ? "show" : ""
                                            }`}
                                            style={{
                                              position: "absolute",
                                              inset: "0px auto auto 0px",
                                              margin: "40px 0  0 0px",
                                              height: "300px",
                                              overflow: "auto",
                                              transform: `translate(
                                                "42px",
                                                "18px"
                                              )`,
                                            }}
                                            data-popper-placement="bottom-start"
                                          >
                                            <div className="row mx-0 gap-3 py-3 innerbody">
                                              <div className="col-12 searchgroup">
                                                <div className="input-group">
                                                  <button
                                                    type="button"
                                                    className="input-group-text border-0 rounded-pill rounded-end-0 ps-4"
                                                    id
                                                  >
                                                    <img
                                                      src="assets/img/svg/Search-icon-Dark.svg"
                                                      alt
                                                    />
                                                  </button>
                                                  <input
                                                    type="search"
                                                    onChange={(e) =>
                                                      handleSearch(e)
                                                    }
                                                    onKeyPress={(e) => {
                                                      if (e.key === "Enter") {
                                                        handleSearch(e);
                                                      }
                                                    }}
                                                    className="form-control shadow-none fw-normal border-0 rounded-pill rounded-start-0"
                                                    placeholder="Search user"
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                  />
                                                </div>
                                              </div>
                                              {allAssignUsersFilter?.map(
                                                (el) => {
                                                  return (
                                                    <div
                                                      key={Math.random()}
                                                      className="col-12 userGroup"
                                                    >
                                                      <div className="row mx-0 align-items-center">
                                                        <div className="col d-flex align-items-center gap-3 usersInfo">
                                                          <div className="userImg rounded-circle overflow-hidden">
                                                            <img
                                                              src="assets/img/Avatar.png"
                                                              alt
                                                              className="w-100"
                                                            />
                                                          </div>
                                                          {el.name}
                                                        </div>
                                                        <div className="col-auto">
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleAssignUser(
                                                                el
                                                              )
                                                            }
                                                            className="btn assignBtn rounded-pill text-black border-0 d-flex align-items-center text-white"
                                                          >
                                                            Assign
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </ul>
                                        </div>
                                      </div>
                                      {error || !assignedUser.length ? (
                                        <p className="pt-2 text-danger">
                                          {error}
                                        </p>
                                      ) : null}
                                      <div className="col-12 d-flex align-items-center py-5 justify-content-center">
                                        <button
                                          className="cancleBtn me-3"
                                          onClick={() => window.history.back()}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          className="closeBtn"
                                          type="submit"
                                        >
                                          <img
                                            src="assets/img/svg/createdpa.svg"
                                            alt
                                          />
                                          Create new DPA
                                        </button>
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

export default CreateNewDpa;
