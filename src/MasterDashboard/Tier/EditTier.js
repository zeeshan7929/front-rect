import React, { useEffect, useState } from "react";
import Sidebar from "../Common/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import * as Yup from "yup";
import { SelectColors } from "../../clientDashboard/Common/Others/SelectColors";
import { postData } from "../../clientDashboard/Common/fetchservices";
import { toaster } from "../../clientDashboard/Common/Others/Toaster";
import { ToastContainer } from "react-toastify";
import { addBlurClass } from "../../clientDashboard/Common/Others/AddBlurClass";
import { Header } from "../Common/Header/Header";

const EditTier = ({ sideBar, setSidebarOpen }) => {
  const location = useLocation();
  const Editvalue = location.state.item;

  const [initialValue, setInitialValue] = useState({
    tierName: Editvalue.name,
    tokenUsageLimit: "",
    trainingToken: Editvalue.training_tokens,
    numberOfDPA: Editvalue.num_of_dpa,
    numberOfUsers: Editvalue.num_of_users,
    pricingMonthly: Editvalue.pricing_monthly,
    pricingYearly: Editvalue.pricing_yearly,
    colorTag: "",
  });

  const validationschema = yup.object().shape({
    tierName: Yup.string().required("Please Enter Tier Name"),
    tokenUsageLimit: Yup.string().required("Please Enter Token Usage Limit"),
    trainingToken: Yup.string().required("Training Token is required"),
    numberOfDPA: Yup.string().required("Number of DPA is required"),
    numberOfUsers: Yup.string().required("Number of users is required"),
    pricingMonthly: Yup.string().required("Pricing(monthly) is required"),
    pricingYearly: Yup.string().required("Pricing(yearly) is required"),
  });

  const Handler = async (value, { resetForm }) => {
    let id = Editvalue.id;
    const body = {
      tier_id: String(id),
      name: value.tierName,
      training_token: value.trainingToken,
      token_usage_limit: value.tokenUsageLimit,
      number_of_dpa: value.numberOfDPA,
      number_of_users: value.numberOfUsers,
      pricing_monthly: value.pricingMonthly,
      pricing_yearly: value.pricingYearly,
      price_id_monthly: "price_1N1ceMGJ76zzZMRvFNYSYi7b",
      price_id_yearly: "price_1N1ceMGJ76zzZMRvTGGlr7oi",
      product_id: "prod_NnD4JJAUck9smW",
      color: value.colorTag,
    };
    const res = await postData("m_edit_tier", body);
    if (res.result == "success") {
      resetForm();
      toaster(true);
    } else {
      toaster(false);
    }
  };

  useEffect(() => {
    Handler();
    addBlurClass();
  }, []);
  return (
    <main className="container-fluid h-100">
      <ToastContainer autoClose={1000}></ToastContainer>
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
                  <Sidebar sideBar={sideBar} setSidebarOpen={setSidebarOpen}/>
                </div>
              </div>
              <div className="col rightBgPart px-0 h-100">
                <div className="row mx-0 h-100 justify-content-center">
                  <div className="col-8 px-0 rightPart singleRightPart h-100">
                    <div className="row mx-0 flex-column h-100 flex-nowrap px-3 ps-lg-0 pe-xxl-0">
                      <div className="col-12 px-0 mainContent overflow-hidden h-100 flex-fill">
                        <div className="row h-100 mx-0">
                          <div className="col-12 overflow-hidden-auto h-100 px-0 scrollPart">
                            <div className="row mx-0 sticky-top stickyHeader">
                            <Header
                                title={"Edit Tier"}
                                setSidebarOpen={setSidebarOpen}
                              />
                            </div>
                            <div className="row mx-0 justify-content-center">
                              <div className="col-xxl-8">
                                <div className="row py-3">
                                  <div className="col-12 px-0">
                                    <div className="row flex-column mx-0 d-md-none headerHiddenDetails mb-3">
                                      <div className="col pageHeading px-0">
                                        Edit Tier
                                      </div>
                                    </div>
                                    {
                                      <Formik
                                        initialValues={initialValue}
                                        onSubmit={(value, resetForm) =>
                                          Handler(value, resetForm)
                                        }
                                        validationSchema={validationschema}
                                      >
                                        {(formik) => {
                                          return (
                                            <Form>
                                              <div className="row">
                                                <div className="col-12">
                                                  <div className="addTierForm">
                                                    <div className="row">
                                                      <div className="col-12">
                                                        <div className="addTierFormMainHead">
                                                          Edit Tier
                                                        </div>
                                                      </div>
                                                      <div className="col-12">
                                                        <div className="addTierFormsUBHeaD">
                                                          Edit only the fields
                                                          you need to.{" "}
                                                        </div>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Tier Name
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Tier Name"
                                                          name="tierName"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .tierName &&
                                                          formik.errors.tierName
                                                            ? formik.errors
                                                                .tierName
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Token Usage Limit
                                                          (Monthly)
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Token Usage Limit (Monthly)"
                                                          name="tokenUsageLimit"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .tokenUsageLimit &&
                                                          formik.errors
                                                            .tokenUsageLimit
                                                            ? formik.errors
                                                                .tokenUsageLimit
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Training Token
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Training Token"
                                                          name="trainingToken"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .trainingToken &&
                                                          formik.errors
                                                            .trainingToken
                                                            ? formik.errors
                                                                .trainingToken
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Number of DPA
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="No. of DPA"
                                                          name="numberOfDPA"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .numberOfDPA &&
                                                          formik.errors
                                                            .numberOfDPA
                                                            ? formik.errors
                                                                .numberOfDPA
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Number of Users
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="No. of Users"
                                                          name="numberOfUsers"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .numberOfUsers &&
                                                          formik.errors
                                                            .numberOfUsers
                                                            ? formik.errors
                                                                .numberOfUsers
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Pricing (Monthly)
                                                        </label>

                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Pricing (Monthly)"
                                                          name="pricingMonthly"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .pricingMonthly &&
                                                          formik.errors
                                                            .pricingMonthly
                                                            ? formik.errors
                                                                .pricingMonthly
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12 mb-2">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Pricing (Yearly)
                                                        </label>
                                                        <Field
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Pricing (Yearly)"
                                                          name="pricingYearly"
                                                        />
                                                        <p className="text-danger">
                                                          {formik.touched
                                                            .pricingYearly &&
                                                          formik.errors
                                                            .pricingYearly
                                                            ? formik.errors
                                                                .pricingYearly
                                                            : ""}
                                                        </p>
                                                      </div>
                                                      <div className="col-12">
                                                        <label
                                                          for=""
                                                          className="tireLbl"
                                                        >
                                                          Select colour tag
                                                        </label>
                                                        <div className="box d-flex align-items-center">
                                                          <Field
                                                            as="select"
                                                            name="colorTag"
                                                            className="form-select tierSelect"
                                                            aria-label="Default select example"
                                                          >
                                                            <option selected>
                                                              Select colour
                                                            </option>
                                                            {SelectColors.map(
                                                              (color) => {
                                                                return (
                                                                  <option
                                                                    value={
                                                                      color.hex
                                                                    }
                                                                  >
                                                                    {color.name}
                                                                  </option>
                                                                );
                                                              }
                                                            )}
                                                          </Field>
                                                          <label
                                                            className="colour ms-3"
                                                            style={{
                                                              backgroundColor:
                                                                formik.values
                                                                  .colorTag,
                                                            }}
                                                          ></label>
                                                        </div>
                                                      </div>
                                                      <div className="col-12 d-flex justify-content-center mt-5 mb-2">
                                                        <button className="cancleBtn">
                                                          Cancel
                                                        </button>
                                                        <button
                                                          type="submit"
                                                          className="addBtn"
                                                        >
                                                          Save Changes
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditTier;
