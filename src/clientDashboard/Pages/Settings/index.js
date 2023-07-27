import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { RightSidebar } from "../../Common/Sidebar/RightSidebar";
import * as yup from "yup";
import * as Yup from "yup";
import { postData } from "../../Common/fetchservices";
import { Form, Formik, Field } from "formik";
import { SelectCountries } from "../../Common/Others/SelectCountry";
import { ToastContainer, toast } from "react-toastify";
import { toaster } from "../../Common/Others/Toaster";
import { Country, State } from "country-state-city";
import Select from "react-select";
import Modal from "../../Common/Modal";
import { useNavigate, useLocation } from "react-router-dom";
const Settings = ({ sideBar, setSidebarOpen }) => {
  const countries = Country.getAllCountries();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [userDetails,setUserDetails] = useState([]);
  const [admins,setAdmins] = useState([]);
  const [clientInfo,setClientInfo] = useState([]);
  const location = useLocation();
  let c_info = location?.state.c_info;
  
  const formRef = useRef();
  const ref = useRef();
  const details = JSON.parse(localStorage.getItem("details"));
  const updatedetails = JSON.parse(localStorage.getItem("updatedetails"));
  const updatephone = JSON.parse(localStorage.getItem("updatephone"));
  const [logo,setLogo] = useState("");
  const ids = JSON.parse(localStorage.getItem("a_login"))
  
  const countrydata = countries?.map((el) => ({
    label: el?.name,
    value: el?.isoCode,
    ...el,
  }));
  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state?.name,
      value: state?.isoCode,
      ...state,
    }));

  
  const user_details = async ()=>{
    const body = {
      client_id:ids?.client_id,
      user_id:String(ids?.user_id)
    }
    const res = await postData("get_user_info", body);
    console.log(res.result)
    setUserDetails(res.result)

    const ad = await postData('get_client_all_role_users',body)
    setAdmins(ad.result)

    const cInfo = await postData('get_client_info',body);
    setClientInfo(cInfo.result);
    setInitialValue(cInfo.result);
    get_base64_image(cInfo.result.logo_path);
    
  }
  let get_base64_image =  async(image) =>{
    const body = {
      filename:image
    }
    const res = await postData("reterive_image", body);
    
    setLogo("data:image/png;base64, "+res?.result)
  }
  useEffect(() => {
    user_details()
    
    addBlurClass();
    
  }, []);

  const handleDeleteUser = async () => {
    const body = {
      // client_id: String(user?.client_id),
    };
    const res = await postData("m_delete_client", body);
    if (res?.result) {
      setOpen3("");
      toaster(true, "Success");
      setTimeout(() => {
        navigate("/client");
      }, 2000);
    }
  };
  const [initialValue, setInitialValue] = useState({
    name: clientInfo?.name,
    phone: "",
    phone: "",
    website: "",
    industry: "",
    country: "",
    state: "",
    street_address: "",
    zip_code: "",
  });

  const [userdata, setuserdata] = useState({
    name: "",
    email: "",
    role: "",
  });
  const phoneReg =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationschema = yup.object().shape({
    name: Yup.string().required("Please Enter Name"),
    phone: Yup.string()
      .required("please enter phone number")
      .matches(phoneReg, "Phone number is not valid")
      .min(10, "too short")
      .max(11, "too long"),
    mobile: Yup.string()
      .required("please enter mobile number")
      .matches(phoneReg, "Phone number is not valid")
      .min(10, "too short")
      .max(11, "too long"),
    industry: Yup.string().required("Please Enter  Industry"),
    // country: Yup.string().required("Please Enter  Country"),
    // state: Yup.string().required("Please Enter State "),
    website: Yup.string().required("Please Enter website "),
    street_address: Yup.string().required("Please Enter Street Address"),
    zip_code: Yup.string().required("Please Enter Zip code").max(6).min(6),
  });

  const validationschemas = yup.object().shape({
    
    // role: Yup.string().required("Role is required!!"),
  });
  const token = JSON.parse(localStorage.getItem("a_login"));
  const handleUpdateRep = async () => {
    const initial = formRef?.current?.values;
    const ree = formRef?.current.resetForm();
    const body = {
      
      user_id: initial?.role,
    };

    const res = await postData("update_representative_info", body);
    localStorage.setItem("updatedetails", JSON.stringify(body));
    localStorage.removeItem("details");
    if (res.result) {
      setOpen1("");
      ree.resetForm();
      toaster(true, "SuccessFul Update");
    }
  };

  const handleSubmit = async () => {
    const initial = ref?.current?.values;
    const ree = ref?.current.resetForm();
    let countryCode = countrydata.filter((el) => {
      return el.name == initial?.country;
    });
    let countryCode1 = countrydata.filter((el) => {
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
      client_id: Number(token.client_id),
      name: initial?.name,
      phone: initial?.phone,
      website: initial?.website,
      industry: initial?.industry,
      country: countryCode[0]?.name
        ? countryCode[0]?.name
        : countryCode1[0]?.name,
      state: stateCode[0]?.name ? stateCode[0]?.name : stateCode1[0]?.name,
      address: initial?.street_address,
      zip_code: initial?.zip_code,
    };
    const res = await postData("update_client_info", body);
    localStorage.setItem("updatephone", JSON.stringify(body.phone));
    if (res.result) {
      setOpen("");
      ree.resetForm();
      toaster(true, "SuccessFull Update");
    } else {
      toaster(false, "Fields are Empty");
    }
  };
  return (
    <>
      <div className="container-fluid h-100">
        <ToastContainer autoClose={1000}></ToastContainer>
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
                            <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                              <div className="row mx-0 sticky-top stickyHeader">
                                <Header
                                  setSidebarOpen={setSidebarOpen}
                                  // sideBar={sideBar}
                                  textHeader={"Settings"}
                                  textSubHeader={
                                    "welcome "+userDetails.username+", you can find your company information here"
                                  }
                                />
                              </div>
                              <div className="row py-3">
                                <div className="col-12">
                                  <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                    <div className="col pageHeading px-0">
                                      Settings
                                    </div>
                                    <div className="col pageSubheading px-0">
                                      welcome s, you can find all
                                      information you require here.
                                    </div>  
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12">
                                  <div className="settingTopBox">
                                    <div className="row">
                                      <div className="col-12">
                                        <div
                                          style={{
                                            fontWeight: "300",
                                            fontSize: "28px",
                                          }}
                                          className="settingTopBoxHead"
                                        >
                                          {clientInfo.name}
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="settingTopBoxSubHead">
                                          Current Representative:
                                          <span>
                                            {userDetails.username
                                              }
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-12 py-1">
                                        <div className="moreDetail">
                                          Email:{" "}
                                          {userDetails.email}
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="moreDetail">
                                          Phone:{" "}
                                          {details
                                            ? details?.phone
                                            : updatephone}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row py-3">
                                <Formik
                                  initialValues={userdata}
                                  innerRef={formRef}
                                  // onSubmit={(value, resetForm) =>
                                  //   Handler(value, resetForm)
                                  // }
                                  validationSchema={validationschemas}
                                >
                                  {(formik) => {
                                    return (
                                      <Form>
                                        <div className="col-12">
                                          <div className="updateBox">
                                            <div className="row">
                                              <div className="col-12">
                                                <div className="updateBoxHead">
                                                  Update Representative
                                                </div>
                                              </div>
                                              {/* <div className="col-12">
                                                <div className="updateBoxSubHead">
                                                  The new representative has to
                                                  be an admin.
                                                </div>
                                              </div>
                                              <div className="col-12 mb-3">
                                                <Field
                                                  type="text"
                                                  className="form-control updateInp"
                                                  name="name"
                                                  id
                                                  placeholder="Enter Name"
                                                />
                                                <p className="text-danger">
                                                  {formik.touched.name &&
                                                  formik.errors.name
                                                    ? formik.errors.name
                                                    : ""}
                                                </p>
                                              </div>
                                              <div className="col-12 mb-4">
                                                <Field
                                                  type="emial"
                                                  className="form-control updateInp"
                                                  name="email"
                                                  id
                                                  placeholder="Enter email"
                                                />
                                                <p className="text-danger">
                                                  {formik.touched.email &&
                                                  formik.errors.email
                                                    ? formik.errors.email
                                                    : ""}
                                                </p>
                                              </div> */}
                                              <div className="col-12">
                                                <div className="settingSelectTop position-relative d-flex justify-content-between align-items-center">
                                                  <div className="settingSelectTopTxt">
                                                    New Company Representative
                                                  </div>
                                                  <Field
                                                    type="text"
                                                    className="SelectInp"
                                                    name
                                                    id
                                                    placeholder="Search User"
                                                  />
                                                  <div className="searchImg">
                                                    <img
                                                      className
                                                      src="assets/img/svg/search.svg"
                                                      alt
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-12 mt-2">
                                                <Field
                                                  as="select"
                                                  name="role"
                                                  className="form-select updateSelect"
                                                  aria-label="Default select example"
                                                  
                                                >
                                                  <option
                                                          value={ids?.user_id}
                                                          selected
                                                        >
                                                          {userDetails?.username}
                                                        </option>

                                                  {admins?.map((el) => {
                                                    return (
                                                      <option
                                                        value={el?.id}
                                                        
                                                      >
                                                        {el?.name}
                                                      </option>
                                                    );
                                                  
                                                })}
                                                </Field>
                                                <p className="text-danger">
                                                  {formik.touched.role &&
                                                  formik.errors.role
                                                    ? formik.errors.role
                                                    : ""}
                                                </p>
                                              </div>
                                              <div className="col-12 d-flex justify-content-center">
                                                <button
                                                  type="submit"
                                                  onClick={() => setOpen1(true)}
                                                  className="updateBtn"
                                                  
                                                >
                                                  Update Representative{" "}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Form>
                                    );
                                  }}
                                </Formik>
                              </div>
                              <div className="row pb-3">
                                <div className="col-12">
                                  <div className="companyInfoForm">
                                    {
                                      <Formik
                                        initialValues={initialValue}
                                        innerRef={ref}
                                        // onSubmit={(value, resetForm) =>
                                        //   submitHandler(value, resetForm)
                                        // }
                                        enableReinitialize= {true}
                                        validationSchema={validationschema}
                                      >
                                        {(formik) => {
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
                                                    Only edit the fields you
                                                    want to &amp; click update
                                                  </div>
                                                </div>

                                                <div class="col-12">
                                                  <div class="companyImg position-relative">
                                                    <img
                                                      src={logo}
                                                      alt=""
                                                    />
                                                    <input
                                                      type="file"
                                                      class="d-none"
                                                      id="companyImg"
                                                    />
                                                    <label
                                                      for="companyImg"
                                                      class="changeCompanyIcon"
                                                    >
                                                      <img
                                                        src="./assets/img/svg/imgEditIcon.svg"
                                                        alt="edit icon"
                                                      />
                                                    </label>
                                                  </div>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    Company Name
                                                  </label>
                                                  <Field
                                                    type="text"
                                                    className="companyInfoFormInp form-control"
                                                    name="name"
                                                    id
                                                    
                                                    placeholder="Company X"
                                                  />

                                                  <p className="text-danger">
                                                    {formik.touched.name &&
                                                    formik.errors.name
                                                      ? formik.errors.name
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    Company Contact Number
                                                  </label>
                                                  <Field
                                                    type="tel"
                                                    className="companyInfoFormInp form-control"
                                                    name="phone"
                                                    id
                                                    placeholder="Enter phone number"
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.phone &&
                                                    formik.errors.phone
                                                      ? formik.errors.phone
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    Mobile Number
                                                  </label>
                                                  <Field
                                                    type="tel"
                                                    className="companyInfoFormInp form-control"
                                                    name="phone"
                                                    id
                                                    placeholder="Enter mobile number"
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.phone &&
                                                    formik.errors.phone
                                                      ? formik.errors.phone
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    Company Website URL
                                                  </label>
                                                  <Field
                                                    type="mail"
                                                    className="companyInfoFormInp form-control"
                                                    name="website"
                                                    id
                                                    placeholder="companyx.com"
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.website &&
                                                    formik.errors.website
                                                      ? formik.errors.website
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    Industry
                                                  </label>
                                                  <Field
                                                    type="text"
                                                    className="companyInfoFormInp form-control"
                                                    name="industry"
                                                    id
                                                    placeholder="Technology"
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.industry &&
                                                    formik.errors.industry
                                                      ? formik.errors.industry
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12 mt-2">
                                                  <label
                                                    htmlFor
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

                                                        width: "100%",
                                                        height: "60px",
                                                        borderRadius: "18px",

                                                        backgroundColor:
                                                          "white",
                                                      }),
                                                    }}
                                                    aria-label="Default select example"
                                                    name="country"
                                                    options={countrydata}
                                                    placeholder={clientInfo.country}
                                                    value={
                                                      formik?.values?.country
                                                    }
                                                    onChange={(value) => {
                                                      formik.setValues(
                                                        {
                                                          country: value?.label,
                                                          state:
                                                            formik.values.state,
                                                          name: formik.values
                                                            .name,
                                                          phone:
                                                            formik.values.phone,
                                                            phone:
                                                            formik.values
                                                              .phone,
                                                          website:
                                                            formik.values
                                                              .website,
                                                          industry:
                                                            formik.values
                                                              .industry,

                                                              street_address:
                                                            formik.values
                                                              .street_address,
                                                          zip_code:
                                                            formik.values
                                                              .zip_code,
                                                        },
                                                        false
                                                      );
                                                      let event = {
                                                        target: {
                                                          name: "country",
                                                          value: value,
                                                        },
                                                      };
                                                      formik.handleChange(
                                                        event
                                                      );
                                                    }}
                                                    onBlur={() => {
                                                      formik.handleBlur({
                                                        target: {
                                                          name: "country",
                                                        },
                                                      });
                                                    }}
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.country &&
                                                    formik.errors.country
                                                      ? formik.errors.country
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    State
                                                  </label>

                                                  <Select
                                                    styles={{
                                                      control: (
                                                        baseStyles
                                                      ) => ({
                                                        ...baseStyles,

                                                        width: "100%",
                                                        height: "60px",
                                                        borderRadius: "18px",
                                                      }),
                                                    }}
                                                    id="state"
                                                    name="state"
                                                    placeholder={clientInfo.state}
                                                    defaultInputValue={clientInfo.state}
                                                    options={updatedStates(
                                                      formik.values.country
                                                        ? formik.values.country
                                                            .value
                                                        : null
                                                    )}
                                                    value={formik.values.state}
                                                    onChange={(value) => {
                                                      formik.setValues(
                                                        {
                                                          state: value.label,
                                                          country:
                                                            formik.values
                                                              .country,
                                                          state:
                                                            formik.values.state,
                                                          name: formik.values
                                                            .name,
                                                          phone:
                                                            formik.values.phone,
                                                            phone:
                                                            formik.values
                                                              .phone,
                                                          website:
                                                            formik.values
                                                              .website,
                                                          industry:
                                                            formik.values
                                                              .industry,

                                                              street_address:
                                                            formik.values
                                                              .street_address,
                                                          zip_code:
                                                            formik.values
                                                              .zip_code,
                                                        },
                                                        false
                                                      );
                                                      let event = {
                                                        target: {
                                                          name: "state",
                                                          value: value,
                                                        },
                                                      };
                                                      formik.handleChange(
                                                        event
                                                      );
                                                    }}
                                                    onBlur={() => {
                                                      formik.handleBlur({
                                                        target: {
                                                          name: "state",
                                                        },
                                                      });
                                                    }}
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.state &&
                                                    formik.errors.state
                                                      ? formik.errors.state
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    Street Address
                                                  </label>
                                                  <Field
                                                    type="text"
                                                    className="companyInfoFormInp form-control"
                                                    name="street_address"
                                                    id
                                                    placeholder="1 Beaver Rd"
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.street_address &&
                                                    formik.errors.street_address
                                                      ? formik.errors.street_address
                                                      : ""}
                                                  </p>
                                                </div>
                                                <div className="col-12">
                                                  <label
                                                    htmlFor
                                                    className="companyInfoFormLbl"
                                                  >
                                                    ZIP Code
                                                  </label>
                                                  <Field
                                                    type="text"
                                                    className="companyInfoFormInp form-control"
                                                    name="zip_code"
                                                    id
                                                    placeholder="1 Beaver Rd"
                                                  />
                                                  <p className="text-danger">
                                                    {formik.touched.zip_code &&
                                                    formik.errors.zip_code
                                                      ? formik.errors.zip_code
                                                      : ""}
                                                  </p>
                                                </div>
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
                                    }
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
      {/* model */}
      <Modal
        type={
          open3
            ? "Delete User"
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
};

export default Settings;
