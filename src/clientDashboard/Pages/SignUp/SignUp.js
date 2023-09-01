import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import * as Yup from "yup";
import { postData } from "../../Common/fetchservices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import Select from "react-select";
import Modal from "../../Common/Modal";
import StripeContainer, {
  stripePromise,
} from "../../Common/Stripe/StripeContainer";

import { useEffect } from "react";

const SignUp = () => {
  const countries = Country.getAllCountries();
  const countrydata = countries?.map((el) => ({
    label: el?.name,
    value: el?.isoCode,
    ...el,
  }));
  const countrydata1 = countries?.map((el) => ({
    label: el?.name,
    value: el?.isoCode,
    ...el,
  }));

  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state?.name,
    }));
  const updatedStates1 = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state?.name,
    }));
  const [sameAddress, setSameAddress] = useState(false);
  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(true);
  const [check, setcheck] = useState(false);
  const [key, setkey] = useState();
  const [allTierInfo,setAllTierInfo] = useState([]);
  const [companyLogo, setCompanyLogo] = useState([]);
  const [selectedTier,setSelectedTier] = useState([]);
  const [initialValue, setInitialValue] = useState({
    chosenTier: "",
    billingType: "",
    companyLogo: "",
    companyName: "",
    companyContactNumber: "",
    companyWebsiteUrl: "",
    industry: "",
    country: "",
    state: "",
    streetAddress: "",
    zipCode: "",
    reName: "",
    reEmail: "",
    rePassword: "",
    reConfirmPassword: "",
    cardHolderName: "",
    cardNumber: "",
    cardExpiryDate: "",
    cardCvc: "",
    billingCountry: "",
    billingState: "",
    billingStreetAddress: "",
    billingZipCode: "",
  });

  const phoneReg =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationschema = yup.object().shape({
    chosenTier: Yup.string().required("Please Select  Tier"),
    billingType: Yup.string().required("Please Select  Billing Type"),
    companyName: Yup.string().required("Please Enter  Company Name"),
    companyContactNumber: Yup.string()
      .required("Please Enter  Contact Number")
      .matches(phoneReg, "Phone number is not valid")
      .min(10, "too short")
      .max(10, "too long"),
    companyWebsiteUrl: Yup.string().required("Please Enter  Website Url"),
    industry: Yup.string().required("Please Enter  Industry"),
    country: Yup.mixed().required("Please Enter Country "),
    state: Yup.mixed().required("Please Enter  State"),
    streetAddress: Yup.string().required("Please Enter Street Address"),
    zipCode: Yup.string().required("Please Enter Zip code").max(6).min(6),
    reName: Yup.string().required("Please Enter Name"),
    reEmail: Yup.string().email().required("Email is required"),
    rePassword: Yup.string()
      .required("Please Enter the password")
      .min(6, "Password is too short - should be 6 chars minimum"),
    reConfirmPassword: Yup.string()
      .required("Please Enter the password")
      .min(6, "Password is too short - should be 6 chars minimum"),
    cardHolderName: Yup.string().required("Please Enter Card Holder Name"),
    cardNumber: Yup.string()
      .required("Please Enter Card Number")
      .min(19, "Enter valid card Number")
      .max(19, "Enter valid card Number"),
    cardExpiryDate: Yup.string()
      .required("Please Enter Card Expiry ")
      .min(5)
      .max(5),
  });

  let nav = useNavigate();
  let [submitting, setSubmitting] = useState(false);
  const getTierInfo = async()=>{
    const body = {}
    const res = await postData("m_get_all_tiers_info", body);
    if (res.result !== ""){
    setAllTierInfo(res?.result)
    console.log(allTierInfo)
    }
}
  useEffect(()=>{
    getTierInfo()
  },[])
  const submitHandler = async (value, { resetForm }) => {
    const val = {
      name: value.companyName,
      phone: value.companyContactNumber,
      email: value.reEmail,
    };
    const body = {
      tier_id: value?.chosenTier,
      billing_type: value?.billingType,
      filename: "",
      file_content: "",
      name: value?.companyName,
      phone: value?.companyContactNumber.toString(),
      website: value?.companyWebsiteUrl,
      industry: value?.industry,
      country: value?.country.name,
      state: value?.state.label,
      street_address: value?.streetAddress,
      zip_code: value?.zipCode,
      card_number: value?.cardNumber?.replace(/ +/g, ""),
      card_name: value?.cardHolderName,
      card_expiry_month: value?.cardExpiryDate?.slice(0, 2),
      card_expiry_year: value?.cardExpiryDate.slice(3, 7),
      card_cvc: value?.cardCvc,
      card_country: !sameAddress
        ? value?.billingCountry?.name
        : value?.country.name,
      card_state: !sameAddress
        ? value?.billingState?.label
        : value?.state.label,
      card_street_address: !sameAddress
        ? value?.billingStreetAddress
        : value?.streetAddress,
      card_zip_code: !sameAddress
        ? value.billingZipCode.toString()
        : value?.zipCode.toString(),
      user_name: value?.reName,
      user_email: value?.reEmail,
      user_password: value?.reConfirmPassword,
      mobile: "+91",
    };
    setSubmitting(true);

    const res = await postData("add_new_client", body);
    localStorage.setItem("details", JSON.stringify(val));
    // setkey(res?.secret);
    console.log("Setting", res);
    try {
      let r = await (
        await stripePromise
      ).confirmCardPayment(res?.secret, {
        return_url:
          "http://" +
          window.location.host +
          "/verify-payment?key=" +
          res?.secret,
      });
      console.log(r)
      if (r.error) {
        throw new Error(r.error.message);
      }
      if (r.paymentIntent.status === "succeeded" || r.paymentIntent.status === "processing") {
        nav("/assistant-login");
      } else throw new Error("Please try again");
    } catch (er) {
      alert("Payment failed. Please try again");
      return;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container-fluid">
      <div className="row mainInner">
        <div
          className="col-12 px-0 flex-fill signUpFormPage position-relative"
          data-page-name="signUpFormPage"
        >
          {
            <Formik
              initialValues={initialValue}
              onSubmit={(value, resetForm) => submitHandler(value, resetForm)}
              validationSchema={validationschema}
            >
              {(formik) => {
                return (
                  <div className="innerSection row mx-0 py-md-5 my-5">
                    <Form className="form col-xl-7 col-lg-9 col-sm-10 col-11 mx-auto px-0">
                      <div className="row mx-0 topSection">
                        <div className="col-12 userName fw-medium text-center">
                          KAIRAV
                        </div>
                        <div className="col-12 databaseName text-center">
                          Database Personal Assistant
                        </div>
                        <div className="col-12 px-0 my-md-5 my-4 py-2 py-md-3 py-lg-4 topbilling">
                          <div className="row mx-0">
                            <div className="col-md-6 col-12 mb-md-0 mb-3">
                              <div className="belingType fw-medium d-flex align-items-center gap-2">
                                <span className="d-inline-flex">
                                  <img
                                    src="assets/img/svg/grid-2-horizontal.svg"
                                    alt
                                    className="w-100"
                                  />
                                </span>{" "}
                                Chosen Tier
                              </div>
                              <div className="my-3">
                                <Field
                                  as="select"
                                  className="form-select shadow-none"
                                  aria-label="Default select example"
                                  name="chosenTier"
                                  value = {selectedTier}
                                  onChange={(e)=>{
                                    setSelectedTier(e.target.value)
                                    console.log(e.target.value)
                                  }}
                                >
                                  <option disabled selected>
                                    Choose Plan
                                  </option>
                                  {
                                    allTierInfo.map((tier)=>{
                                      return (
                                        tier.product_id !== "" ? <option value={tier.id}>{tier.name}</option> : ""
                                      )
                                    })
                                  }
                                </Field>
                              </div>
                              <div
                                id="cpassword"
                                className="form-text text-end invalidText"
                              >
                                <p className="text-danger">
                                  {formik.touched.chosenTier &&
                                  formik.errors.chosenTier
                                    ? formik.errors.chosenTier
                                    : ""}
                                </p>
                              </div>
                              <div className="features ps-4">
                                <div className="featuresName fw-bold">
                                  Features
                                </div>
                                <ul className="fw-normal">
                                  <li>2M Training Tokens</li>
                                  <li>10M Database Usage</li>
                                  <li>3 DPAs</li>
                                  <li>5 Users</li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-md-6 col-12 mb-md-0 mb-3">
                              <div className="belingType fw-medium d-flex align-items-center gap-2">
                                <span className="d-inline-flex">
                                  <img
                                    src="assets/img/svg/creditcard.svg"
                                    alt
                                    className="w-100"
                                  />
                                </span>{" "}
                                Billing Type
                              </div>
                              <div className="mt-3">
                                <Field
                                  as="select"
                                  className="form-select shadow-none bg-white"
                                  aria-label="Default select example"
                                  name="billingType"
                                >
                                  <option disabled selected>
                                    Select Type
                                  </option>
                                  <option value={"monthly"}>Monthly</option>
                                  <option value={"yearly"}>Yearly</option>
                                </Field>
                              </div>
                              <div
                                id="cpassword"
                                className="form-text text-end invalidText"
                              >
                                <p className="text-danger ">
                                  {formik.touched.billingType &&
                                  formik.errors.billingType
                                    ? formik.errors.billingType
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mx-0 mainForm mb-5">
                        <div className="col-12 companyDetails d-flex align-items-center gap-2 fw-medium mb-3">
                          <span className="d-inline-flex">
                            <img
                              src="assets/img/svg/wand.svg"
                              alt
                              className="w-100"
                            />
                          </span>{" "}
                          Company Details
                        </div>
                        <div className="col-12 card border-0 bg-white  bg-opacity-50 px-0">
                          <div className="card-body row mx-0 gap-md-4 gap-3 p-md-4 p-3 pb-md-5 pb-4">
                            <div className="col-12 imnformation fw-medium">
                              Please fill in your Company’s Information
                            </div>
                            <div className="col-12 px-0">
                              <div className="row mx-0 align-items-center">
                                <div className="col-auto">
                                  <div className="imgOuter position-relative mx-auto">
                                    <div className="img w-100 h-100 rounded-circle overflow-hidden">
                                      <img
                                        src={
                                          companyLogo.length !== 0
                                            ? companyLogo
                                            : "assets/img/svg/user.svg"
                                        }
                                        alt
                                        className="w-100 h-100"
                                      />
                                    </div>
                                    <label
                                      htmlFor="profileImg"
                                      className="form-label m-0 rounded-circle align-items-center d-flex justify-content-center position-absolute bottom-0 end-0"
                                    >
                                      <img
                                        className="w-100"
                                        src="assets/img/svg/pen.svg"
                                        alt
                                      />
                                    </label>
                                    <input
                                      className="form-control"
                                      type="file"
                                      id="profileImg"
                                      name="companyLogo"
                                      hidden
                                      onChange={(event) => {
                                        formik.setTouched({
                                          ...formik.touched,
                                          file: true,
                                        });
                                        formik.setFieldValue(
                                          "file",
                                          event.target.files[0],
                                          setCompanyLogo(
                                            URL.createObjectURL(
                                              event.target.files[0]
                                            )
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col">
                                  <div className="logoName fw-medium">
                                    Company Logo
                                  </div>
                                  <div className="portalName fw-normal">
                                    This will be displayed across the portal.
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 px-0 companyForm">
                              <div className="row mx-0 gap-3">
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="companyName"
                                    className="form-label fw-normal px-3"
                                  >
                                    Company Name
                                  </label>
                                  <Field
                                    type="text"
                                    className="form-control shadow-none bg-white fw-normal"
                                    name="companyName"
                                    id="companyName"
                                    placeholder="Company Name"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.companyName &&
                                    formik.errors.companyName
                                      ? formik.errors.companyName
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="companyNUmber"
                                    className="form-label fw-normal px-3"
                                  >
                                    Company Contact Number
                                  </label>
                                  <div className="input-group flex-nowrap">
                                    <span
                                      className="input-group-text bg-white border-end-0 rounded-end-0 d-flex align-items-center gap-3 pe-0"
                                      id="addon-wrapping"
                                    >
                                      +91{" "}
                                      <div className="arrowImg d-flex">
                                        <img
                                          src="assets/img/svg/down-chevron.svg"
                                          className="h-100"
                                          alt
                                        />
                                      </div>
                                    </span>
                                    <Field
                                      type="number"
                                      className="form-control shadow-none border-start-0 rounded-start-0"
                                      id="companyNUmber"
                                      name="companyContactNumber"
                                      placeholder="Contact Number"
                                      aria-label="companyNUmber"
                                      aria-describedby="addon-wrapping"
                                    />
                                  </div>
                                  <div
                                    id="cpassword"
                                    className="form-text text-end invalidText"
                                  >
                                    <p className="text-danger">
                                      {formik.touched.companyContactNumber &&
                                      formik.errors.companyContactNumber
                                        ? formik.errors.companyContactNumber
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="companyUrl"
                                    className="form-label fw-normal px-3"
                                  >
                                    Company Website URL
                                  </label>
                                  <Field
                                    type="url"
                                    name="companyWebsiteUrl"
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="companyUrl"
                                    placeholder="Company Website"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.companyWebsiteUrl &&
                                    formik.errors.companyWebsiteUrl
                                      ? formik.errors.companyWebsiteUrl
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="Industry"
                                    className="form-label fw-normal px-3"
                                  >
                                    Industry
                                  </label>
                                  <Field
                                    type="text"
                                    name="industry"
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="Industry"
                                    placeholder="Industry"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.industry &&
                                    formik.errors.industry
                                      ? formik.errors.industry
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="country"
                                    className="form-label fw-normal px-3"
                                  >
                                    Country
                                  </label>

                                  <Select
                                    styles={{
                                      control: (baseStyles) => ({
                                        ...baseStyles,
                                        border: "none",
                                        width: "100%",
                                        height: "60px",
                                        borderRadius: "18px",
                                        paddingLeft: "10px",
                                        backgroundColor: "white",
                                      }),
                                    }}
                                    id="country"
                                    name="country"
                                    placeholder="Choose Country"
                                    options={countrydata}
                                    value={formik?.values?.country}
                                    onChange={(value) => {
                                      formik.setValues(
                                        {
                                          country: value?.label,
                                          state: formik.values.state,
                                          chosenTier: formik.values.chosenTier,
                                          billingType:
                                            formik.values.billingType,
                                          companyLogo:
                                            formik.values.companyLogo,
                                          companyName:
                                            formik.values.companyName,
                                          companyContactNumber:
                                            formik.values.companyContactNumber,
                                          companyWebsiteUrl:
                                            formik.values.companyWebsiteUrl,
                                          industry: formik.values.industry,
                                          streetAddress:
                                            formik.values.streetAddress,
                                          zipCode: formik.values.zipCode,
                                          reName: formik.values.reName,
                                          reEmail: formik.values.reEmail,
                                          rePassword: formik.values.rePassword,
                                          reConfirmPassword:
                                            formik.values.reConfirmPassword,
                                          cardHolderName:
                                            formik.values.cardHolderName,
                                          cardNumber: formik.values.cardNumber,
                                          cardExpiryDate:
                                            formik.values.cardExpiryDate,
                                          cardCvc: formik.values.cardCvc,
                                          billingCountry:
                                            formik.values.billingCountry,
                                          billingState:
                                            formik.values.billingState,
                                          billingStreetAddress:
                                            formik.values.billingStreetAddress,
                                          billingZipCode:
                                            formik.values.billingZipCode,
                                        },
                                        false
                                      );
                                      let event = {
                                        target: {
                                          name: "country",
                                          value: value,
                                        },
                                      };
                                      formik.handleChange(event);
                                    }}
                                    onBlur={() => {
                                      formik.handleBlur({
                                        target: { name: "country" },
                                      });
                                    }}
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.country &&
                                    formik.errors.country
                                      ? formik.errors.country
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="state"
                                    className="form-label fw-normal px-3"
                                  >
                                    State
                                  </label>
                                  <Select
                                    styles={{
                                      control: (baseStyles) => ({
                                        ...baseStyles,
                                        border: "none",
                                        width: "100%",
                                        height: "60px",
                                        borderRadius: "18px",
                                        paddingLeft: "10px",
                                      }),
                                    }}
                                    id="state"
                                    name="state"
                                    placeholder="Choose State"
                                    options={updatedStates(
                                      formik.values.country
                                        ? formik.values.country.value
                                        : null
                                    )}
                                    value={formik.values.state}
                                    onChange={(value) => {
                                      formik.setValues(
                                        {
                                          state: value.label,
                                          country: formik.values.country,
                                          chosenTier: formik.values.chosenTier,
                                          billingType:
                                            formik.values.billingType,
                                          companyLogo:
                                            formik.values.companyLogo,
                                          companyName:
                                            formik.values.companyName,
                                          companyContactNumber:
                                            formik.values.companyContactNumber,
                                          companyWebsiteUrl:
                                            formik.values.companyWebsiteUrl,
                                          industry: formik.values.industry,
                                          streetAddress:
                                            formik.values.streetAddress,
                                          zipCode: formik.values.zipCode,
                                          reName: formik.values.reName,
                                          reEmail: formik.values.reEmail,
                                          rePassword: formik.values.rePassword,
                                          reConfirmPassword:
                                            formik.values.reConfirmPassword,
                                          cardHolderName:
                                            formik.values.cardHolderName,
                                          cardNumber: formik.values.cardNumber,
                                          cardExpiryDate:
                                            formik.values.cardExpiryDate,
                                          cardCvc: formik.values.cardCvc,
                                          billingCountry:
                                            formik.values.billingCountry,
                                          billingState:
                                            formik.values.billingState,
                                          billingStreetAddress:
                                            formik.values.billingStreetAddress,
                                          billingZipCode:
                                            formik.values.billingZipCode,
                                        },
                                        false
                                      );
                                      let event = {
                                        target: {
                                          name: "state",
                                          value: value,
                                        },
                                      };
                                      formik.handleChange(event);
                                    }}
                                    onBlur={() => {
                                      formik.handleBlur({
                                        target: { name: "state" },
                                      });
                                    }}
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.state && formik.errors.state
                                      ? formik.errors.state
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="streetAddress"
                                    className="form-label fw-normal px-3"
                                  >
                                    Street Address
                                  </label>
                                  <Field
                                    type="text"
                                    name="streetAddress"
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="streetAddress"
                                    placeholder="Street Address"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.streetAddress &&
                                    formik.errors.streetAddress
                                      ? formik.errors.streetAddress
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="code"
                                    className="form-label fw-normal px-3"
                                  >
                                    ZIP Code
                                  </label>
                                  <Field
                                    type="text"
                                    name="zipCode"
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="code"
                                    placeholder="ZIP Code"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.zipCode &&
                                    formik.errors.zipCode
                                      ? formik.errors.zipCode
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mx-0 mainForm mb-5">
                        <div className="col-12 companyDetails d-flex align-items-center gap-2 fw-medium mb-3">
                          <span className="d-inline-flex">
                            <img
                              src="assets/img/svg/wand.svg"
                              alt
                              className="w-100"
                            />
                          </span>{" "}
                          Company Representative Details
                        </div>
                        <div className="col-12 card border-0 bg-white  bg-opacity-50 px-0">
                          <div className="card-body row mx-0 gap-md-4 gap-3 p-md-4 p-3 pb-md-5 pb-4">
                            <div className="col-12 imnformation fw-medium">
                              Please fill in your Representative’s Information
                              <div className="solidContent fw-normal mt-2">
                                Representative will be the point of contact and
                                an admin. As an admin, the representative will
                                be able to handle all administrative matters
                                such as DPA management &amp; user settings.
                              </div>
                            </div>
                            <div className="col-12 px-0 companyForm">
                              <div className="row mx-0 gap-3">
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="name"
                                    className="form-label fw-normal px-3"
                                  >
                                    Name
                                  </label>
                                  <Field
                                    type="text"
                                    name="reName"
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="name"
                                    placeholder="Name"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.reName &&
                                    formik.errors.reName
                                      ? formik.errors.reName
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="email"
                                    className="form-label fw-normal px-3"
                                  >
                                    Email
                                  </label>
                                  <Field
                                    type="email"
                                    name="reEmail"
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="email"
                                    placeholder="Email"
                                    aria-describedby="emailHelp"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.reEmail &&
                                    formik.errors.reEmail
                                      ? formik.errors.reEmail
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="password"
                                    className="form-label fw-normal px-3"
                                  >
                                    Password
                                  </label>
                                  <div className="input-group flex-nowrap">
                                    <Field
                                      type={show == false ? "text" : "password"}
                                      className="form-control shadow-none border-end-0 rounded-end-0"
                                      id="password"
                                      name="rePassword"
                                      placeholder="Enter Password"
                                      aria-label="password"
                                      aria-describedby="addon-wrapping"
                                    />
                                    <button
                                      type="button"
                                      className="input-group-text bg-white  border-start-0 rounded-start-0 d-flex align-items-center gap-3"
                                      id="addon-wrapping"
                                    >
                                      <div
                                        className="arrowImg d-flex border-0 p-0"
                                        onClick={() => setShow((prev) => !prev)}
                                      >
                                        <img
                                          src="assets/img/svg/eye-open.svg"
                                          className="h-100"
                                          alt
                                        />
                                      </div>
                                    </button>
                                  </div>
                                  <div
                                    id="cpassword"
                                    className="form-text text-end invalidText"
                                  >
                                    <p className="text-danger">
                                      {formik.touched.rePassword &&
                                      formik.errors.rePassword
                                        ? formik.errors.rePassword
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="cpassword"
                                    className="form-label fw-normal px-3"
                                  >
                                    Confirm Password
                                  </label>
                                  <div className="input-group flex-nowrap">
                                    <Field
                                      type={
                                        show1 == false ? "text" : "password"
                                      }
                                      name="reConfirmPassword"
                                      className="form-control shadow-none border-end-0 rounded-end-0"
                                      id="cpassword"
                                      placeholder="Re-enter Password"
                                      aria-label="cpassword"
                                      aria-describedby="addon-wrapping"
                                    />
                                    <button
                                      type="button"
                                      className="input-group-text bg-white  border-start-0 rounded-start-0 d-flex align-items-center gap-3"
                                      id="addon-wrapping"
                                    >
                                      <div
                                        className="arrowImg d-flex border-0 p-0"
                                        onClick={() =>
                                          setShow1((prev) => !prev)
                                        }
                                      >
                                        <img
                                          src="assets/img/svg/eye-open.svg"
                                          className="h-100"
                                          alt
                                        />
                                      </div>
                                    </button>
                                  </div>
                                  <div
                                    id="cpassword"
                                    className="form-text text-end invalidText"
                                  >
                                    <p className="text-danger">
                                      {formik.touched.reConfirmPassword &&
                                      formik.errors.reConfirmPassword
                                        ? formik.errors.reConfirmPassword
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mx-0 mainForm mb-5">
                        <div className="col-12 companyDetails d-flex align-items-center gap-2 fw-medium mb-3">
                          <span className="d-inline-flex">
                            <img
                              src="assets/img/svg/wand.svg"
                              alt
                              className="w-100"
                            />
                          </span>{" "}
                          Billing Details
                        </div>
                        <div className="col-12 card border-0 bg-white  bg-opacity-50 px-0 ">
                          <div className="card-body row mx-0 gap-md-4 gap-3 p-md-4 p-3 pb-md-5 pb-4">
                            <div className="col-12 imnformation fw-medium">
                              Credit Card Information
                            </div>
                            <div className="col-12 px-0 companyForm">
                              <div className="row mx-0 gap-3">
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="cardname"
                                    className="form-label fw-normal px-3"
                                  >
                                    Name on Card
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control shadow-none bg-white fw-normal"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cardHolderName}
                                    name="cardHolderName"
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {formik.touched.cardHolderName &&
                                    formik.errors.cardHolderName
                                      ? formik.errors.cardHolderName
                                      : ""}
                                  </p>
                                </div>
                                <div className="col-12 px-0">
                                  <div className="row mx-0 formGroup gap-md-0">
                                    <div className="col-md col-12 mb-md-0 mb-2">
                                      <label
                                        htmlFor="cardNumber"
                                        className="form-label fw-normal px-3"
                                      >
                                        Credit Card Number
                                      </label>
                                      <div className="input-group flex-nowrap">
                                        <input
                                          type="text"
                                          className="form-control shadow-none border-end-0 rounded-end-0"
                                          maxlength="19"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.cardNumber
                                            ?.replace(/\s/g, "")
                                            .replace(/(\d{4})/g, "$1 ")
                                            .trim()}
                                          name="cardNumber"
                                        />
                                        <span className="input-group-text bg-white  border-start-0 rounded-start-0 d-flex align-items-center gap-3 ps-0">
                                          <div className="arrowImg d-flex border-0 p-0">
                                            <img
                                              src="assets/img/svg/Card logos.svg"
                                              className="h-100"
                                              alt
                                            />
                                          </div>
                                        </span>
                                      </div>
                                      <div
                                        id="cardNumber"
                                        className="form-text invalidText"
                                      >
                                        {formik.touched.cardNumber &&
                                        formik.errors.cardNumber
                                          ? formik.errors.cardNumber
                                          : ""}
                                      </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                      <label
                                        htmlFor="expiry"
                                        className="form-label fw-normal px-3"
                                      >
                                        Expiry
                                      </label>

                                      <input
                                        type="text"
                                        maxlength="5"
                                        className="form-control shadow-none bg-white fw-normal"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.cardExpiryDate
                                          ?.replace(
                                            /^([1-9]\/|[2-9])$/g,
                                            "0$1/" // 3 > 03/
                                          )
                                          .replace(
                                            /^(0[1-9]|1[0-2])$/g,
                                            "$1/" // 11 > 11/
                                          )
                                          .replace(
                                            /^([0-1])([3-9])$/g,
                                            "0$1/$2" // 13 > 01/3
                                          )
                                          .replace(
                                            /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
                                            "$1/$2" // 141 > 01/41
                                          )
                                          .replace(
                                            /^([0]+)\/|[0]+$/g,
                                            "0" // 0/ > 0 and 00 > 0
                                          )
                                          .replace(
                                            /[^\d\/]|^[\/]*$/g,
                                            "" // To allow only digits and `/`
                                          )
                                          .replace(
                                            /\/\//g,
                                            "/" // Prevent entering more than 1 `/`
                                          )}
                                        name="cardExpiryDate"
                                        id="expiry"
                                        placeholder="MM/YY"
                                        aria-describedby="emailHelp"
                                      />
                                      <div
                                        id="expiry"
                                        className="form-text invalidText"
                                      >
                                        {formik.touched.cardExpiryDate &&
                                        formik.errors.cardExpiryDate
                                          ? formik.errors.cardExpiryDate
                                          : ""}
                                      </div>
                                    </div>
                                    <div className="col-md-3 col-6">
                                      <label
                                        htmlFor="cvv"
                                        className="form-label fw-normal px-3"
                                      >
                                        CVC
                                      </label>

                                      <input
                                        type="text"
                                        maxlength="3"
                                        className="form-control shadow-none bg-white fw-normal"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.cardCvc}
                                        name="cardCvc"
                                        id="cvv"
                                        placeholder="CVC/CVV"
                                        aria-describedby="emailHelp"
                                      />
                                      <div
                                        id="cvv"
                                        className="form-text invalidText"
                                      >
                                        {formik.touched.cardCvc &&
                                        formik.errors.cardCvc
                                          ? formik.errors.cardCvc
                                          : ""}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 imnformation fw-medium mt-3">
                                  Billing Address
                                </div>
                                <div className="col-12">
                                  <div className="form-check mb-3">
                                    <input
                                      className="form-check-input shadow-none"
                                      type="checkbox"
                                      defaultValue
                                      id="flexCheckDefault"
                                      onChange={() =>
                                        setSameAddress((prev) => !prev)
                                      }
                                    />
                                    <label
                                      className="form-check-label fw-normal"
                                      htmlFor="flexCheckDefault"
                                    >
                                      Same as Company Address
                                    </label>
                                  </div>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="country1"
                                    className="form-label fw-normal px-3"
                                  >
                                    Country
                                  </label>
                                  <Select
                                    styles={{
                                      control: (baseStyles) => ({
                                        ...baseStyles,
                                        border: "none",
                                        width: "100%",
                                        height: "60px",
                                        borderRadius: "18px",
                                        paddingLeft: "10px",
                                        backgroundColor: "white",
                                      }),
                                    }}
                                    name={
                                      sameAddress !== true
                                        ? "billingCountry"
                                        : "country"
                                    }
                                    options={countrydata1}
                                    id={
                                      sameAddress !== true
                                        ? "billingCountry"
                                        : "country"
                                    }
                                    placeholder="Choose Country"
                                    defaultInputValue={
                                      !sameAddress
                                        ? formik.values.billingCountry
                                        : ""
                                    }
                                    value={
                                      !sameAddress
                                        ? formik?.values?.billingCountry
                                        : formik?.values?.country
                                    }
                                    onChange={(value) => {
                                      formik.setValues(
                                        {
                                          billingCountry: !sameAddress
                                            ? formik?.values?.billingCountry
                                            : value?.label,
                                          country: formik.values.country,
                                          state: formik.values.state,
                                          chosenTier: formik.values.chosenTier,
                                          billingType:
                                            formik.values.billingType,
                                          companyLogo:
                                            formik.values.companyLogo,
                                          companyName:
                                            formik.values.companyName,
                                          companyContactNumber:
                                            formik.values.companyContactNumber,
                                          companyWebsiteUrl:
                                            formik.values.companyWebsiteUrl,
                                          industry: formik.values.industry,
                                          streetAddress:
                                            formik.values.streetAddress,
                                          zipCode: formik.values.zipCode,
                                          reName: formik.values.reName,
                                          reEmail: formik.values.reEmail,
                                          rePassword: formik.values.rePassword,
                                          reConfirmPassword:
                                            formik.values.reConfirmPassword,
                                          cardHolderName:
                                            formik.values.cardHolderName,
                                          cardNumber: formik.values.cardNumber,
                                          cardExpiryDate:
                                            formik.values.cardExpiryDate,
                                          cardCvc: formik.values.cardCvc,

                                          billingState:
                                            formik.values.billingState,
                                          billingStreetAddress:
                                            formik.values.billingStreetAddress,
                                          billingZipCode:
                                            formik.values.billingZipCode,
                                        },
                                        false
                                      );
                                      let event = {
                                        target: {
                                          name:
                                            sameAddress !== true
                                              ? "billingCountry"
                                              : "country",
                                          value: value,
                                        },
                                      };
                                      formik.handleChange(event);
                                    }}
                                    onBlur={() => {
                                      formik.handleBlur({
                                        target: {
                                          name:
                                            sameAddress !== true
                                              ? "billingCountry"
                                              : "country",
                                        },
                                      });
                                    }}
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger ">
                                    {!sameAddress
                                      ? formik.touched.billingCountry &&
                                        formik.errors.billingCountry
                                        ? formik.errors.billingCountry
                                        : ""
                                      : null}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="state1"
                                    className="form-label fw-normal px-3"
                                  >
                                    State
                                  </label>

                                  <Select
                                    styles={{
                                      control: (baseStyles) => ({
                                        ...baseStyles,
                                        border: "none",
                                        width: "100%",
                                        height: "60px",
                                        borderRadius: "18px",
                                        paddingLeft: "10px",
                                      }),
                                    }}
                                    name={
                                      sameAddress !== true
                                        ? "billingState"
                                        : "state"
                                    }
                                    placeholder="Choose State"
                                    defaultInputValue={
                                      !sameAddress
                                        ? formik.values.billingState
                                        : ""
                                    }
                                    id={
                                      sameAddress !== true
                                        ? "billingState"
                                        : "state"
                                    }
                                    options={updatedStates1(
                                      formik.values.billingCountry
                                        ? formik.values.billingCountry.value
                                        : null
                                    )}
                                    value={
                                      !sameAddress
                                        ? formik.values.billingState
                                        : formik.values.state
                                    }
                                    onChange={(value) => {
                                      formik.setValues(
                                        {
                                          billingState: !sameAddress
                                            ? formik.values.billingState
                                            : value.label,
                                          country: formik.values.country,
                                          state: formik.values.state,
                                          chosenTier: formik.values.chosenTier,
                                          billingType:
                                            formik.values.billingType,
                                          companyLogo:
                                            formik.values.companyLogo,
                                          companyName:
                                            formik.values.companyName,
                                          companyContactNumber:
                                            formik.values.companyContactNumber,
                                          companyWebsiteUrl:
                                            formik.values.companyWebsiteUrl,
                                          industry: formik.values.industry,
                                          streetAddress:
                                            formik.values.streetAddress,
                                          zipCode: formik.values.zipCode,
                                          reName: formik.values.reName,
                                          reEmail: formik.values.reEmail,
                                          rePassword: formik.values.rePassword,
                                          reConfirmPassword:
                                            formik.values.reConfirmPassword,
                                          cardHolderName:
                                            formik.values.cardHolderName,
                                          cardNumber: formik.values.cardNumber,
                                          cardExpiryDate:
                                            formik.values.cardExpiryDate,
                                          cardCvc: formik.values.cardCvc,
                                          billingCountry:
                                            formik.values.billingCountry,
                                          billingStreetAddress:
                                            formik.values.billingStreetAddress,
                                          billingZipCode:
                                            formik.values.billingZipCode,
                                        },
                                        false
                                      );
                                      let event = {
                                        target: {
                                          name:
                                            sameAddress !== true
                                              ? "billingState"
                                              : "state",
                                          value: value,
                                        },
                                      };
                                      formik.handleChange(event);
                                    }}
                                    onBlur={() => {
                                      formik.handleBlur({
                                        target: {
                                          name:
                                            sameAddress !== true
                                              ? "billingState"
                                              : "state",
                                        },
                                      });
                                    }}
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger ">
                                    {!sameAddress
                                      ? formik.touched.billingState &&
                                        formik.errors.billingState
                                        ? formik.errors.billingState
                                        : ""
                                      : null}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="streetAddress1"
                                    className="form-label fw-normal px-3"
                                  >
                                    Street Address
                                  </label>
                                  <Field
                                    type="text"
                                    name={
                                      sameAddress !== true
                                        ? "billingStreetAddress"
                                        : "streetAddress"
                                    }
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="streetAddress1"
                                    value={
                                      !sameAddress
                                        ? formik.values.billingStreetAddress
                                        : formik.values.streetAddress
                                    }
                                    placeholder="Street Address"
                                    aria-describedby="emailHelp"
                                    disabled={sameAddress}
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger ">
                                    {!sameAddress
                                      ? formik.touched.streetAddress &&
                                        formik.errors.streetAddress
                                        ? formik.errors.streetAddress
                                        : ""
                                      : null}
                                  </p>
                                </div>
                                <div className="col-12 formGroup">
                                  <label
                                    htmlFor="code1"
                                    className="form-label fw-normal px-3"
                                  >
                                    ZIP Code
                                  </label>
                                  <Field
                                    type="number"
                                    name={
                                      sameAddress !== true
                                        ? "billingZipCode"
                                        : "zipCode"
                                    }
                                    className="form-control shadow-none bg-white fw-normal"
                                    id="code1"
                                    value={
                                      !sameAddress
                                        ? formik.values.billingZipCode
                                        : formik.values.zipCode
                                    }
                                    placeholder="ZIP Code"
                                    aria-describedby="emailHelp"
                                    disabled={sameAddress}
                                  />
                                </div>
                                <div
                                  id="cpassword"
                                  className="form-text text-end invalidText"
                                >
                                  <p className="text-danger">
                                    {!sameAddress
                                      ? formik.touched.billingZipCode &&
                                        formik.errors.billingZipCode
                                        ? formik.errors.zipCode
                                        : ""
                                      : null}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mx-0 paymentGroup gap-2">
                        <div className="col-12 text-center">
                          <div className="form-check d-inline-block">
                            <input
                              className="form-check-input  bg-white shadow-none"
                              type="checkbox"
                              defaultValue
                              id="flexCheckDefault1"
                              onClick={() => setcheck(!check)}
                            />
                            <label
                              className="form-check-label fw-normal text-start"
                              htmlFor="flexCheckDefault1"
                            >
                              Before you proceed, please take a moment to read
                              and accept our terms and conditions.
                            </label>
                          </div>
                        </div>
                        <div className="col-12 text-center">
                          <button
                            type="submit"
                            disabled={!check || submitting}
                            className="btn paymentBtn border-0 text-white fw-medium"
                          >
                            {submitting
                              ? "Submitting"
                              : `Make Payment of $1,200`}
                          </button>
                        </div>
                        <div className="col-12 text-center timeingPyment fw-normal">
                          Lite Tier, Yearly
                        </div>
                      </div>
                    </Form>
                  </div>
                );
              }}
            </Formik>
          }
          {/* payment mode */}

          {/* {key && <StripeContainer id={key} comp="signin" />} */}
        </div>
      </div>
    </main>
  );
};

export default SignUp;
