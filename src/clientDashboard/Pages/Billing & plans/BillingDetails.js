import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar/Sidebar";
import Header from "../../Common/Header/Header";
import { addBlurClass } from "../../Common/Others/AddBlurClass";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import Select from "react-select";
import { Country, State } from "country-state-city";
import { ErrorText } from "../../Common/Others/ErrorText";
import { postData } from "../../Common/fetchservices";
import { useLocation, useNavigate } from "react-router-dom";
import { toaster } from "../../Common/Others/Toaster";
const BillingDetails = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  let item = location?.state?.item;
  let id = location?.state?.id;
  const navigate = useNavigate();
  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country?.name,
    value: country.isoCode,
    ...country,
  }));
  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state?.name,
      value: state?.isoCode,
      ...state,
    }));

  let fill = updatedCountries?.filter((el) => {
    return el?.isoCode == item?.country;
  });

  let fill1 = State?.getStatesOfCountry(item?.country).filter((el) => {
    return el?.name == item?.state;
  });

  const handleSubmit = async (val) => {
    let countryCode = updatedCountries.filter((el) => {
      return el.isoCode == val?.country;
    });
    let countryCode1 = updatedCountries.filter((el) => {
      return el.isoCode == val.country?.isoCode;
    });
    let stateCode = State?.getStatesOfCountry(val?.country).filter((el) => {
      return el.name == val?.state;
    });
    let stateCode1 = State?.getStatesOfCountry(val?.state?.countryCode).filter(
      (el) => {
        return el.name == val?.state?.name;
      }
    );
    const body = {
      client_id: id,
      country: countryCode[0]?.isoCode
        ? countryCode[0]?.isoCode
        : countryCode1[0]?.isoCode,
      street: val?.street,
      state: stateCode[0]?.name ? stateCode[0]?.name : stateCode1[0]?.name,
      postal_code: String(val?.postal_code),
      card_name: val?.name,
      card_number: String(val?.cardNumber)?.replace(/ +/g, ""),
      card_expiry_month: val?.expiry?.slice(0, 2),
      card_expiry_year: val?.expiry?.slice(3, 7),
      card_cvc: val?.cvc,
    };
    const res = await postData("update_billing_details", body);
    if (res?.result == "success") {
      toaster(true, "success");
      setTimeout(() => {
        navigate("/billing-plans");
      }, 2000);
    } else {
      toaster(false, "All Fields Required ");
    }
  };
  const validationschema = yup.object().shape({
    country: yup.mixed().required("Required!"),
    street: yup.string().required("Required!"),
    state: yup.mixed().required("Required!"),
    postal_code: yup
      .string()
      .required("Required!")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(5, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
    name: yup.string().required("Required!"),
    cardNumber: yup
      .string()
      .required("Required!")
      .min(19, "Enter valid card Number")
      .max(19, "Enter valid card Number"),
    expiry: yup.string().required("Required!").min(7).max(7),
    cvc: yup.string().required("Required").min(3).max(3),
  });

  useEffect(() => {
    addBlurClass();
  }, []);
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
                                  Update Billing Details
                                </div>
                                <div className="col pageSubheading px-0">
                                  Welcome Carmen, you can find all your billing
                                  history here.
                                </div>
                              </div>
                            </div>
                          </div>
                          <Formik
                            initialValues={{
                              country: item?.country ? item?.country : "",
                              street: item?.street ? item?.street : "",
                              state: item?.state ? item?.state : null,
                              postal_code: item?.postal_code
                                ? item?.postal_code
                                : "",
                              name: item?.card_name ? item?.card_name : "",
                              cardNumber: item?.card_number
                                ? item?.card_number
                                    ?.replace(/\s/g, "")
                                    ?.replace(/(\d{4})/g, "$1 ")
                                    ?.trim()
                                : "",
                              expiry:
                                item?.expiry_month && item?.expiry_year
                                  ? `${item?.expiry_month}${"/"}${
                                      item?.expiry_year
                                    }`
                                  : "",
                              cvc: item?.card_cvc ? item?.card_cvc : "",
                            }}
                            onSubmit={(value, resetForm) =>
                              handleSubmit(value, resetForm)
                            }
                            validationSchema={validationschema}
                          >
                            {({
                              values,
                              setValues,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                            }) => {
                              return (
                                <Form>
                                  <div className="row">
                                    <div className="col-xl-6 col-12 pe-xl-5 pe-4 formPadding">
                                      <div className="row billingAddressForm">
                                        <div className="col-12">
                                          <div className="billingAddressFormHead">
                                            Billing Address
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <label htmlFor className="formLbl">
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
                                              }),
                                            }}
                                            id="country"
                                            name="country"
                                            label="country"
                                            placeholder="Choose country"
                                            defaultInputValue={fill[0]?.name}
                                            options={updatedCountries}
                                            value={values.country}
                                            onChange={(value) => {
                                              setValues(
                                                {
                                                  country: value.name,
                                                  state: values.state,
                                                  street: values.street,
                                                  postal_code:
                                                    values.postal_code,
                                                  name: values.name,
                                                  cardNumber: values.cardNumber,
                                                  expiry: values.expiry,
                                                  cvc: values.cvc,
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
                                                target: { name: "country" },
                                              });
                                            }}
                                          />
                                        </div>
                                        {touched.country && errors.country ? (
                                          <ErrorMessage
                                            name="country"
                                            component={ErrorText}
                                          />
                                        ) : null}
                                        <div className="col-12">
                                          <label htmlFor className="formLbl">
                                            Street
                                          </label>
                                          <Field
                                            type="text"
                                            name="street"
                                            className="formInp form-control"
                                            id="street"
                                            placeholder="1 Beavers Rd"
                                            value={values.street}
                                          />
                                        </div>
                                        {touched.street && errors.street ? (
                                          <ErrorMessage
                                            name="street"
                                            component={ErrorText}
                                          />
                                        ) : null}

                                        <div className="col-12">
                                          <label htmlFor className="formLbl">
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
                                            defaultInputValue={fill1[0]?.name}
                                            options={updatedStates(
                                              values.country
                                                ? values.country.value
                                                : null
                                            )}
                                            value={values.state}
                                            onChange={(value) => {
                                              setValues(
                                                {
                                                  country: values.country,
                                                  state: value.name,
                                                  street: values.street,
                                                  postal_code:
                                                    values.postal_code,
                                                  name: values.name,
                                                  cardNumber: values.cardNumber,
                                                  expiry: values.expiry,
                                                  cvc: values.cvc,
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
                                                target: { name: "state" },
                                              });
                                            }}
                                          />
                                        </div>
                                        {touched.state && errors.state ? (
                                          <ErrorMessage
                                            name="state"
                                            component={ErrorText}
                                          />
                                        ) : null}
                                        <div className="col-12">
                                          <label htmlFor className="formLbl">
                                            Postal Code
                                          </label>
                                          <Field
                                            type="number"
                                            className="formInp form-control"
                                            name="postal_code"
                                            id="postal_code"
                                            placeholder="VIC 4456"
                                          />
                                        </div>
                                        {touched.postal_code &&
                                        errors.postal_code ? (
                                          <ErrorMessage
                                            name="postal_code"
                                            component={ErrorText}
                                          />
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="col-xl-6 col-12 pe-xl-5 pe-4 py-5 py-xl-0 formPadding formPadding1">
                                      <div className="row billingAddressForm">
                                        <div className="col-12">
                                          <div className="billingAddressFormHead">
                                            Credit Card Information
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <label htmlFor className="formLbl">
                                            Name on Card
                                          </label>
                                          <Field
                                            type="text"
                                            className="formInp form-control"
                                            name="name"
                                            id="name"
                                            // value={values?.name}
                                            placeholder="Name on card"
                                          />
                                        </div>
                                        {touched.name && errors.name ? (
                                          <ErrorMessage
                                            name="name"
                                            component={ErrorText}
                                          />
                                        ) : null}
                                        <div className="col-12 position-relative">
                                          <label htmlFor className="formLbl">
                                            Credit Card Number
                                          </label>
                                          <Field
                                            type="text"
                                            maxLength="19"
                                            className="formInp form-control"
                                            name="cardNumber"
                                            value={values.cardNumber
                                              ?.replace(/\s/g, "")
                                              ?.replace(/(\d{4})/g, "$1 ")
                                              ?.trim()}
                                            id="cardNumber"
                                            placeholder="1234  5678  9999 3456"
                                          />
                                          <div className="imgParent">
                                            <a href="javascript:;">
                                              <img
                                                src="assets/img/svg/share1.svg"
                                                alt
                                              />
                                            </a>
                                            <a href="javascript:;">
                                              <img
                                                src="assets/img/svg/share2.svg"
                                                alt
                                              />
                                            </a>
                                            <a href="javascript:;">
                                              <img
                                                src="./assets/img/svg/Visa.svg"
                                                alt
                                              />
                                            </a>
                                            <a href="javascript:;">
                                              <img
                                                src="assets/img/svg/DinersClub.svg"
                                                alt
                                              />
                                            </a>
                                          </div>
                                        </div>
                                        {touched.cardNumber &&
                                        errors.cardNumber ? (
                                          <ErrorMessage
                                            name="cardNumber"
                                            component={ErrorText}
                                          />
                                        ) : null}
                                        <div className="col-12">
                                          <div className="row">
                                            <div className="col-6">
                                              <label
                                                htmlFor
                                                className="formLbl"
                                              >
                                                Expiry
                                              </label>
                                              <Field
                                                type="text"
                                                maxLength="7"
                                                className="formInp form-control"
                                                name="expiry"
                                                id="expiry"
                                                placeholder="04/29"
                                                value={values.expiry
                                                  ?.replace(
                                                    /^([1-9]\/|[2-9])$/g,
                                                    "0$1/" // 3 > 03/
                                                  )
                                                  ?.replace(
                                                    /^(0[1-9]|1[0-2])$/g,
                                                    "$1/" // 11 > 11/
                                                  )
                                                  ?.replace(
                                                    /^([0-1])([3-9])$/g,
                                                    "0$1/$2" // 13 > 01/3
                                                  )
                                                  ?.replace(
                                                    /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
                                                    "$1/$2" // 141 > 01/41
                                                  )
                                                  ?.replace(
                                                    /^([0]+)\/|[0]+$/g,
                                                    "0" // 0/ > 0 and 00 > 0
                                                  )
                                                  ?.replace(
                                                    /[^\d\/]|^[\/]*$/g,
                                                    "" // To allow only digits and `/`
                                                  )
                                                  ?.replace(
                                                    /\/\//g,
                                                    "/" // Prevent entering more than 1 `/`
                                                  )}
                                              />
                                            </div>
                                            {touched.expiry && errors.expiry ? (
                                              <ErrorMessage
                                                name="expiry"
                                                component={ErrorText}
                                              />
                                            ) : null}
                                            <div className="col-6">
                                              <label
                                                htmlFor
                                                className="formLbl"
                                              >
                                                CVC
                                              </label>
                                              <Field
                                                type="text"
                                                maxLength="3"
                                                className="formInp form-control"
                                                name="cvc"
                                                id="cvc"
                                                placeholder={979}
                                              />
                                            </div>
                                            {touched.cvc && errors.cvc ? (
                                              <ErrorMessage
                                                name="cvc"
                                                component={ErrorText}
                                              />
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12 py-5 d-flex justify-content-end pe-xl-5 pe-4">
                                      <button
                                        type="reset"
                                        onClick={() => window.history.back()}
                                        className="cancleBtn"
                                      >
                                        Cancle
                                      </button>
                                      <button
                                        type="submit"
                                        className="applyBtn"
                                      >
                                        Apply Changes
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingDetails;
