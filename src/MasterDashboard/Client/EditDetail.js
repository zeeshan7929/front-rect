import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Common/Header/Header";
import { RightSidebar } from "../../clientDashboard/Common/Sidebar/RightSidebar";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Country, State } from "country-state-city";
import Select from "react-select";
import * as yup from "yup";
import { ErrorText } from "../../clientDashboard/Common/Others/ErrorText";
import { postData } from "../../clientDashboard/Common/fetchservices";
import Modal from "../../clientDashboard/Common/Modal";
import { toaster } from "../../clientDashboard/Common/Others/Toaster";
function EditDetail({ sideBar, setSidebarOpen }) {
  const formRef = useRef();
  const ref = useRef();
  const location = useLocation();
  let user = location?.state?.user;
  let userInfo = location?.state?.userInfo;
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [right, setright] = useState([]);

  const navigate = useNavigate();
  const countries = Country.getAllCountries();
  const updateCountries = countries?.map((country) => ({
    label: country?.name,
    value: country?.isoCode,
    ...country,
  }));

  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state?.name,
      value: state?.isoCode,
      ...state,
    }));

  const handleSubmit = async () => {
    const initial = ref?.current?.values;
    let countryCode = updateCountries.filter((el) => {
      return el.name == initial?.country;
    });
    let countryCode1 = updateCountries.filter((el) => {
      return el.name == initial?.country?.name;
    });
    let stateCode = State?.getStatesOfCountry(countryCode[0]?.isoCode).filter(
      (el) => {
        return el.name == initial?.state;
      }
    );
    let stateCode1 = State?.getStatesOfCountry(
      initial?.state?.countryCode
    ).filter((el) => {
      return el.name == initial?.state?.name;
    });
    const body = {
      client_id: user?.client_id,
      name: initial?.company_name,
      phone: initial?.company_contact,
      website: initial?.company_website,
      industry: initial?.industry,
      country: countryCode[0]?.name
        ? countryCode[0]?.name
        : countryCode1[0]?.name,
      state: stateCode[0]?.name ? stateCode[0]?.name : stateCode1[0]?.name,
      address: initial?.street,
      zip_code: initial?.zip_code,
    };
    const res = await postData("update_client_info", body);
    if (res.result) {
      setOpen("");
      toaster(true, "SuccessFul Update");
      setTimeout(() => {
        navigate("/edit", { state: { item: user?.client_id } });
      }, 2000);
    } else {
      toaster(false, "Fields are Empty");
    }
  };

  const infoValidation = yup.object().shape({
    company_name: yup.string().required("Required!"),
    company_contact: yup.string().required("Required!"),
    company_website: yup.string().required("Required!"),
    industry: yup.string().required("Required!"),
    country: yup.mixed().required("Required!"),
    state: yup.mixed().required("Required!"),
    street: yup.string().required("Required !"),
    zip_code: yup
      .string()
      .required("Required!")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(5, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
  });

  const handleUpdateRep = async () => {
    const initial = formRef?.current?.values;
    const body = {
      user_id: String(user?.id),
      email: initial?.email,
      name: initial?.name,
      role: initial?.option,
    };
    const res = await postData("update_representative_info", body);
    if (res.result) {
      setOpen1("");
      toaster(true, "SuccessFul Update");
      setTimeout(() => {
        navigate("/edit", { state: { item: user?.client_id } });
      }, 2000);
    }
  };

  const updateValidation = yup.object().shape({
    name: yup.string().required("Required!"),
    email: yup.string().required("Required!"),
    option: yup.string().required("Required!"),
  });

  const handleDeleteUser = async () => {
    const body = {
      client_id: String(user?.client_id),
    };
    const res = await postData("m_delete_client", body);
    if (res?.result) {
      setOpen3("");
      toaster(true, "Success");
      setTimeout(() => {
        localStorage.removeItem("a_login");
        navigate("/client");
      }, 2000);
    }
  };

  const handleUpgradeTier = async () => {
    const res = await postData("m_get_all_tiers_info");
    setright(res.result);
  };
  useEffect(() => {
    handleUpgradeTier();
  }, []);
  return (
    <>
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
                    <Sidebar setSidebarOpen={setSidebarOpen} />
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
                                  title={" Client’s Profile"}
                                  setSidebarOpen={setSidebarOpen}
                                />
                              </div>
                              <div className="row mx-0 justify-content-center h-100 flex-fill overflow-hidden">
                                <div className="col-xxl-8 h-100">
                                  <div className="row py-3 overflow-hidden-auto h-100">
                                    <div className="col-12 px-0">
                                      <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                        <div className="col pageHeading px-0">
                                          Client’s Profile
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-12">
                                          <button
                                            className="backBtn"
                                            onClick={() => navigate("/edit")}
                                          >
                                            <img
                                              src="./../assets/img/svg/leftarrow.svg"
                                              alt=""
                                            />
                                            Back
                                          </button>
                                        </div>
                                        <div className="col-12">
                                          <div className="cavastirSection">
                                            <div className="row">
                                              <div className="col-12">
                                                <div className="cavastirSectionHeading">
                                                  {userInfo?.name}
                                                </div>
                                              </div>
                                              <div className="col-12">
                                                <div className="row align-items-center">
                                                  <div className="col-sm col-12 d-flex align-items-center">
                                                    <div className="cavastirSectionSubHeading">
                                                      Contact Representative:{" "}
                                                      {user?.name}
                                                    </div>
                                                  </div>
                                                  <div className="col-sm-auto col-12 mt-2 mt-sm-0 d-flex justify-content-center me-4">
                                                    {/* <!-- <button className="editBtn"><img src="./../assets/img/svg/edit.svg" alt="">Edit Details</button> --> */}
                                                  </div>
                                                </div>
                                                <div className="row align-items-center">
                                                  <div className="col-sm col-12 d-flex align-items-center">
                                                    <div className="cavastirSectionSubHeading">
                                                      Contact Email:
                                                      {user?.email}
                                                    </div>
                                                  </div>
                                                  <div className="col-sm-auto col-12 mt-2 mt-sm-0d-flex justify-content-end">
                                                    <button
                                                      onClick={() =>
                                                        setOpen3(true)
                                                      }
                                                      className="deleteBtn"
                                                    >
                                                      <img
                                                        src="./../assets/img/svg/deleteshape.svg"
                                                        alt=""
                                                      />
                                                      Delete Client
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row pb-3">
                                        <div className="col-12">
                                          <div className="companyInfoForm">
                                            <Formik
                                              innerRef={ref}
                                              initialValues={{
                                                company_name: userInfo?.name
                                                  ? userInfo?.name
                                                  : "",
                                                company_contact: userInfo?.phone
                                                  ? userInfo?.phone
                                                  : "",
                                                company_website:
                                                  userInfo?.website
                                                    ? userInfo?.website
                                                    : "",
                                                industry: userInfo?.industry
                                                  ? userInfo?.industry
                                                  : "",
                                                country: userInfo?.country
                                                  ? userInfo?.country
                                                  : "",
                                                state: "",
                                                street: "",
                                                zip_code: "",
                                              }}
                                              validationSchema={infoValidation}
                                            >
                                              {({
                                                errors,
                                                values,
                                                setValues,
                                                handleChange,
                                                handleBlur,
                                                touched,
                                              }) => {
                                                return (
                                                  <Form>
                                                    <div className="row">
                                                      <div className="col-12">
                                                        <div className="companyInfoFormHead">
                                                          Update Company Info
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <div className="companyInfoFormSubHead">
                                                          Only edit the fields
                                                          you want to & click
                                                          update
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <div className="companyImg position-relative">
                                                          <img
                                                            src="./../assets/img/logo/Logo.svg"
                                                            alt=""
                                                          />
                                                          <input
                                                            type="file"
                                                            className="d-none"
                                                            id="companyImg"
                                                          />
                                                          <label
                                                            for="companyImg"
                                                            className="changeCompanyIcon"
                                                          >
                                                            <img
                                                              src="./../assets/img/svg/editcircle.svg"
                                                              alt="edit icon"
                                                            />
                                                          </label>
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor="company_name"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          Company Name
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          name="company_name"
                                                          value={
                                                            values?.company_name
                                                          }
                                                          className="companyInfoFormInp form-control"
                                                          id="company_name"
                                                          placeholder="Company X"
                                                        />
                                                      </div>
                                                      {errors.company_name &&
                                                      touched.company_name ? (
                                                        <ErrorMessage
                                                          name="company_name"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor="company_contact"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          Company Contact Number
                                                          title
                                                        </label>
                                                        <Field
                                                          type="number"
                                                          maxLength="10"
                                                          className="companyInfoFormInp form-control"
                                                          name="company_contact"
                                                          id="company_contact"
                                                          value={
                                                            values?.company_contact
                                                          }
                                                          placeholder="836759230"
                                                        />
                                                      </div>
                                                      {errors.company_contact &&
                                                      touched.company_contact ? (
                                                        <ErrorMessage
                                                          name="company_contact"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor="company_website"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          Company Website URL
                                                        </label>
                                                        <Field
                                                          type="url"
                                                          className="companyInfoFormInp form-control"
                                                          name="company_website"
                                                          id="company_website"
                                                          value={
                                                            values?.company_website
                                                          }
                                                          placeholder="companyx.com"
                                                        />
                                                      </div>
                                                      {errors.company_website &&
                                                      touched.company_website ? (
                                                        <ErrorMessage
                                                          name="company_website"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor="industry"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          Industry
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="companyInfoFormInp form-control"
                                                          name="industry"
                                                          id="industry"
                                                          value={
                                                            values?.industry
                                                          }
                                                          placeholder="Technology"
                                                        />
                                                      </div>
                                                      {errors.industry &&
                                                      touched.industry ? (
                                                        <ErrorMessage
                                                          name="industry"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12 mt-2">
                                                        <label
                                                          htmlFor="country"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          Country
                                                        </label>
                                                        <Select
                                                          styles={{
                                                            control: (
                                                              baseStyles
                                                            ) => ({
                                                              ...baseStyles,
                                                              border:
                                                                "1px solid #e0e0e0",
                                                              width: "100%",
                                                              height: "60px",
                                                              borderRadius:
                                                                "18px",
                                                              paddingLeft:
                                                                "12px",
                                                              marginBottom:
                                                                "2rem",
                                                            }),
                                                          }}
                                                          id="country"
                                                          name="country"
                                                          label="country"
                                                          placeholder="Choose country"
                                                          defaultInputValue={
                                                            values?.country
                                                          }
                                                          options={
                                                            updateCountries
                                                          }
                                                          value={values.country}
                                                          onChange={(value) => {
                                                            setValues(
                                                              {
                                                                company_name:
                                                                  values?.company_name,
                                                                company_contact:
                                                                  values?.company_contact,
                                                                company_website:
                                                                  values?.company_website,
                                                                industry:
                                                                  values?.industry,
                                                                country:
                                                                  value.name,
                                                                state:
                                                                  values?.state,
                                                                street:
                                                                  values?.street,
                                                                zip_code:
                                                                  values?.zip_code,
                                                              },
                                                              false
                                                            );
                                                            let event = {
                                                              target: {
                                                                name: "country",
                                                                value: value,
                                                              },
                                                            };
                                                            handleChange(event);
                                                          }}
                                                          onBlur={() => {
                                                            handleBlur({
                                                              target: {
                                                                name: "country",
                                                              },
                                                            });
                                                          }}
                                                        />
                                                      </div>
                                                      {errors.country &&
                                                      touched.country ? (
                                                        <ErrorMessage
                                                          name="country"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor
                                                          className="formLbl"
                                                        >
                                                          State
                                                        </label>
                                                        <Select
                                                          styles={{
                                                            control: (
                                                              baseStyles
                                                            ) => ({
                                                              ...baseStyles,
                                                              border:
                                                                "1px solid #e0e0e0",
                                                              width: "100%",
                                                              height: "60px",
                                                              borderRadius:
                                                                "18px",
                                                              paddingLeft:
                                                                "12px",
                                                              marginBottom:
                                                                "2rem",
                                                            }),
                                                          }}
                                                          id="state"
                                                          name="state"
                                                          placeholder="Choose State"
                                                          // defaultInputValue={
                                                          //   fill1[3]?.name
                                                          // }
                                                          options={updatedStates(
                                                            values.country
                                                              ? values.country
                                                                  .value
                                                              : null
                                                          )}
                                                          value={values.state}
                                                          onChange={(value) => {
                                                            setValues(
                                                              {
                                                                country:
                                                                  values.country,
                                                                state:
                                                                  value.name,
                                                                company_name:
                                                                  values?.company_name,
                                                                company_contact:
                                                                  values?.company_contact,
                                                                company_website:
                                                                  values?.company_website,
                                                                industry:
                                                                  values?.industry,
                                                                street:
                                                                  values?.street,
                                                                zip_code:
                                                                  values?.zip_code,
                                                              },
                                                              false
                                                            );
                                                            let event = {
                                                              target: {
                                                                name: "state",
                                                                value: value,
                                                              },
                                                            };
                                                            handleChange(event);
                                                          }}
                                                          onBlur={() => {
                                                            handleBlur({
                                                              target: {
                                                                name: "state",
                                                              },
                                                            });
                                                          }}
                                                        />
                                                      </div>
                                                      {errors.state &&
                                                      touched.state ? (
                                                        <ErrorMessage
                                                          name="state"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor="street"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          Street Address
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="companyInfoFormInp form-control"
                                                          name="street"
                                                          id="street"
                                                          value={values?.street}
                                                          placeholder="1 Beaver Rd"
                                                        />
                                                      </div>
                                                      {errors.street &&
                                                      touched.street ? (
                                                        <ErrorMessage
                                                          name="street"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <label
                                                          htmlFor="zip_code"
                                                          className="companyInfoFormLbl"
                                                        >
                                                          ZIP Code
                                                        </label>
                                                        <Field
                                                          type="number"
                                                          className="companyInfoFormInp form-control"
                                                          name="zip_code"
                                                          id="zip_code"
                                                          value={
                                                            values?.zip_code
                                                          }
                                                          placeholder="1 Beaver Rd"
                                                        />
                                                      </div>
                                                      {errors.zip_code &&
                                                      touched.zip_code ? (
                                                        <ErrorMessage
                                                          name="zip_code"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}

                                                      <div className="col-12 d-flex justify-content-center">
                                                        <button
                                                          type="submit"
                                                          onClick={() =>
                                                            setOpen(true)
                                                          }
                                                          className="updateBtn"
                                                        >
                                                          Update Company Info
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
                                      <Formik
                                        innerRef={formRef}
                                        initialValues={{
                                          name: user?.name ? user?.name : "",
                                          email: user?.email ? user?.email : "",
                                          option: user?.role ? user?.role : "",
                                        }}
                                        validationSchema={updateValidation}
                                      >
                                        {({ errors, values, touched }) => {
                                          return (
                                            <Form>
                                              <div className="row py-3">
                                                <div className="col-12">
                                                  <div className="updateBox">
                                                    <div className="row">
                                                      <div className="col-12">
                                                        <div className="updateBoxHead">
                                                          Update Representative
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <div className="updateBoxSubHead">
                                                          The new representative
                                                          has to be an admin.
                                                        </div>
                                                      </div>
                                                      <div className="col-12 mb-3">
                                                        <Field
                                                          type="text"
                                                          name="name"
                                                          id="name"
                                                          value={values.name}
                                                          className="form-control updateInp"
                                                          placeholder="John Doe"
                                                        />
                                                      </div>
                                                      {errors.name &&
                                                      touched.name ? (
                                                        <ErrorMessage
                                                          name="name"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}

                                                      <div className="col-12 mb-4">
                                                        <Field
                                                          type="email"
                                                          name="email"
                                                          id="email"
                                                          value={values.email}
                                                          className="form-control updateInp"
                                                          placeholder="John@companyx.com"
                                                        />
                                                      </div>
                                                      {errors.email &&
                                                      touched.email ? (
                                                        <ErrorMessage
                                                          name="email"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12">
                                                        <div className="settingSelectTop position-relative d-flex justify-content-between align-items-center">
                                                          <div className="settingSelectTopTxt">
                                                            New Company
                                                            Representative
                                                          </div>
                                                          <input
                                                            type="text"
                                                            className="SelectInp"
                                                            name=""
                                                            id=""
                                                            placeholder="Search User"
                                                          />
                                                          <div className="searchImg">
                                                            <img
                                                              className=""
                                                              src="./../assets/img/svg/search.svg"
                                                              alt=""
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="col-12 mt-2">
                                                        <Field
                                                          as="select"
                                                          name="option"
                                                          id="option"
                                                          className="form-select updateSelect"
                                                          aria-label="Default select example"
                                                        >
                                                          <option disabled>
                                                            Select an Admin
                                                          </option>
                                                          <option
                                                            value="admin"
                                                            selected={
                                                              values?.option ==
                                                              "admin"
                                                                ? true
                                                                : ""
                                                            }
                                                          >
                                                            Admin
                                                          </option>
                                                          <option
                                                            value="user"
                                                            selected={
                                                              values?.option ==
                                                              "user"
                                                                ? true
                                                                : ""
                                                            }
                                                          >
                                                            User
                                                          </option>
                                                        </Field>
                                                      </div>
                                                      {errors.option &&
                                                      touched.option ? (
                                                        <ErrorMessage
                                                          name="option"
                                                          component={ErrorText}
                                                        />
                                                      ) : null}
                                                      <div className="col-12 d-flex justify-content-center">
                                                        <button
                                                          type="submit"
                                                          className="updateBtn"
                                                          onClick={() =>
                                                            setOpen1(true)
                                                          }
                                                        >
                                                          Update Representative{" "}
                                                        </button>
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
                                <RightSidebar
                                  sideBar={sideBar}
                                  setSidebarOpen={setSidebarOpen}
                                  tiers={right}
                                  id={user?.id}
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
      </main>
      {/* model */}
      <Modal
        type={
          open3
            ? "Deleting User"
            : open1
            ? "Update Representative"
            : "Update Company Info"
        }
        modelOpen={open3 ? open3 : open1 ? open1 : open}
        setModelOpen={open3 ? setOpen3 : open1 ? setOpen1 : setOpen}
        hanldeFunction={
          open3 ? handleDeleteUser : open1 ? handleUpdateRep : handleSubmit
        }
      />
    </>
  );
}

export default EditDetail;
